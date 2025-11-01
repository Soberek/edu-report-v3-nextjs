import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useSchoolStatistics } from "../useSchoolStatistics";
import type { School, Program, SchoolProgramParticipation } from "@/types";

// Mock data
const mockSchools: School[] = [
  {
    id: "s1",
    name: "Szkoła Podstawowa Nr 1",
    address: "ul. Szkolna 1",
    city: "Warszawa",
    postalCode: "00-001",
    municipality: "Warszawa",
    email: "sp1@example.com",
    type: ["Szkoła podstawowa"],
    createdAt: "2024-01-01",
  },
  {
    id: "s2",
    name: "Liceum Nr 2",
    address: "ul. Szkolna 2",
    city: "Kraków",
    postalCode: "30-001",
    municipality: "Kraków",
    email: "lic2@example.com",
    type: ["Liceum"],
    createdAt: "2024-01-01",
  },
  {
    id: "s3",
    name: "Szkoła Podstawowa Nr 3",
    address: "ul. Szkolna 3",
    city: "Wrocław",
    postalCode: "50-001",
    municipality: "Wrocław",
    email: "sp3@example.com",
    type: ["Szkoła podstawowa"],
    createdAt: "2024-01-01",
  },
];

const mockPrograms: Program[] = [
  {
    id: "prog1",
    code: "PEZ",
    name: "Program Edukacji Zdrowotnej",
    schoolTypes: ["Szkoła podstawowa"],
    programType: "programowy",
    description: "Program zdrowotny",
  },
  {
    id: "prog2",
    code: "PP",
    name: "Program Profilaktyki",
    schoolTypes: ["Szkoła podstawowa", "Liceum"],
    programType: "programowy",
    description: "Program profilaktyki",
  },
  {
    id: "prog3",
    code: "PL",
    name: "Program dla Liceów",
    schoolTypes: ["Liceum"],
    programType: "programowy",
    description: "Program dla liceów",
  },
];

const mockParticipations: SchoolProgramParticipation[] = [
  {
    id: "p1",
    schoolId: "s1",
    programId: "prog1",
    coordinatorId: "c1",
    schoolYear: "2024/2025",
    studentCount: 50,
    notes: "Uczestniczą",
    createdAt: "2024-01-01",
    userId: "user1",
  },
  {
    id: "p2",
    schoolId: "s1",
    programId: "prog2",
    coordinatorId: "c1",
    schoolYear: "2024/2025",
    studentCount: 30,
    notes: "Uczestniczą",
    createdAt: "2024-01-01",
    userId: "user1",
  },
  {
    id: "p3",
    schoolId: "s2",
    programId: "prog2",
    coordinatorId: "c2",
    schoolYear: "2024/2025",
    studentCount: 40,
    notes: "Uczestniczą",
    createdAt: "2024-01-01",
    userId: "user1",
  },
];

describe("useSchoolStatistics", () => {
  describe("when loading", () => {
    it("should return empty state when isLoading is true", () => {
      const { result } = renderHook(() =>
        useSchoolStatistics(mockSchools, mockPrograms, mockParticipations, true)
      );

      expect(result.current).toEqual({
        schoolsInfo: [],
        generalStats: {
          totalSchools: 0,
          nonParticipatingCount: 0,
          totalParticipations: 0,
          totalMissingParticipations: 0,
        },
        programStats: {},
      });
    });

    it("should return empty state when schools are empty", () => {
      const { result } = renderHook(() =>
        useSchoolStatistics([], mockPrograms, mockParticipations, false)
      );

      expect(result.current).toEqual({
        schoolsInfo: [],
        generalStats: {
          totalSchools: 0,
          nonParticipatingCount: 0,
          totalParticipations: 0,
          totalMissingParticipations: 0,
        },
        programStats: {},
      });
    });

    it("should return empty state when programs are empty", () => {
      const { result } = renderHook(() =>
        useSchoolStatistics(mockSchools, [], mockParticipations, false)
      );

      expect(result.current).toEqual({
        schoolsInfo: [],
        generalStats: {
          totalSchools: 0,
          nonParticipatingCount: 0,
          totalParticipations: 0,
          totalMissingParticipations: 0,
        },
        programStats: {},
      });
    });

    it("should return empty state when participations are empty", () => {
      const { result } = renderHook(() =>
        useSchoolStatistics(mockSchools, mockPrograms, [], false)
      );

      expect(result.current).toEqual({
        schoolsInfo: [],
        generalStats: {
          totalSchools: 0,
          nonParticipatingCount: 0,
          totalParticipations: 0,
          totalMissingParticipations: 0,
        },
        programStats: {},
      });
    });
  });

  describe("when data is available", () => {
    it("should calculate schoolsInfo for each school", () => {
      const { result } = renderHook(() =>
        useSchoolStatistics(mockSchools, mockPrograms, mockParticipations, false)
      );

      expect(result.current.schoolsInfo).toHaveLength(3);
      expect(result.current.schoolsInfo[0]).toHaveProperty("schoolName", "Szkoła Podstawowa Nr 1");
      expect(result.current.schoolsInfo[1]).toHaveProperty("schoolName", "Liceum Nr 2");
      expect(result.current.schoolsInfo[2]).toHaveProperty("schoolName", "Szkoła Podstawowa Nr 3");
    });

    it("should calculate participation info correctly per school", () => {
      const { result } = renderHook(() =>
        useSchoolStatistics(mockSchools, mockPrograms, mockParticipations, false)
      );

      const s1Info = result.current.schoolsInfo[0];
      // s1 participates in prog1 and prog2
      expect(s1Info.participating).toHaveLength(2);
      // s1 doesn't participate in prog3 (not eligible anyway)
      expect(s1Info.notParticipating).toHaveLength(0);

      const s2Info = result.current.schoolsInfo[1];
      // s2 participates in prog2
      expect(s2Info.participating).toHaveLength(1);
      // s2 doesn't participate in prog3 (eligible but no participation)
      expect(s2Info.notParticipating).toHaveLength(1);

      const s3Info = result.current.schoolsInfo[2];
      // s3 doesn't participate in any program
      expect(s3Info.participating).toHaveLength(0);
      // s3 is eligible for prog1 and prog2 but doesn't participate
      expect(s3Info.notParticipating).toHaveLength(2);
    });

    it("should calculate correct generalStats", () => {
      const { result } = renderHook(() =>
        useSchoolStatistics(mockSchools, mockPrograms, mockParticipations, false)
      );

      const stats = result.current.generalStats;
      expect(stats.totalSchools).toBe(3);
      expect(stats.totalParticipations).toBe(3);
      // s3 is the only non-participating school (has applicable programs)
      expect(stats.nonParticipatingCount).toBe(1);
      // s3 is eligible for 2 programs but doesn't participate = 2 missing
      // s2 is eligible for prog3 but doesn't participate = 1 missing
      // total = 3 missing
      expect(stats.totalMissingParticipations).toBe(3);
    });

    it("should calculate programStats for each program", () => {
      const { result } = renderHook(() =>
        useSchoolStatistics(mockSchools, mockPrograms, mockParticipations, false)
      );

      const programStats = result.current.programStats;

      // prog1 (only for Szkoła podstawowa): eligible=s1,s3=2, participating=s1=1, not=s3=1
      expect(programStats["Program Edukacji Zdrowotnej"]).toEqual({
        eligible: 2,
        participating: 1,
        notParticipating: 1,
      });

      // prog2 (for Szkoła podstawowa and Liceum): eligible=s1,s2,s3=3, participating=s1,s2=2, not=s3=1
      expect(programStats["Program Profilaktyki"]).toEqual({
        eligible: 3,
        participating: 2,
        notParticipating: 1,
      });

      // prog3 (only for Liceum): eligible=s2=1, participating=0, not=s2=1
      expect(programStats["Program dla Liceów"]).toEqual({
        eligible: 1,
        participating: 0,
        notParticipating: 1,
      });
    });

    it("should verify math: sum of eligible across programs equals total schools × applicable programs", () => {
      const { result } = renderHook(() =>
        useSchoolStatistics(mockSchools, mockPrograms, mockParticipations, false)
      );

      const programStats = result.current.programStats;
      const totalEligible = Object.values(programStats).reduce((sum, stat) => sum + stat.eligible, 0);
      
      // Each school is eligible for at least one program:
      // s1: prog1, prog2 = 2
      // s2: prog2, prog3 = 2
      // s3: prog1, prog2 = 2
      // Total = 6
      expect(totalEligible).toBe(6);
    });

    it("should return same data on re-render with same props (memoization)", () => {
      const { result, rerender } = renderHook(
        ({ schools, programs, participations, loading }) =>
          useSchoolStatistics(schools, programs, participations, loading),
        {
          initialProps: {
            schools: mockSchools,
            programs: mockPrograms,
            participations: mockParticipations,
            loading: false,
          },
        }
      );

      const firstResult = result.current;

      // Re-render with same props
      rerender({
        schools: mockSchools,
        programs: mockPrograms,
        participations: mockParticipations,
        loading: false,
      });

      // Should return same reference due to useMemo
      expect(result.current).toBe(firstResult);
    });

    it("should recalculate when any prop changes", () => {
      const { result, rerender } = renderHook(
        ({ schools, programs, participations, loading }) =>
          useSchoolStatistics(schools, programs, participations, loading),
        {
          initialProps: {
            schools: mockSchools,
            programs: mockPrograms,
            participations: mockParticipations,
            loading: false,
          },
        }
      );

      const firstResult = result.current;
      expect(firstResult.generalStats.totalSchools).toBe(3);

      // Re-render with additional school
      const additionalSchool: School = {
        id: "s4",
        name: "Szkoła Podstawowa Nr 4",
        address: "ul. Szkolna 4",
        city: "Poznań",
        postalCode: "60-001",
        municipality: "Poznań",
        email: "sp4@example.com",
        type: ["Szkoła podstawowa"],
        createdAt: "2024-01-01",
      };

      rerender({
        schools: [...mockSchools, additionalSchool],
        programs: mockPrograms,
        participations: mockParticipations,
        loading: false,
      });

      // Should return different reference and updated stats
      expect(result.current).not.toBe(firstResult);
      expect(result.current.generalStats.totalSchools).toBe(4);
    });

    it("should calculate stats when some schools have no participations", () => {
      const { result } = renderHook(() =>
        useSchoolStatistics(mockSchools, mockPrograms, mockParticipations, false)
      );

      // s3 has no participations
      const s3Info = result.current.schoolsInfo.find((info) => info.schoolName === "Szkoła Podstawowa Nr 3");
      expect(s3Info?.participating).toHaveLength(0);
      expect(s3Info?.notParticipating.length).toBeGreaterThan(0);
    });

    it("should handle schools with multiple eligible programs correctly", () => {
      const { result } = renderHook(() =>
        useSchoolStatistics(mockSchools, mockPrograms, mockParticipations, false)
      );

      const s1Info = result.current.schoolsInfo.find((info) => info.schoolName === "Szkoła Podstawowa Nr 1");
      // s1 is eligible for prog1 (Szkoła podstawowa) and prog2 (Szkoła podstawowa, Liceum)
      expect(s1Info?.participating).toHaveLength(2);
    });

    it("should correctly identify non-participating schools", () => {
      const { result } = renderHook(() =>
        useSchoolStatistics(mockSchools, mockPrograms, mockParticipations, false)
      );

      const { schoolsInfo, generalStats } = result.current;
      const nonParticipatingSchools = schoolsInfo.filter(
        (info) => info.participating.length === 0 && info.notParticipating.length > 0
      );

      expect(nonParticipatingSchools).toHaveLength(generalStats.nonParticipatingCount);
    });
  });

  describe("edge cases", () => {
    it("should handle single school with single participation", () => {
      const singleSchool = [mockSchools[0]];
      const singleProgram = [mockPrograms[0]];
      const singleParticipation = [mockParticipations[0]];

      const { result } = renderHook(() =>
        useSchoolStatistics(singleSchool, singleProgram, singleParticipation, false)
      );

      expect(result.current.generalStats.totalSchools).toBe(1);
      expect(result.current.generalStats.totalParticipations).toBe(1);
      expect(result.current.schoolsInfo).toHaveLength(1);
    });

    it("should handle school with all applicable programs", () => {
      // Create a school eligible for all programs
      const universalSchool: School = {
        id: "s-universal",
        name: "Universal School",
        address: "ul. Universal",
        city: "City",
        postalCode: "00-000",
        municipality: "City",
        email: "universal@example.com",
        type: ["Szkoła podstawowa", "Liceum"],
        createdAt: "2024-01-01",
      };

      const { result } = renderHook(() =>
        useSchoolStatistics([universalSchool], mockPrograms, [], false)
      );

      // Should return empty state because no participations provided
      expect(result.current.schoolsInfo).toHaveLength(0);
    });
  });
});
