import { collection, query, where, getDocs, addDoc, doc, deleteDoc, updateDoc, QueryConstraint, getDoc } from "firebase/firestore";
import { db } from "@/firebase/config";

interface Creatable<T> {
  createDocument(userId: string, data: Omit<T, "id" | "createdAt" | "updatedAt" | "userId">): Promise<string>;
}

interface Readable<T> {
  getDocumentsByUserId(userId: string, options?: QueryOptions): Promise<T[]>;
}

interface Updatable<T> {
  updateDocument(documentId: string, data: Partial<T>): Promise<void>;
}

interface Deletable {
  deleteDocument(documentId: string): Promise<void>;
}

interface QueryOptions {
  orderByField?: string;
  orderDirection?: "asc" | "desc";
  limitCount?: number;
}

export class FirebaseService<R> implements Creatable<R>, Readable<R>, Updatable<R>, Deletable {
  private collectionName: string;

  constructor(collectionName: string) {
    this.collectionName = collectionName;
  }

  async getDocumentsByUserId(
    userId: string
    // options?: QueryOptions,
  ): Promise<R[]> {
    try {
      const collectionRef = collection(db, this.collectionName);

      // Build query constraints dynamically
      const constraints: QueryConstraint[] = [where("userId", "==", userId)];

      const q = query(collectionRef, ...constraints);
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map((snapshotDoc) => ({
        id: snapshotDoc.id,
        ...snapshotDoc.data(),
      })) as R[];
    } catch (error) {
      console.error(`Error fetching data from ${this.collectionName}:`, error);
      throw new Error(`Failed to fetch data from ${this.collectionName}`);
    }
  }

  async createDocument(userId: string, data: Omit<R, "id" | "createdAt" | "updatedAt" | "userId">): Promise<string> {
    try {
      const collectionRef = collection(db, this.collectionName);
      const docRef = await addDoc(collectionRef, {
        userId,
        ...data,
        createdAt: new Date().toISOString(), // Automatically add timestamp
      });
      return docRef.id;
    } catch (error) {
      console.error(`Error adding document to ${this.collectionName}:`, error);
      throw new Error(`Failed to add document to ${this.collectionName}`);
    }
  }

  async deleteDocument(documentId: string): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, documentId);
      await deleteDoc(docRef);
    } catch (error) {
      console.error(`Error deleting document from ${this.collectionName}:`, error);
      throw new Error(`Failed to delete document from ${this.collectionName}`);
    }
  }

  async updateDocument(documentId: string, data: Partial<R>): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, documentId);
      await updateDoc(docRef, {
        ...data,
        updatedAt: new Date().toISOString(), // Automatically add timestamp
      });
    } catch (error) {
      console.error(`Error updating document in ${this.collectionName}:`, error);
      throw new Error(`Failed to update document in ${this.collectionName}`);
    }
  }

  // Bonus method - get single document
  async getDocumentById(documentId: string): Promise<R | null> {
    try {
      const docRef = doc(db, this.collectionName, documentId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
        } as R;
      } else {
        return null;
      }
    } catch (error) {
      console.error(`Error fetching document ${documentId} from ${this.collectionName}:`, error);
      throw new Error(`Failed to fetch document from ${this.collectionName}`);
    }
  }
}
