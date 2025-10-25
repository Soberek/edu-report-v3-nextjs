
import { useQueryWithNotifications } from "@/hooks/useQueryWithNotifications";
import { useUser } from "@/hooks/useUser";
import { usePrograms as useOriginalPrograms } from "@/features/programy-edukacyjne/hooks/useProgram";
import type { School, Contact, Program, SchoolProgramParticipation } from "@/types";
import { fetchCollection } from "@/services/firebaseService";

/**
 * Fetches school data using TanStack Query with error notifications.
 */
export const useSchoolsQuery = () => {
  const { user } = useUser();
  return useQueryWithNotifications<School[]>({
    queryKey: ["schools", user?.uid],
    queryFn: () => fetchCollection<School>("schools", user!.uid),
    enabled: !!user?.uid, // Only run the query if the user is logged in
  }, "Dane szkół");
};

/**
 * Fetches contacts data using TanStack Query with error notifications.
 */
export const useContactsQuery = () => {
  const { user } = useUser();
  return useQueryWithNotifications<Contact[]>({
    queryKey: ["contacts", user?.uid],
    queryFn: () => fetchCollection<Contact>("contacts", user!.uid),
    enabled: !!user?.uid,
  }, "Dane kontaktów");
};

/**
 * Fetches programs data using TanStack Query.
 * Uses global QueryClient defaults for caching and retry behavior.
 */
export const useProgramsQuery = () => {
  const { user } = useUser();
  const { programs, loading, errorMessage } = useOriginalPrograms();

  return useQueryWithNotifications<Program[]>({
    queryKey: ["programs", user?.uid],
    queryFn: () => fetchCollection<Program>("programs", user!.uid),
    enabled: !!user?.uid,
    initialData: programs,
    placeholderData: programs,
    // Custom retry logic to respect local error states
    retry: (failureCount, error) => {
      if (errorMessage) {
        return false; // Don't retry if there's a local error
      }
      // Use global retry logic for network/server errors
      if (error instanceof Error && error.message.includes("400") || error instanceof Error && error.message.includes("500")) {
        return false; // Don't retry client errors
      }
      return failureCount < 3;
    },
    meta: {
      localLoading: loading,
      localError: errorMessage,
    },
  }, "Dane programów");
};

/**
 * Fetches school program participation data using TanStack Query with error notifications.
 */
export const useParticipationsQuery = () => {
  const { user } = useUser();
  return useQueryWithNotifications<SchoolProgramParticipation[]>({
    queryKey: ["participations", user?.uid],
    queryFn: () => fetchCollection<SchoolProgramParticipation>("school-program-participation", user!.uid),
    enabled: !!user?.uid,
  }, "Dane uczestnictwa szkół");
};
