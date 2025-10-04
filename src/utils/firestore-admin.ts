import admin from "@/firebase/admin";

/**
 * Get Firestore instance
 */
export function getFirestore() {
  return admin.firestore();
}

/**
 * Get a document from Firestore
 */
export async function getDocument(collection: string, docId: string) {
  const db = getFirestore();
  const docRef = db.collection(collection).doc(docId);
  const doc = await docRef.get();
  
  if (!doc.exists) {
    return null;
  }
  
  return {
    id: doc.id,
    ...doc.data(),
  };
}

/**
 * Get all documents from a collection
 */
export async function getCollection(collection: string, filters?: {
  field: string;
  operator: FirebaseFirestore.WhereFilterOp;
  value: any;
}[]) {
  const db = getFirestore();
  let query: FirebaseFirestore.Query = db.collection(collection);
  
  if (filters) {
    filters.forEach(({ field, operator, value }) => {
      query = query.where(field, operator, value);
    });
  }
  
  const snapshot = await query.get();
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
}

/**
 * Create a document in Firestore
 */
export async function createDocument(collection: string, data: any, docId?: string) {
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
export async function updateDocument(collection: string, docId: string, data: any) {
  const db = getFirestore();
  const docRef = db.collection(collection).doc(docId);
  
  await docRef.update(data);
  
  const updated = await docRef.get();
  return {
    id: updated.id,
    ...updated.data(),
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
export async function batchWrite(operations: {
  type: "create" | "update" | "delete";
  collection: string;
  docId?: string;
  data?: any;
}[]) {
  const db = getFirestore();
  const batch = db.batch();
  
  operations.forEach(({ type, collection, docId, data }) => {
    const collectionRef = db.collection(collection);
    
    if (type === "create") {
      const docRef = docId ? collectionRef.doc(docId) : collectionRef.doc();
      batch.set(docRef, data);
    } else if (type === "update" && docId) {
      const docRef = collectionRef.doc(docId);
      batch.update(docRef, data);
    } else if (type === "delete" && docId) {
      const docRef = collectionRef.doc(docId);
      batch.delete(docRef);
    }
  });
  
  await batch.commit();
  return { success: true };
}
