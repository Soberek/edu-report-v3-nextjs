
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@/hooks/useUser";
import { usePrograms as useOriginalPrograms } from "@/features/programy-edukacyjne/hooks/useProgram";
import type { School, Contact, Program, SchoolProgramParticipation } from "@/types";
import { fetchCollection } from "@/services/firebaseService";

/**
 * Fetches school data using TanStack Query.
 */
export const useSchoolsQuery = () => {
  const { user } = useUser();
  return useQuery<School[]>({
    queryKey: ["schools", user?.uid],
    queryFn: () => fetchCollection<School>("schools", user!.uid),
    enabled: !!user?.uid, // Only run the query if the user is logged in
  });
};

/**
 * Fetches contacts data using TanStack Query.
 */
export const useContactsQuery = () => {
  const { user } = useUser();
  return useQuery<Contact[]>({
    queryKey: ["contacts", user?.uid],
    queryFn: () => fetchCollection<Contact>("contacts", user!.uid),
    enabled: !!user?.uid,
  });
};

/**
 * Fetches programs data using TanStack Query.
 */
export const useProgramsQuery = () => {
  const { user } = useUser();
  const { programs, loading, errorMessage } = useOriginalPrograms();

  return useQuery<Program[] >({
    queryKey: ["programs", user?.uid],
    queryFn: () => fetchCollection<Program>("programs", user!.uid),
    enabled: !!user?.uid,
    initialData: programs,
    staleTime: 5 * 60 * 1000,
    placeholderData: programs,
    retry: (failureCount, error) => {
      if (errorMessage) {
        return false;
      }
      return failureCount < 3;
    },
    meta: {
      localLoading: loading,
      localError: errorMessage,
    },
  });
};

/**
 * Fetches school program participation data using TanStack Query.
 */
export const useParticipationsQuery = () => {
  const { user } = useUser();
  return useQuery<SchoolProgramParticipation[]>({
    queryKey: ["participations", user?.uid],
    queryFn: () => fetchCollection<SchoolProgramParticipation>("school-program-participation", user!.uid),
    enabled: !!user?.uid,
  });
};
