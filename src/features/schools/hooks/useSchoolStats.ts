import { useMemo } from "react";
import type { School } from "@/types";

interface UseSchoolStatsProps {
  schools: School[];
}

export const useSchoolStats = ({ schools }: UseSchoolStatsProps) => {
  const stats = useMemo(() => {
    const typeCounts: { [key: string]: number } = {};
    let totalSchools = 0;

    schools.forEach((school) => {
      totalSchools++;
      school.type?.forEach((type) => {
        typeCounts[type] = (typeCounts[type] || 0) + 1;
      });
    });

    // Convert to array and sort by count (descending)
    const typeStats = Object.entries(typeCounts)
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count);

    return {
      totalSchools,
      typeStats,
      typeCounts,
    };
  }, [schools]);

  return stats;
};
