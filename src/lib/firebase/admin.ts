// Firebase Admin SDK for server-side operations

import * as admin from 'firebase-admin'

// Initialize Firebase Admin (only on server)
if (!admin.apps.length) {
  const serviceAccount = {
    type: 'service_account',
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://oauth2.googleapis.com/token',
    auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
  }

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`,
  })
}

// Export admin services
export const adminAuth = admin.auth()
export const adminFirestore = admin.firestore()
export const adminStorage = admin.storage()

// Admin helper functions
export const adminHelpers = {
  // Verify Firebase ID token
  async verifyIdToken(token: string) {
    try {
      const decodedToken = await adminAuth.verifyIdToken(token)
      return { decodedToken, error: null }
    } catch (error) {
      return { decodedToken: null, error }
    }
  },

  // Create custom token
  async createCustomToken(uid: string, additionalClaims?: any) {
    try {
      const customToken = await adminAuth.createCustomToken(uid, additionalClaims)
      return { customToken, error: null }
    } catch (error) {
      return { customToken: null, error }
    }
  },

  // Get user by UID
  async getUser(uid: string) {
    try {
      const userRecord = await adminAuth.getUser(uid)
      return { user: userRecord, error: null }
    } catch (error) {
      return { user: null, error }
    }
  },

  // Update user claims
  async setCustomUserClaims(uid: string, claims: any) {
    try {
      await adminAuth.setCustomUserClaims(uid, claims)
      return { error: null }
    } catch (error) {
      return { error }
    }
  },

  // Delete user
  async deleteUser(uid: string) {
    try {
      await adminAuth.deleteUser(uid)
      return { error: null }
    } catch (error) {
      return { error }
    }
  },

  // Firestore operations
  async getDocument(collection: string, docId: string) {
    try {
      const doc = await adminFirestore.collection(collection).doc(docId).get()
      return { data: doc.exists ? { id: doc.id, ...doc.data() } : null, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  async setDocument(collection: string, docId: string, data: any) {
    try {
      await adminFirestore.collection(collection).doc(docId).set({
        ...data,
        updated_at: admin.firestore.FieldValue.serverTimestamp(),
      }, { merge: true })
      return { error: null }
    } catch (error) {
      return { error }
    }
  },

  async deleteDocument(collection: string, docId: string) {
    try {
      await adminFirestore.collection(collection).doc(docId).delete()
      return { error: null }
    } catch (error) {
      return { error }
    }
  },

  // Query documents
  async queryDocuments(collection: string, conditions: any[] = []) {
    try {
      let query = adminFirestore.collection(collection)

      for (const condition of conditions) {
        const { field, operator, value } = condition
        query = query.where(field, operator, value)
      }

      const snapshot = await query.get()
      const documents = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))

      return { documents, error: null }
    } catch (error) {
      return { documents: null, error }
    }
  },
}

// Export admin instance for direct use
export { admin }