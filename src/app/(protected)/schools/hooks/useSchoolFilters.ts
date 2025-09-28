import { useMemo } from "react";
import type { School } from "@/types";
import type { SchoolFilterFormData } from "../schemas/schoolSchemas";

interface UseSchoolFiltersProps {
  schools: School[];
  filter: SchoolFilterFormData;
}

export const useSchoolFilters = ({ schools, filter }: UseSchoolFiltersProps) => {
  const filteredSchools = useMemo(() => {
    let filtered = schools;

    // Apply search filter
    if (filter.search) {
      const searchTerm = filter.search.toLowerCase();
      filtered = filtered.filter((school) =>
        school.name.toLowerCase().includes(searchTerm) ||
        school.email.toLowerCase().includes(searchTerm) ||
        school.city.toLowerCase().includes(searchTerm) ||
        school.address.toLowerCase().includes(searchTerm) ||
        school.municipality.toLowerCase().includes(searchTerm)
      );
    }

    // Apply type filter
    if (filter.type) {
      filtered = filtered.filter((school) =>
        school.type && school.type.includes(filter.type)
      );
    }

    // Apply city filter
    if (filter.city) {
      filtered = filtered.filter((school) =>
        school.city.toLowerCase().includes(filter.city.toLowerCase())
      );
    }

    return filtered;
  }, [schools, filter]);

  // Get unique values for filter options
  const uniqueTypes = useMemo(() => {
    const types = new Set<string>();
    schools.forEach((school) => {
      if (school.type) {
        school.type.forEach((type) => types.add(type));
      }
    });
    return Array.from(types).sort();
  }, [schools]);

  const uniqueCities = useMemo(() => {
    const cities = new Set<string>();
    schools.forEach((school) => {
      if (school.city) {
        cities.add(school.city);
      }
    });
    return Array.from(cities).sort();
  }, [schools]);

  return {
    filteredSchools,
    uniqueTypes,
    uniqueCities,
  };
};
