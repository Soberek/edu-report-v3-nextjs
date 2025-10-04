import admin from "@/firebase/admin";

type FirestoreData = FirebaseFirestore.DocumentData;

/**
 * Get Firestore instance
 */
export function getFirestore() {
  return admin.firestore();
}

/**
 * Get a document from Firestore
 */
export async function getDocument<T extends FirestoreData = FirestoreData>(
  collection: string,
  docId: string
): Promise<(T & { id: string }) | null> {
  const db = getFirestore();
  const docRef = db.collection(collection).doc(docId);
  const doc = await docRef.get();
  if (!doc.exists) {
    return null;
  }
  const data = doc.data() as T;
  return { id: doc.id, ...data };
}

/**
 * Get all documents from a collection
 */
export async function getCollection<T extends FirestoreData = FirestoreData>(
  collection: string,
  filters?: {
    field: string;
    operator: FirebaseFirestore.WhereFilterOp;
    value: unknown;
  }[]
): Promise<Array<T & { id: string }>> {
  const db = getFirestore();
  let query: FirebaseFirestore.Query = db.collection(collection);

  if (filters) {
    filters.forEach(({ field, operator, value }) => {
      query = query.where(field, operator, value);
    });
  }

  const snapshot = await query.get();

  return snapshot.docs.map((doc) => {
    const data = doc.data() as T;
    return {
      id: doc.id,
      ...data,
    };
  });
}

/**
 * Create a document in Firestore
 */
export async function createDocument<T extends FirestoreData>(collection: string, data: T, docId?: string): Promise<T & { id: string }> {
  const db = getFirestore();
  const collectionRef = db.collection(collection);

  if (docId) {
    await collectionRef.doc(docId).set(data);
    return { id: docId, ...data };
  }

  const docRef = await collectionRef.add(data);
  return { id: docRef.id, ...data };
}

/**
 * Update a document in Firestore
 */
export async function updateDocument<T extends FirestoreData>(
  collection: string,
  docId: string,
  data: Partial<T>
): Promise<T & { id: string }> {
  const db = getFirestore();
  const docRef = db.collection(collection).doc(docId);

  await docRef.update(data);

  const updated = await docRef.get();
  return {
    id: updated.id,
    ...(updated.data() as T),
  };
}

/**
 * Delete a document from Firestore
 */
export async function deleteDocument(collection: string, docId: string) {
  const db = getFirestore();
  await db.collection(collection).doc(docId).delete();
  return { success: true };
}

/**
 * Batch write operations
 */
type BatchOperation = {
  type: "create" | "update" | "delete";
  collection: string;
  docId?: string;
  data?: FirestoreData;
};

export async function batchWrite(operations: BatchOperation[]) {
  const db = getFirestore();
  const batch = db.batch();

  operations.forEach(({ type, collection, docId, data }) => {
    const collectionRef = db.collection(collection);

    if (type === "create") {
      const docRef = docId ? collectionRef.doc(docId) : collectionRef.doc();
      if (!data) {
        throw new Error("Batch create operations require data");
      }
      batch.set(docRef, data);
    } else if (type === "update" && docId) {
      const docRef = collectionRef.doc(docId);
      if (!data) {
        throw new Error("Batch update operations require data");
      }
      batch.update(docRef, data);
    } else if (type === "delete" && docId) {
      const docRef = collectionRef.doc(docId);
      batch.delete(docRef);
    }
  });

  await batch.commit();
  return { success: true };
}
