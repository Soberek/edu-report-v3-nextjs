
import { useQueryWithNotifications } from "@/hooks/useQueryWithNotifications";
import { useUser } from "@/hooks/useUser";
import { useQuery } from "@tanstack/react-query";
import type { School, Contact, Program, SchoolProgramParticipation } from "@/types";
import { fetchCollection } from "@/services/firebaseService";
import { programs as LOCAL_PROGRAMS } from "@/constants/programs";
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
 * Fetches programs data from local constants (not Firebase).
 * Programs are shared across all users and don't need user-specific queries.
 */
export const useProgramsQuery = () => {
  return useQuery<Program[]>({
    queryKey: queryKeys.programsAll(),
    queryFn: () => Promise.resolve(LOCAL_PROGRAMS),
    staleTime: Infinity, // Static data never becomes stale
    gcTime: Infinity, // Keep in cache indefinitely
  });
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
