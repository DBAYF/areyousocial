// Client-side recommendations (free tier compatible)
// This replaces the Cloud Functions recommendation engine

import { NextRequest, NextResponse } from 'next/server'
import { getFirestore } from 'firebase-admin/firestore'
import { initializeApp, getApps, cert } from 'firebase-admin/app'

const firebaseConfig = {
  projectId: process.env.FIRESTORE_PROJECT_ID,
  credential: cert({
    projectId: process.env.FIRESTORE_PROJECT_ID,
    clientEmail: process.env.FIRESTORE_CLIENT_EMAIL,
    privateKey: process.env.FIRESTORE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }),
}

// Initialize Firebase Admin only if not already initialized
if (!getApps().length) {
  initializeApp(firebaseConfig)
}

const db = getFirestore()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const type = searchParams.get('type') as 'connection' | 'opportunity' | 'content' | 'skill'
    const limit = parseInt(searchParams.get('limit') || '10')

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    let recommendations: any[] = []

    switch (type) {
      case 'connection':
        recommendations = await getConnectionRecommendations(userId, limit)
        break
      case 'opportunity':
        recommendations = await getOpportunityRecommendations(userId, limit)
        break
      case 'content':
        recommendations = await getContentRecommendations(userId, limit)
        break
      case 'skill':
        recommendations = await getSkillRecommendations(userId, limit)
        break
      default:
        return NextResponse.json({ error: 'Invalid recommendation type' }, { status: 400 })
    }

    return NextResponse.json({
      recommendations,
      generatedAt: new Date(),
    })

  } catch (error) {
    console.error('Recommendations API error:', error)
    return NextResponse.json({ error: 'Failed to generate recommendations' }, { status: 500 })
  }
}

async function getConnectionRecommendations(userId: string, limit: number) {
  try {
    // Get user's profile
    const userDoc = await db.collection('users').doc(userId).get()
    if (!userDoc.exists) return []

    const userData = userDoc.data()!
    const userSkills = userData.skills || []
    const userInterests = userData.interests || []

    // Simple recommendation: find users with similar skills/interests
    const recommendations = []

    // Get some recent users (simplified approach)
    const usersSnapshot = await db.collection('users')
      .where('status', '==', 'active')
      .limit(50)
      .get()

    for (const doc of usersSnapshot.docs) {
      if (doc.id === userId) continue

      const otherUser = doc.data()
      const otherSkills = otherUser.skills || []
      const otherInterests = otherUser.interests || []

      // Calculate simple similarity score
      const skillMatches = userSkills.filter((skill: string) =>
        otherSkills.includes(skill)
      ).length

      const interestMatches = userInterests.filter((interest: string) =>
        otherInterests.includes(interest)
      ).length

      const score = skillMatches * 2 + interestMatches

      if (score > 0 && recommendations.length < limit) {
        recommendations.push({
          id: `connection_${doc.id}`,
          type: 'connection',
          title: `Connect with ${otherUser.display_name}`,
          description: `Shares ${skillMatches} skills and ${interestMatches} interests with you`,
          relevanceScore: score,
          reason: `Skill and interest matches`,
          targetId: doc.id,
          metadata: {
            sharedSkills: skillMatches,
            sharedInterests: interestMatches,
          },
        })
      }
    }

    return recommendations

  } catch (error) {
    console.error('Connection recommendations error:', error)
    return []
  }
}

async function getOpportunityRecommendations(userId: string, limit: number) {
  try {
    // Get user's skills
    const userDoc = await db.collection('users').doc(userId).get()
    if (!userDoc.exists) return []

    const userSkills = userDoc.data()?.skills || []

    // Get recent opportunities
    const opportunitiesSnapshot = await db.collection('opportunities')
      .where('status', '==', 'approved')
      .orderBy('created_at', 'desc')
      .limit(20)
      .get()

    const recommendations = []

    for (const doc of opportunitiesSnapshot.docs) {
      const opportunity = doc.data()
      const requiredSkills = opportunity.required_skills || []
      const preferredSkills = opportunity.preferred_skills || []

      // Check skill matches
      const skillMatches = userSkills.filter((skill: string) =>
        requiredSkills.includes(skill) || preferredSkills.includes(skill)
      ).length

      if (skillMatches > 0 && recommendations.length < limit) {
        recommendations.push({
          id: `opportunity_${doc.id}`,
          type: 'opportunity',
          title: opportunity.title,
          description: `${opportunity.company}: ${opportunity.description?.substring(0, 100)}...`,
          relevanceScore: skillMatches * 10,
          reason: `${skillMatches} matching skills`,
          targetId: doc.id,
          metadata: {
            skillMatches,
            company: opportunity.company,
          },
        })
      }
    }

    return recommendations

  } catch (error) {
    console.error('Opportunity recommendations error:', error)
    return []
  }
}

async function getContentRecommendations(userId: string, limit: number) {
  try {
    // Get user's connections
    const connectionsSnapshot = await db.collection('connections')
      .where('participants', 'array-contains', userId)
      .where('status', '==', 'accepted')
      .limit(20)
      .get()

    const connectionIds = connectionsSnapshot.docs.map(doc => {
      const data = doc.data()
      return data.participants.find((p: string) => p !== userId)
    }).filter(Boolean)

    if (connectionIds.length === 0) return []

    // Get recent posts from connections
    const postsSnapshot = await db.collection('posts')
      .where('author_id', 'in', connectionIds.slice(0, 10))
      .where('status', '==', 'published')
      .orderBy('created_at', 'desc')
      .limit(limit)
      .get()

    return postsSnapshot.docs.map(doc => {
      const post = doc.data()
      return {
        id: `content_${doc.id}`,
        type: 'content',
        title: post.title || 'Recent Post',
        description: post.content?.substring(0, 150) + '...',
        relevanceScore: 50, // Base score for connection content
        reason: 'From your network',
        targetId: doc.id,
        metadata: {
          author_id: post.author_id,
          tags: post.tags || [],
        },
      }
    })

  } catch (error) {
    console.error('Content recommendations error:', error)
    return []
  }
}

async function getSkillRecommendations(userId: string, limit: number) {
  try {
    // Get user's current profile
    const userDoc = await db.collection('users').doc(userId).get()
    if (!userDoc.exists) return []

    const userData = userDoc.data()!
    const currentSkills = userData.skills || []
    const experience = userData.experience || 0

    // Simple skill suggestions based on experience level
    const skillSuggestions = {
      beginner: [
        'Project Management',
        'Communication',
        'Problem Solving',
        'Time Management',
        'Basic Coding',
      ],
      intermediate: [
        'Leadership',
        'Strategic Planning',
        'Data Analysis',
        'Marketing',
        'Financial Modeling',
      ],
      advanced: [
        'Team Scaling',
        'Fundraising',
        'Mergers & Acquisitions',
        'International Business',
        'Advanced Analytics',
      ],
    }

    let category = 'beginner'
    if (experience > 5) category = 'intermediate'
    if (experience > 10) category = 'advanced'

    const availableSkills = skillSuggestions[category as keyof typeof skillSuggestions]
      .filter(skill => !currentSkills.includes(skill))
      .slice(0, limit)

    return availableSkills.map((skill, index) => ({
      id: `skill_${index}`,
      type: 'skill',
      title: skill,
      description: `Recommended skill for your experience level`,
      relevanceScore: 100 - index * 5,
      reason: 'Based on your experience and career goals',
      metadata: {
        category: 'professional_development',
        experienceLevel: category,
      },
    }))

  } catch (error) {
    console.error('Skill recommendations error:', error)
    return []
  }
}