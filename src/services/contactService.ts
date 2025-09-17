import { collection, query, where, getDocs, addDoc, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/config";

import type { Contact } from "@/types";

const getUserContactsData = async (userId: string) => {
  try {
    const contactsCollection = collection(db, "contacts");
    const q = query(contactsCollection, where("userId", "==", userId));
    const contactsList = await getDocs(q);
    return contactsList.docs.map((doc) => ({
      ...(doc.data() as Contact),
      id: doc.id,
    }));
  } catch (error) {
    console.error("Error fetching user contacts:", error);
    throw new Error("Failed to fetch user contacts");
  }
};

type ContactWithId = Contact & { id: string };

const getAllContactsData = async (): Promise<ContactWithId[]> => {
  try {
    const contactsCollection = collection(db, "contacts");
    const contactsList = await getDocs(contactsCollection);
    return contactsList.docs.map((doc) => ({
      ...(doc.data() as Contact),
      id: doc.id,
    }));
  } catch (error) {
    console.error("Error fetching all contacts:", error);
    throw new Error("Failed to fetch all contacts");
  }
};

type ContactToAdd = Omit<Contact, "id" | "userId"> & {
  userId: string;
  createdAt: string;
};

const addContact = async (contact: ContactToAdd): Promise<string> => {
  try {
    const contactsCollection = collection(db, "contacts");
    const docRef = await addDoc(contactsCollection, contact);
    return docRef.id;
  } catch (error) {
    console.error("Error adding contact:", error);
    throw new Error("Failed to add contact");
  }
};

const deleteContact = async (contactId: string): Promise<void> => {
  try {
    const contactDoc = doc(db, "contacts", contactId);
    await deleteDoc(contactDoc);
  } catch (error) {
    console.error("Error deleting contact:", error);
    throw new Error("Failed to delete contact");
  }
};

const updateContact = async (contactId: string, updatedData: Partial<Contact>): Promise<boolean> => {
  try {
    const contactDoc = doc(db, "contacts", contactId);
    await updateDoc(contactDoc, updatedData);
    return true;
  } catch (error) {
    console.error("Error updating contact:", error);
    throw new Error("Failed to update contact");
  }
};

export { getUserContactsData, getAllContactsData, addContact, deleteContact, updateContact };
