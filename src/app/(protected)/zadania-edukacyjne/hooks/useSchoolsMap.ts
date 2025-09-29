import { useMemo } from "react";
import { useFirebaseData } from "@/hooks/useFirebaseData";
import { useUser } from "@/hooks/useUser";
import type { School } from "@/types";

/**
 * Hook to fetch schools and create a Map for efficient school lookups
 * @returns Map of schoolId -> School object and loading state
 */
export const useSchoolsMap = () => {
  const { user } = useUser();
  const { data: schools, loading, error } = useFirebaseData<School>("schools", user?.uid);

  const schoolsMap = useMemo(() => {
    if (!schools || schools.length === 0) {
      return new Map<string, School>();
    }

    return new Map(schools.map((school) => [school.id, school]));
  }, [schools]);

  const getSchoolName = (schoolId: string): string => {
    const school = schoolsMap.get(schoolId);
    return school ? school.name : `Szkoła ID: ${schoolId}`;
  };

  const getSchoolInfo = (schoolId: string): string => {
    const school = schoolsMap.get(schoolId);
    if (!school) return "Nie znaleziono szkoły";

    return `${school.name}, ${school.city}`;
  };

  return {
    schoolsMap,
    schools: schools || [],
    loading,
    error,
    getSchoolName,
    getSchoolInfo,
  };
};
