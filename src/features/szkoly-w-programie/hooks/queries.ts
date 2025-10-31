
import { useQueryWithNotifications } from "@/hooks/useQueryWithNotifications";
import { useUser } from "@/hooks/useUser";
import type { School, Contact, Program, SchoolProgramParticipation } from "@/types";
import { fetchCollection } from "@/services/firebaseService";
import { queryKeys, COLLECTIONS } from "../constants/queryConstants";

/**
 * Fetches school data using TanStack Query with error notifications.
 */
export const useSchoolsQuery = () => {
  const { user } = useUser();
  return useQueryWithNotifications<School[]>({
    queryKey: queryKeys.schoolsByUser(user?.uid || ""),
    queryFn: () => fetchCollection<School>(COLLECTIONS.SCHOOLS, user!.uid),
    enabled: !!user?.uid,
  }, "Dane szkół");
};

/**
 * Fetches contacts data using TanStack Query with error notifications.
 */
export const useContactsQuery = () => {
  const { user } = useUser();
  return useQueryWithNotifications<Contact[]>({
    queryKey: queryKeys.contactsByUser(user?.uid || ""),
    queryFn: () => fetchCollection<Contact>(COLLECTIONS.CONTACTS, user!.uid),
    enabled: !!user?.uid,
  }, "Dane kontaktów");
};

/**
 * Fetches programs data using TanStack Query with error notifications.
 * Simplified to use pure TanStack Query (removed mixed state management).
 */
export const useProgramsQuery = () => {
  const { user } = useUser();
  
  return useQueryWithNotifications<Program[]>({
    queryKey: queryKeys.programsByUser(user?.uid || ""),
    queryFn: () => fetchCollection<Program>(COLLECTIONS.PROGRAMS, user!.uid),
    enabled: !!user?.uid,
  }, "Dane programów");
};

/**
 * Fetches school program participation data using TanStack Query with error notifications.
 */
export const useParticipationsQuery = () => {
  const { user } = useUser();
  return useQueryWithNotifications<SchoolProgramParticipation[]>({
    queryKey: queryKeys.participationsByUser(user?.uid || ""),
    queryFn: () => fetchCollection<SchoolProgramParticipation>(COLLECTIONS.PARTICIPATIONS, user!.uid),
    enabled: !!user?.uid,
  }, "Dane uczestnictwa szkół");
};
