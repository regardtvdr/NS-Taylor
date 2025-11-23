import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
  QueryConstraint,
  DocumentData,
  QueryDocumentSnapshot,
} from 'firebase/firestore'
import { db } from '../config/firebase'

// Helper function to convert Firestore timestamp to date string
export const timestampToDateString = (timestamp: Timestamp | Date | string): string => {
  if (typeof timestamp === 'string') return timestamp
  if (timestamp instanceof Date) {
    return timestamp.toISOString().split('T')[0]
  }
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate().toISOString().split('T')[0]
  }
  return new Date().toISOString().split('T')[0]
}

// Helper function to convert date string to Firestore timestamp
export const dateStringToTimestamp = (dateString: string): Timestamp => {
  return Timestamp.fromDate(new Date(dateString))
}

// Generic CRUD operations
export class FirestoreService {
  private collectionName: string

  constructor(collectionName: string) {
    this.collectionName = collectionName
  }

  // Get all documents
  async getAll(constraints: QueryConstraint[] = []): Promise<DocumentData[]> {
    const collectionRef = collection(db, this.collectionName)
    const q = constraints.length > 0 
      ? query(collectionRef, ...constraints)
      : query(collectionRef)
    
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
  }

  // Get a single document by ID
  async getById(id: string): Promise<DocumentData | null> {
    const docRef = doc(db, this.collectionName, id)
    const docSnap = await getDoc(docRef)
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      }
    }
    return null
  }

  // Create a new document
  async create(data: any): Promise<string> {
    const collectionRef = collection(db, this.collectionName)
    const docRef = await addDoc(collectionRef, {
      ...data,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    })
    return docRef.id
  }

  // Update an existing document
  async update(id: string, data: Partial<any>): Promise<void> {
    const docRef = doc(db, this.collectionName, id)
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now(),
    })
  }

  // Delete a document
  async delete(id: string): Promise<void> {
    const docRef = doc(db, this.collectionName, id)
    await deleteDoc(docRef)
  }

  // Get documents with filters
  async getWhere(field: string, operator: any, value: any): Promise<DocumentData[]> {
    const collectionRef = collection(db, this.collectionName)
    const q = query(collectionRef, where(field, operator, value))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
  }

  // Get documents ordered by field
  async getOrderedBy(field: string, direction: 'asc' | 'desc' = 'asc'): Promise<DocumentData[]> {
    const collectionRef = collection(db, this.collectionName)
    const q = query(collectionRef, orderBy(field, direction))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
  }
}

