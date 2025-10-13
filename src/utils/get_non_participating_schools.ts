import { School, Program } from "@/types";

import { SchoolProgramParticipation } from "@/models/SchoolProgramParticipation";

export const getNonParticipatingSchools = (schools: School[], programs: Program[], participations: SchoolProgramParticipation[]) => {
  const schoolParticipations: Record<string, string[]> = {};

  if (participations) {
    for (const participation of participations) {
      if (!schoolParticipations[participation.schoolId]) {
        schoolParticipations[participation.schoolId] = [];
      }
      schoolParticipations[participation.schoolId].push(participation.programId);
    }
  }

  const nonParticipatingSchools: Record<string, Program[]> = {};

  for (const school of schools) {
    const participatingProgramIds = schoolParticipations[school.id] || [];
    const schoolTypes = school.type;

    const applicablePrograms = programs.filter((program) => {
      const programTypes = program.schoolTypes;
      if (!programTypes) return false;
      return schoolTypes.some((schoolType) => programTypes.includes(schoolType));
    });

    const nonParticipatingPrograms = applicablePrograms.filter((program) => !participatingProgramIds.includes(program.id));

    if (nonParticipatingPrograms.length > 0) {
      nonParticipatingSchools[school.name] = nonParticipatingPrograms;
    }
  }

  return nonParticipatingSchools;
};
