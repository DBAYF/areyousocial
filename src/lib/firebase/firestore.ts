// Firestore helpers with typed collections

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  DocumentData,
  QueryDocumentSnapshot,
  Timestamp,
  writeBatch,
  onSnapshot,
  Query,
  DocumentReference,
  CollectionReference,
} from 'firebase/firestore'
import { db, COLLECTIONS } from './config'

// Type-safe collection references
export const collections = {
  users: collection(db, COLLECTIONS.USERS),
  profiles: collection(db, COLLECTIONS.PROFILES),
  posts: collection(db, COLLECTIONS.POSTS),
  comments: collection(db, COLLECTIONS.COMMENTS),
  likes: collection(db, COLLECTIONS.LIKES),
  threads: collection(db, COLLECTIONS.THREADS),
  messages: collection(db, COLLECTIONS.MESSAGES),
  connections: collection(db, COLLECTIONS.CONNECTIONS),
  opportunities: collection(db, COLLECTIONS.OPPORTUNITIES),
  applications: collection(db, COLLECTIONS.APPLICATIONS),
  savedOpportunities: collection(db, COLLECTIONS.SAVED_OPPORTUNITIES),
  recommendations: collection(db, COLLECTIONS.RECOMMENDATIONS),
  nextMoves: collection(db, COLLECTIONS.NEXT_MOVES),
  quickActions: collection(db, COLLECTIONS.QUICK_ACTIONS),
  notifications: collection(db, COLLECTIONS.NOTIFICATIONS),
  reports: collection(db, COLLECTIONS.REPORTS),
  auditLogs: collection(db, COLLECTIONS.AUDIT_LOGS),
  userAnalysis: collection(db, COLLECTIONS.USER_ANALYSIS),
} as const

// Generic document operations
export class FirestoreService {
  // Create document
  static async create<T extends DocumentData>(
    collectionRef: CollectionReference<T>,
    id: string,
    data: T
  ): Promise<void> {
    const docRef = doc(collectionRef, id)
    await setDoc(docRef, {
      ...data,
      created_at: Timestamp.now(),
      updated_at: Timestamp.now(),
    })
  }

  // Read document
  static async get<T extends DocumentData>(
    collectionRef: CollectionReference<T>,
    id: string
  ): Promise<T | null> {
    const docRef = doc(collectionRef, id)
    const docSnap = await getDoc(docRef)
    return docSnap.exists() ? (docSnap.data() as T) : null
  }

  // Update document
  static async update<T extends DocumentData>(
    collectionRef: CollectionReference<T>,
    id: string,
    data: Partial<T>
  ): Promise<void> {
    const docRef = doc(collectionRef, id)
    await updateDoc(docRef, {
      ...data,
      updated_at: Timestamp.now(),
    })
  }

  // Delete document
  static async delete(
    collectionRef: CollectionReference,
    id: string
  ): Promise<void> {
    const docRef = doc(collectionRef, id)
    await deleteDoc(docRef)
  }

  // Query documents
  static async query<T extends DocumentData>(
    collectionRef: CollectionReference<T>,
    constraints: any[] = [],
    options: { limit?: number } = {}
  ): Promise<T[]> {
    let q = query(collectionRef, ...constraints)

    if (options.limit) {
      q = query(q, limit(options.limit))
    }

    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as T)
  }

  // Paginated query
  static async queryPaginated<T extends DocumentData>(
    collectionRef: CollectionReference<T>,
    constraints: any[] = [],
    options: {
      limit: number
      startAfter?: QueryDocumentSnapshot<T>
    }
  ): Promise<{ data: T[]; hasMore: boolean; lastDoc?: QueryDocumentSnapshot<T> }> {
    let q = query(collectionRef, ...constraints, limit(options.limit + 1))

    if (options.startAfter) {
      q = query(q, startAfter(options.startAfter))
    }

    const querySnapshot = await getDocs(q)
    const docs = querySnapshot.docs

    const hasMore = docs.length > options.limit
    const data = docs.slice(0, options.limit).map(doc =>
      ({ id: doc.id, ...doc.data() }) as T
    )
    const lastDoc = docs[options.limit - 1]

    return { data, hasMore, lastDoc }
  }

  // Real-time listener
  static listen<T extends DocumentData>(
    collectionRef: CollectionReference<T>,
    constraints: any[] = [],
    callback: (data: T[]) => void,
    options: { limit?: number } = {}
  ): () => void {
    let q: Query<T> = query(collectionRef, ...constraints)

    if (options.limit) {
      q = query(q, limit(options.limit))
    }

    return onSnapshot(q, (querySnapshot) => {
      const data = querySnapshot.docs.map(doc =>
        ({ id: doc.id, ...doc.data() }) as T
      )
      callback(data)
    })
  }

  // Batch operations
  static async batchWrite(operations: Array<{
    type: 'create' | 'update' | 'delete'
    collection: CollectionReference
    id: string
    data?: any
  }>): Promise<void> {
    const batch = writeBatch(db)

    for (const op of operations) {
      const docRef = doc(op.collection, op.id)

      switch (op.type) {
        case 'create':
          batch.set(docRef, {
            ...op.data,
            created_at: Timestamp.now(),
            updated_at: Timestamp.now(),
          })
          break
        case 'update':
          batch.update(docRef, {
            ...op.data,
            updated_at: Timestamp.now(),
          })
          break
        case 'delete':
          batch.delete(docRef)
          break
      }
    }

    await batch.commit()
  }
}

// Specific collection helpers
export const userService = {
  create: (id: string, data: any) => FirestoreService.create(collections.users, id, data),
  get: (id: string) => FirestoreService.get(collections.users, id),
  update: (id: string, data: any) => FirestoreService.update(collections.users, id, data),
  delete: (id: string) => FirestoreService.delete(collections.users, id),
}

export const profileService = {
  create: (id: string, data: any) => FirestoreService.create(collections.profiles, id, data),
  get: (id: string) => FirestoreService.get(collections.profiles, id),
  update: (id: string, data: any) => FirestoreService.update(collections.profiles, id, data),
  delete: (id: string) => FirestoreService.delete(collections.profiles, id),
}

export const postService = {
  create: (id: string, data: any) => FirestoreService.create(collections.posts, id, data),
  get: (id: string) => FirestoreService.get(collections.posts, id),
  update: (id: string, data: any) => FirestoreService.update(collections.posts, id, data),
  delete: (id: string) => FirestoreService.delete(collections.posts, id),
  query: (constraints: any[], options?: any) =>
    FirestoreService.query(collections.posts, constraints, options),
  listen: (constraints: any[], callback: any, options?: any) =>
    FirestoreService.listen(collections.posts, constraints, callback, options),
}

export const messageService = {
  create: (id: string, data: any) => FirestoreService.create(collections.messages, id, data),
  get: (id: string) => FirestoreService.get(collections.messages, id),
  update: (id: string, data: any) => FirestoreService.update(collections.messages, id, data),
  delete: (id: string) => FirestoreService.delete(collections.messages, id),
  query: (constraints: any[], options?: any) =>
    FirestoreService.query(collections.messages, constraints, options),
}

export const connectionService = {
  create: (id: string, data: any) => FirestoreService.create(collections.connections, id, data),
  get: (id: string) => FirestoreService.get(collections.connections, id),
  update: (id: string, data: any) => FirestoreService.update(collections.connections, id, data),
  delete: (id: string) => FirestoreService.delete(collections.connections, id),
  query: (constraints: any[], options?: any) =>
    FirestoreService.query(collections.connections, constraints, options),
}

export const opportunityService = {
  create: (id: string, data: any) => FirestoreService.create(collections.opportunities, id, data),
  get: (id: string) => FirestoreService.get(collections.opportunities, id),
  update: (id: string, data: any) => FirestoreService.update(collections.opportunities, id, data),
  delete: (id: string) => FirestoreService.delete(collections.opportunities, id),
  query: (constraints: any[], options?: any) =>
    FirestoreService.query(collections.opportunities, constraints, options),
}

// Utility functions
export function createDocId(...parts: string[]): string {
  return parts.join('_')
}

export function parseDocId(id: string): string[] {
  return id.split('_')
}

// Timestamp utilities
export function toTimestamp(date: Date): Timestamp {
  return Timestamp.fromDate(date)
}

export function fromTimestamp(timestamp: Timestamp): Date {
  return timestamp.toDate()
}

export function now(): Timestamp {
  return Timestamp.now()
}