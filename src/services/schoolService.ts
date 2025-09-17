import { collection, query, where, getDocs, addDoc, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/config";

import type { School } from "../types/index";

const getUserSchoolsData = async (userId: string) => {
  try {
    const schoolsCollection = collection(db, "schools");
    const q = query(schoolsCollection, where("userId", "==", userId));
    const schoolsList = await getDocs(q);
    return schoolsList.docs.map((doc) => ({
      ...(doc.data() as School),
      id: doc.id,
    }));
  } catch (error) {
    console.error("Error fetching user schools:", error);
    throw new Error("Failed to fetch user schools");
  }
};

type SchoolWithId = School & { id: string };

const getAllSchoolsData = async (): Promise<SchoolWithId[]> => {
  try {
    const schoolsCollection = collection(db, "schools");
    const schoolsList = await getDocs(schoolsCollection);
    return schoolsList.docs.map((doc) => ({
      ...(doc.data() as School),
      id: doc.id,
    }));
  } catch (error) {
    console.error("Error fetching all schools:", error);
    throw new Error("Failed to fetch all schools");
  }
};

type SchoolToAdd = Omit<School, "id" | "userId"> & {
  userId: string;
  createdAt: string;
};

const addSchool = async (school: SchoolToAdd): Promise<string> => {
  try {
    const schoolsCollection = collection(db, "schools");
    const docRef = await addDoc(schoolsCollection, school);
    console.log("New school added with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding school:", error);
    throw new Error("Failed to add school");
  }
};

const deleteSchool = async (schoolId: string): Promise<void> => {
  try {
    const schoolDoc = doc(db, "schools", schoolId);
    await deleteDoc(schoolDoc);
  } catch (error) {
    console.error("Error deleting school:", error);
    throw new Error("Failed to delete school");
  }
};

const updateSchool = async (schoolId: string, updatedData: Partial<School>): Promise<boolean> => {
  try {
    const schoolDoc = doc(db, "schools", schoolId);
    await updateDoc(schoolDoc, updatedData);
    return true;
  } catch (error) {
    console.error("Error updating school:", error);
    throw new Error("Failed to update school");
  }
};

export { getUserSchoolsData, getAllSchoolsData, addSchool, deleteSchool, updateSchool };
