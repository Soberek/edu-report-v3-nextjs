import { collection, query, where, getDocs, addDoc, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/config";
import type { SchoolProgramParticipation } from "../types";

// Data structure for school-program-participation

type SchoolProgramParticipationWithId = SchoolProgramParticipation & {
  id: string;
};

const getParticipationsBySchool = async (schoolId: string): Promise<SchoolProgramParticipationWithId[]> => {
  try {
    const participationCollection = collection(db, "school-program-participation");
    const q = query(participationCollection, where("schoolId", "==", schoolId));
    const participationList = await getDocs(q);
    return participationList.docs.map((doc) => ({
      ...(doc.data() as SchoolProgramParticipation),
      id: doc.id,
    }));
  } catch (error) {
    console.error("Error fetching participations by school:", error);
    throw new Error("Failed to fetch participations");
  }
};

const getAllUserParticipations = async (userId: string): Promise<SchoolProgramParticipationWithId[]> => {
  try {
    const participationCollection = collection(db, "school-program-participation");

    const q = query(participationCollection, where("userId", "==", userId));
    const participationList = await getDocs(q);
    return participationList.docs.map((doc) => ({
      ...(doc.data() as SchoolProgramParticipation),
      id: doc.id,
    }));
  } catch (error) {
    console.error("Error fetching all participations:", error);
    throw new Error("Failed to fetch participations");
  }
};

const addParticipation = async (participation: Omit<SchoolProgramParticipation, "id">): Promise<string> => {
  try {
    const participationCollection = collection(db, "school-program-participation");
    const docRef = await addDoc(participationCollection, participation);
    console.log("New participation added with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding participation:", error);
    throw new Error("Failed to add participation");
  }
};

const deleteParticipation = async (participationId: string): Promise<void> => {
  try {
    const participationDoc = doc(db, "school-program-participation", participationId);
    await deleteDoc(participationDoc);
  } catch (error) {
    console.error("Error deleting participation:", error);
    throw new Error("Failed to delete participation");
  }
};

const updateParticipation = async (
  participationId: string,
  updatedData: Partial<SchoolProgramParticipation>
): Promise<boolean> => {
  try {
    const participationDoc = doc(db, "school-program-participation", participationId);
    await updateDoc(participationDoc, updatedData);
    return true;
  } catch (error) {
    console.error("Error updating participation:", error);
    throw new Error("Failed to update participation");
  }
};

export {
  getParticipationsBySchool,
  getAllUserParticipations,
  addParticipation,
  deleteParticipation,
  updateParticipation,
};
