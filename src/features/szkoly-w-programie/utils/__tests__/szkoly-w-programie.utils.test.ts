
import { describe, it, expect } from "vitest";
import {
  filterBySchoolYear,
  filterByProgram,
  createSchoolParticipationsMap,
  getApplicablePrograms,
  calculateSchoolParticipationInfo,
  calculateProgramStats,
  calculateGeneralStats,
  filterSchoolsByStatus,
  filterSchoolsByName,
  filterSchoolsByProgram,
  getAvailableSchoolYears,
  searchParticipations,
  addParticipationCountToPrograms,
} from "../szkoly-w-programie.utils";
import type { SchoolProgramParticipation, School, Program } from "@/types";

// --- Mock Data ---
const mockParticipations: SchoolProgramParticipation[] = [
  {
    id: "p1",
    schoolId: "s1",
    programId: "prog1",
    schoolYear: "2024/2025",
    studentCount: 100,
    coordinatorId: "coord1",
    createdAt: "2024-01-01T00:00:00.000Z",
    userId: "user1",
  },
  {
    id: "p2",
    schoolId: "s2",
    programId: "prog2",
    schoolYear: "2024/2025",
    studentCount: 150,
    coordinatorId: "coord2",
    createdAt: "2024-01-02T00:00:00.000Z",
    userId: "user2",
  },
  {
    id: "p3",
    schoolId: "s1",
    programId: "prog2",
    schoolYear: "2025/2026",
    studentCount: 120,
    coordinatorId: "coord1",
    createdAt: "2025-01-01T00:00:00.000Z",
    userId: "user1",
  },
  {
    id: "p4",
    schoolId: "s3",
    programId: "prog3",
    schoolYear: "2025/2026",
    studentCount: 200,
    coordinatorId: "coord3",
    createdAt: "2025-01-02T00:00:00.000Z",
    userId: "user3",
  },
];

const mockSchools: School[] = [
  {
    id: "s1",
    name: "Szkoła Podstawowa nr 1",
    address: "ul. Główna 1",
    city: "Warszawa",
    postalCode: "00-001",
    municipality: "Warszawa",
    email: "sp1@example.com",
    type: ["Szkoła podstawowa"],
    createdAt: "2024-01-01",
  },
  {
    id: "s2",
    name: "Liceum Ogólnokształcące nr 2",
    address: "ul. Szkolna 2",
    city: "Kraków",
    postalCode: "30-001",
    municipality: "Kraków",
    email: "lo2@example.com",
    type: ["Liceum"],
    createdAt: "2024-01-01",
  },
  {
    id: "s3",
    name: "Szkoła Podstawowa nr 3",
    address: "ul. Leśna 3",
    city: "Gdańsk",
    postalCode: "80-001",
    municipality: "Gdańsk",
    email: "sp3@example.com",
    type: ["Szkoła podstawowa"],
    createdAt: "2024-01-01",
  },
  {
    id: "s4",
    name: "Technikum nr 4",
    address: "ul. Polna 4",
    city: "Wrocław",
    postalCode: "50-001",
    municipality: "Wrocław",
    email: "tech4@example.com",
    type: ["Technikum"],
    createdAt: "2024-01-01",
  },
];

const mockPrograms: Program[] = [
  {
    id: "prog1",
    code: "POZ",
    name: "Program Edukacji Zdrowotnej",
    description: "Program nauczania zdrowia w szkołach",
    schoolTypes: ["Szkoła podstawowa"],
    programType: "programowy",
  },
  {
    id: "prog2",
    code: "PRF",
    name: "Program Profilaktyki",
    description: "Program profilaktyki uzależnień",
    schoolTypes: ["Szkoła podstawowa", "Liceum"],
    programType: "programowy",
  },
  {
    id: "prog3",
    code: "ZAJ",
    name: "Program Zajęć Dodatkowych",
    description: "Dodatkowe zajęcia dla uczniów",
    schoolTypes: ["Szkoła podstawowa", "Technikum"],
    programType: "programowy",
  },
  {
    id: "prog4",
    code: "LIC",
    name: "Program dla Liceów",
    description: "Program specjalny dla liceów",
    schoolTypes: ["Liceum"],
    programType: "programowy",
  },
];

// --- Tests ---

describe("szkoly-w-programie.utils", () => {

  // Test for filterBySchoolYear
  describe("filterBySchoolYear", () => {
    it("should return all participations when schoolYear is 'all'", () => {
      const result = filterBySchoolYear(mockParticipations, "all");
      expect(result).toHaveLength(4);
      expect(result).toEqual(mockParticipations);
    });

    it("should return only participations for the specified school year", () => {
      const result = filterBySchoolYear(mockParticipations, "2024/2025");
      expect(result).toHaveLength(2);
      expect(result.every(p => p.schoolYear === "2024/2025")).toBe(true);
      expect(result.map(p => p.id)).toEqual(["p1", "p2"]);
    });

    it("should return an empty array if no participations match the school year", () => {
      const result = filterBySchoolYear(mockParticipations, "2023/2024");
      expect(result).toHaveLength(0);
    });
  });

  // Test for filterByProgram
  describe("filterByProgram", () => {
    it("should return all participations when programId is 'all'", () => {
      const result = filterByProgram(mockParticipations, "all");
      expect(result).toHaveLength(4);
      expect(result).toEqual(mockParticipations);
    });

    it("should return only participations for the specified program", () => {
      const result = filterByProgram(mockParticipations, "prog2");
      expect(result).toHaveLength(2);
      expect(result.every(p => p.programId === "prog2")).toBe(true);
      expect(result.map(p => p.id)).toEqual(["p2", "p3"]);
    });

    it("should return an empty array if no participations match the program", () => {
      const result = filterByProgram(mockParticipations, "prog4");
      expect(result).toHaveLength(0);
    });
  });

  // Test for createSchoolParticipationsMap
  describe("createSchoolParticipationsMap", () => {
    it("should create a map of schoolId to an array of programIds", () => {
      const result = createSchoolParticipationsMap(mockParticipations);
      expect(result).toEqual({
        s1: ["prog1", "prog2"],
        s2: ["prog2"],
        s3: ["prog3"],
      });
    });

    it("should return an empty object if given no participations", () => {
      const result = createSchoolParticipationsMap([]);
      expect(result).toEqual({});
    });

    it("should handle participations with missing properties gracefully", () => {
      const incompleteData: Partial<SchoolProgramParticipation>[] = [
        { id: "p1", schoolId: "s1", programId: "prog1" },
        { id: "p2", schoolId: "s1" }, // Missing programId
        { id: "p3", programId: "prog2" }, // Missing schoolId
      ];
      const result = createSchoolParticipationsMap(incompleteData as unknown as SchoolProgramParticipation[]);
      expect(result).toEqual({ s1: ["prog1"] });
    });
  });

  // Test for getApplicablePrograms
  describe("getApplicablePrograms", () => {
    it("should return programs that match school type", () => {
      const result = getApplicablePrograms(mockSchools[0], mockPrograms); // Szkoła podstawowa
      expect(result).toHaveLength(3); // prog1, prog2, prog3
      expect(result.map((p) => p.id)).toEqual(["prog1", "prog2", "prog3"]);
    });

    it("should return only Liceum programs for Liceum school", () => {
      const result = getApplicablePrograms(mockSchools[1], mockPrograms); // Liceum
      expect(result).toHaveLength(2); // prog2, prog4
      expect(result.map((p) => p.id)).toEqual(["prog2", "prog4"]);
    });

    it("should return empty array for school type with no programs", () => {
      const result = getApplicablePrograms(mockSchools[3], mockPrograms); // Technikum
      expect(result).toHaveLength(1); // prog3
      expect(result.map((p) => p.id)).toEqual(["prog3"]);
    });
  });

  // Test for calculateSchoolParticipationInfo
  describe("calculateSchoolParticipationInfo", () => {
    it("should correctly calculate participation info for all schools", () => {
      const participationsMap = createSchoolParticipationsMap(mockParticipations);
      const result = calculateSchoolParticipationInfo(mockSchools, mockPrograms, participationsMap);

      expect(result).toHaveLength(4);
      
      // School s1: uczestniczy w prog1, prog2; nie uczestniczy - nic
      expect(result[0].schoolName).toBe("Szkoła Podstawowa nr 1");
      expect(result[0].participating).toHaveLength(2);
      expect(result[0].notParticipating).toHaveLength(1);
    });

    it("should mark schools with no participation as non-participating", () => {
      const participationsMap = createSchoolParticipationsMap([]);
      const result = calculateSchoolParticipationInfo(mockSchools, mockPrograms, participationsMap);

      result.forEach((schoolInfo) => {
        expect(schoolInfo.participating).toHaveLength(0);
      });
    });
  });

  // Test for calculateProgramStats (detailed counting)
  describe("calculateProgramStats - detailed counting", () => {
    it("should calculate eligible schools correctly per program", () => {
      const participationsMap = createSchoolParticipationsMap(mockParticipations);
      const result = calculateProgramStats(mockSchools, mockPrograms, participationsMap);

      // prog1 is for "Szkoła podstawowa" - s1, s3 are eligible
      expect(result["Program Edukacji Zdrowotnej"].eligible).toBe(2);
    });

    it("should calculate participating schools correctly per program", () => {
      const participationsMap = createSchoolParticipationsMap(mockParticipations);
      const result = calculateProgramStats(mockSchools, mockPrograms, participationsMap);

      // prog1: s1 participates
      expect(result["Program Edukacji Zdrowotnej"].participating).toBe(1);
    });

    it("should calculate not participating schools correctly per program", () => {
      const participationsMap = createSchoolParticipationsMap(mockParticipations);
      const result = calculateProgramStats(mockSchools, mockPrograms, participationsMap);

      // prog1: s1 participates, s3 doesn't = 1 not participating
      expect(result["Program Edukacji Zdrowotnej"].notParticipating).toBe(1);
    });

    it("should count all schools with multiple program types correctly", () => {
      const participationsMap = createSchoolParticipationsMap(mockParticipations);
      const result = calculateProgramStats(mockSchools, mockPrograms, participationsMap);

      // prog2 is for both "Szkoła podstawowa" and "Liceum"
      // eligible: s1, s3 (basic), s2 (Liceum) = 3
      expect(result["Program Profilaktyki"].eligible).toBe(3);
      // participating: s1, s2 = 2
      expect(result["Program Profilaktyki"].participating).toBe(2);
      // not participating: s3 = 1
      expect(result["Program Profilaktyki"].notParticipating).toBe(1);
    });

    it("should verify math: eligible = participating + notParticipating", () => {
      const participationsMap = createSchoolParticipationsMap(mockParticipations);
      const result = calculateProgramStats(mockSchools, mockPrograms, participationsMap);

      Object.values(result).forEach((stat) => {
        expect(stat.eligible).toBe(stat.participating + stat.notParticipating);
      });
    });
  });

  // Test for calculateGeneralStats
  describe("calculateGeneralStats", () => {
    it("should correctly count non-participating schools", () => {
      const participationsMap = createSchoolParticipationsMap(mockParticipations);
      const schoolsInfo = calculateSchoolParticipationInfo(mockSchools, mockPrograms, participationsMap);
      const programStats = calculateProgramStats(mockSchools, mockPrograms, participationsMap);

      const result = calculateGeneralStats(mockSchools, schoolsInfo, programStats, mockParticipations);

      expect(result.totalSchools).toBe(4);
      expect(result.nonParticipatingCount).toBe(1); // s4 nie uczestniczy w żadnych programach
      expect(result.totalParticipations).toBe(4);
    });

    it("should calculate total missing participations correctly", () => {
      const participationsMap = createSchoolParticipationsMap(mockParticipations);
      const schoolsInfo = calculateSchoolParticipationInfo(mockSchools, mockPrograms, participationsMap);
      const programStats = calculateProgramStats(mockSchools, mockPrograms, participationsMap);

      const result = calculateGeneralStats(mockSchools, schoolsInfo, programStats, mockParticipations);

      // prog3: 1 not participating (s4), prog4: 1 not participating (s2)
      expect(result.totalMissingParticipations).toBeGreaterThan(0);
    });

    it("should count school as non-participating only if it has applicable programs", () => {
      // Create scenario: school with no applicable programs
      const limitedPrograms = mockPrograms.filter((p) => p.id !== "prog3" && p.id !== "prog4");
      const participationsMap = createSchoolParticipationsMap(mockParticipations);
      const schoolsInfo = calculateSchoolParticipationInfo(mockSchools, limitedPrograms, participationsMap);
      const programStats = calculateProgramStats(mockSchools, limitedPrograms, participationsMap);

      const result = calculateGeneralStats(mockSchools, schoolsInfo, programStats, mockParticipations);

      // s4 (Technikum) has no applicable programs in limitedPrograms
      // schoolsInfo[3] will have participating=[], notParticipating=[]
      // So it won't be counted as non-participating
      expect(result.nonParticipatingCount).toBe(1); // s2 has notParticipating.length > 0 with no participating
    });

    it("should calculate correct total schools count", () => {
      const participationsMap = createSchoolParticipationsMap(mockParticipations);
      const schoolsInfo = calculateSchoolParticipationInfo(mockSchools, mockPrograms, participationsMap);
      const programStats = calculateProgramStats(mockSchools, mockPrograms, participationsMap);

      const result = calculateGeneralStats(mockSchools, schoolsInfo, programStats, mockParticipations);

      expect(result.totalSchools).toBe(mockSchools.length);
    });

    it("should calculate correct total participations count", () => {
      const participationsMap = createSchoolParticipationsMap(mockParticipations);
      const schoolsInfo = calculateSchoolParticipationInfo(mockSchools, mockPrograms, participationsMap);
      const programStats = calculateProgramStats(mockSchools, mockPrograms, participationsMap);

      const result = calculateGeneralStats(mockSchools, schoolsInfo, programStats, mockParticipations);

      expect(result.totalParticipations).toBe(mockParticipations.length);
    });
  });

  // Test for filterSchoolsByStatus
  describe("filterSchoolsByStatus", () => {
    it("should filter schools by participating status", () => {
      const participationsMap = createSchoolParticipationsMap(mockParticipations);
      const schoolsInfo = calculateSchoolParticipationInfo(mockSchools, mockPrograms, participationsMap);

      const participating = filterSchoolsByStatus(schoolsInfo, "participating");
      expect(participating.length).toBeGreaterThan(0);
      participating.forEach((s) => {
        expect(s.participating.length).toBeGreaterThan(0);
      });
    });

    it("should filter schools by non-participating status", () => {
      const participationsMap = createSchoolParticipationsMap(mockParticipations);
      const schoolsInfo = calculateSchoolParticipationInfo(mockSchools, mockPrograms, participationsMap);

      const notParticipating = filterSchoolsByStatus(schoolsInfo, "notParticipating");
      notParticipating.forEach((s) => {
        expect(s.notParticipating.length).toBeGreaterThan(0);
      });
    });

    it("should return all schools when status is 'all'", () => {
      const participationsMap = createSchoolParticipationsMap(mockParticipations);
      const schoolsInfo = calculateSchoolParticipationInfo(mockSchools, mockPrograms, participationsMap);

      const result = filterSchoolsByStatus(schoolsInfo, "all");
      expect(result).toHaveLength(schoolsInfo.length);
    });
  });

  // Test for filterSchoolsByName
  describe("filterSchoolsByName", () => {
    it("should filter schools by exact name match", () => {
      const participationsMap = createSchoolParticipationsMap(mockParticipations);
      const schoolsInfo = calculateSchoolParticipationInfo(mockSchools, mockPrograms, participationsMap);

      const result = filterSchoolsByName(schoolsInfo, "Szkoła Podstawowa nr 1");
      expect(result).toHaveLength(1);
      expect(result[0].schoolName).toBe("Szkoła Podstawowa nr 1");
    });

    it("should return empty array for non-existent school name", () => {
      const participationsMap = createSchoolParticipationsMap(mockParticipations);
      const schoolsInfo = calculateSchoolParticipationInfo(mockSchools, mockPrograms, participationsMap);

      const result = filterSchoolsByName(schoolsInfo, "Non-existent School");
      expect(result).toHaveLength(0);
    });

    it("should return all schools when name filter is null", () => {
      const participationsMap = createSchoolParticipationsMap(mockParticipations);
      const schoolsInfo = calculateSchoolParticipationInfo(mockSchools, mockPrograms, participationsMap);

      const result = filterSchoolsByName(schoolsInfo, null);
      expect(result).toHaveLength(schoolsInfo.length);
    });
  });

  // Test for filterSchoolsByProgram
  describe("filterSchoolsByProgram", () => {
    it("should filter schools that participate in or are eligible for a specific program", () => {
      const participationsMap = createSchoolParticipationsMap(mockParticipations);
      const schoolsInfo = calculateSchoolParticipationInfo(mockSchools, mockPrograms, participationsMap);

      const result = filterSchoolsByProgram(schoolsInfo, "prog1");
      expect(result.length).toBeGreaterThan(0);
      result.forEach((s) => {
        const hasProgram = s.participating.some((p) => p.id === "prog1") || s.notParticipating.some((p) => p.id === "prog1");
        expect(hasProgram).toBe(true);
      });
    });

    it("should return empty array for non-existent program", () => {
      const participationsMap = createSchoolParticipationsMap(mockParticipations);
      const schoolsInfo = calculateSchoolParticipationInfo(mockSchools, mockPrograms, participationsMap);

      const result = filterSchoolsByProgram(schoolsInfo, "non-existent");
      expect(result).toHaveLength(0);
    });

    it("should return all schools when program filter is null", () => {
      const participationsMap = createSchoolParticipationsMap(mockParticipations);
      const schoolsInfo = calculateSchoolParticipationInfo(mockSchools, mockPrograms, participationsMap);

      const result = filterSchoolsByProgram(schoolsInfo, null);
      expect(result).toHaveLength(schoolsInfo.length);
    });
  });

  // Test for getAvailableSchoolYears
  describe("getAvailableSchoolYears", () => {
    it("should return sorted unique school years", () => {
      const result = getAvailableSchoolYears(mockParticipations);
      expect(result).toEqual(["2024/2025", "2025/2026"]);
    });

    it("should return empty array for empty participations", () => {
      const result = getAvailableSchoolYears([]);
      expect(result).toHaveLength(0);
    });
  });

  // Test for addParticipationCountToPrograms
  describe("addParticipationCountToPrograms", () => {
    it("should add unique school count to programs", () => {
      const result = addParticipationCountToPrograms(mockPrograms, mockParticipations);

      expect(result[0].participationCount).toBe(1); // prog1: 1 unique school (s1)
      expect(result[1].participationCount).toBe(2); // prog2: 2 unique schools (s2, s1 from 2 different years)
      expect(result[2].participationCount).toBe(1); // prog3: 1 unique school (s3)
    });

    it("should set count to 0 for programs with no participations", () => {
      const result = addParticipationCountToPrograms(mockPrograms, []);
      result.forEach((program) => {
        expect(program.participationCount).toBe(0);
      });
    });

    it("should count same school only once even with multiple school years", () => {
      // School s1 has 2 participations in prog2 (different years: 2024/2025, 2025/2026)
      // But should count as 1 unique school
      const prog2 = mockParticipations.filter((p) => p.programId === "prog2");
      const result = addParticipationCountToPrograms([mockPrograms[1]], prog2);

      expect(result[0].participationCount).toBe(2); // 2 unique schools: s2 and s1
    });
  });

  // Test for searchParticipations
  describe("searchParticipations", () => {
    const mockContactsMap = {
      coord1: { firstName: "Jan", lastName: "Kowalski", email: "jan@example.com" },
      coord2: { firstName: "Maria", lastName: "Nowak", email: "maria@example.com" },
      coord3: { firstName: "Piotr", lastName: "Lewandowski", email: "piotr@example.com" },
    };

    const mockSchoolsMap = mockSchools.reduce(
      (acc, school) => {
        acc[school.id] = school;
        return acc;
      },
      {} as Record<string, School>
    );

    const mockProgramsMap = mockPrograms.reduce(
      (acc, program) => {
        acc[program.id] = program;
        return acc;
      },
      {} as Record<string, Program>
    );

    it("should search by school name", () => {
      const result = searchParticipations(
        mockParticipations,
        mockSchoolsMap,
        mockContactsMap,
        mockProgramsMap,
        "Warszawa"
      );
      expect(result.length).toBeGreaterThan(0);
    });

    it("should search by program name", () => {
      const result = searchParticipations(
        mockParticipations,
        mockSchoolsMap,
        mockContactsMap,
        mockProgramsMap,
        "Program"
      );
      expect(result.length).toBeGreaterThan(0);
    });

    it("should search by coordinator name", () => {
      const result = searchParticipations(
        mockParticipations,
        mockSchoolsMap,
        mockContactsMap,
        mockProgramsMap,
        "Kowalski"
      );
      expect(result.length).toBeGreaterThan(0);
    });

    it("should search by student count", () => {
      const result = searchParticipations(
        mockParticipations,
        mockSchoolsMap,
        mockContactsMap,
        mockProgramsMap,
        "100"
      );
      expect(result.length).toBeGreaterThan(0);
    });

    it("should return empty array if search matches nothing", () => {
      const result = searchParticipations(
        mockParticipations,
        mockSchoolsMap,
        mockContactsMap,
        mockProgramsMap,
        "NonExistentSearch12345"
      );
      expect(result).toHaveLength(0);
    });

    it("should be case-insensitive", () => {
      const resultLower = searchParticipations(
        mockParticipations,
        mockSchoolsMap,
        mockContactsMap,
        mockProgramsMap,
        "warszawa"
      );
      const resultUpper = searchParticipations(
        mockParticipations,
        mockSchoolsMap,
        mockContactsMap,
        mockProgramsMap,
        "WARSZAWA"
      );
      expect(resultLower).toEqual(resultUpper);
    });
  });
});