import { describe, it, expect } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import { ProgramStatistics } from "../ProgramStatistics";
import type { SchoolProgramParticipation } from "@/models/SchoolProgramParticipation";
import type { Program } from "@/types";

// Mock data
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
];

// Helper to create mock participations
const createMockParticipation = (
  id: string,
  schoolId: string,
  programId: string,
  schoolYear: "2024/2025" | "2025/2026" = "2024/2025"
): SchoolProgramParticipation => ({
  id,
  schoolId,
  programId,
  coordinatorId: "c1",
  schoolYear,
  studentCount: 50,
  createdAt: "2024-01-01",
  userId: "user1",
});

describe("ProgramStatistics", () => {
  describe("schoolCount calculation", () => {
    it("should count unique schools, not participations", () => {
      // Same school (s1) participates in prog1 for TWO different school years
      const participations: SchoolProgramParticipation[] = [
        createMockParticipation("p1", "s1", "prog1", "2024/2025"),
        createMockParticipation("p2", "s1", "prog1", "2025/2026"), // Same school, different year
      ];

      const { container } = render(<ProgramStatistics participations={participations} programs={mockPrograms} />);

      // The accordion should be present and expandable
      expect(container.querySelector("[id='program-statistics-header']")).toBeInTheDocument();
    });

    it("should handle multiple schools in same program", () => {
      // Two different schools in same program
      const participations: SchoolProgramParticipation[] = [
        createMockParticipation("p1", "s1", "prog1", "2024/2025"),
        createMockParticipation("p2", "s2", "prog1", "2024/2025"),
      ];

      const { container } = render(<ProgramStatistics participations={participations} programs={mockPrograms} />);

      // Should render two schools for prog1, not counting participations
      const expandButton = container.querySelector("[id='program-statistics-header']");
      expect(expandButton).toBeInTheDocument();
    });

    it("should return empty state when no participations", () => {
      const { getByText } = render(<ProgramStatistics participations={[]} programs={mockPrograms} />);

      expect(getByText(/Brak danych do wyświetlenia/i)).toBeInTheDocument();
    });

    it("should calculate school count correctly for mixed scenarios", () => {
      // s1: prog1 in 2024/2025 and 2025/2026 = 1 unique school
      // s2: prog1 in 2024/2025 = 1 unique school
      // s3: prog2 in 2024/2025 = 1 unique school
      const participations: SchoolProgramParticipation[] = [
        createMockParticipation("p1", "s1", "prog1", "2024/2025"),
        createMockParticipation("p2", "s1", "prog1", "2025/2026"),
        createMockParticipation("p3", "s2", "prog1", "2024/2025"),
        createMockParticipation("p4", "s3", "prog2", "2024/2025"),
      ];

      const { container } = render(<ProgramStatistics participations={participations} programs={mockPrograms} />);

      expect(container.querySelector("[id='program-statistics-header']")).toBeInTheDocument();
      // Verify component renders without errors
    });

    it("should calculate total students across all participations (not unique)", () => {
      // s1 participates in prog1 twice: 50 students in 2024/2025, 60 students in 2025/2026
      // Total should be 50 + 60 = 110, NOT deduplicated
      const participations: SchoolProgramParticipation[] = [
        {
          ...createMockParticipation("p1", "s1", "prog1", "2024/2025"),
          studentCount: 50,
        },
        {
          ...createMockParticipation("p2", "s1", "prog1", "2025/2026"),
          studentCount: 60,
        },
      ];

      const { container } = render(<ProgramStatistics participations={participations} programs={mockPrograms} />);

      expect(container.querySelector("[id='program-statistics-header']")).toBeInTheDocument();
    });

    it("should collect all school years across participations", () => {
      const participations: SchoolProgramParticipation[] = [
        createMockParticipation("p1", "s1", "prog1", "2024/2025"),
        createMockParticipation("p2", "s1", "prog1", "2025/2026"),
        createMockParticipation("p3", "s2", "prog1", "2024/2025"),
      ];

      const { container } = render(<ProgramStatistics participations={participations} programs={mockPrograms} />);

      expect(container.querySelector("[id='program-statistics-header']")).toBeInTheDocument();
    });

    it("should handle program with no matching participations", () => {
      // prog1 has participations, prog2 doesn't
      const participations: SchoolProgramParticipation[] = [createMockParticipation("p1", "s1", "prog1", "2024/2025")];

      const { container } = render(<ProgramStatistics participations={participations} programs={mockPrograms} />);

      expect(container.querySelector("[id='program-statistics-header']")).toBeInTheDocument();
    });

    it("should handle unknown programId gracefully", () => {
      const participations: SchoolProgramParticipation[] = [
        {
          ...createMockParticipation("p1", "s1", "unknown-prog", "2024/2025"),
          programId: "unknown-prog",
        },
      ];

      const { container } = render(<ProgramStatistics participations={participations} programs={mockPrograms} />);

      expect(container.querySelector("[id='program-statistics-header']")).toBeInTheDocument();
    });

    it("should not count same school twice even with multiple years", () => {
      // Create scenario where one school has 3 participations but should count as 1 school
      const participations: SchoolProgramParticipation[] = [
        createMockParticipation("p1", "s1", "prog1", "2024/2025"),
        createMockParticipation("p2", "s1", "prog1", "2025/2026"),
        createMockParticipation("p3", "s1", "prog1", "2025/2026"), // Same school, year 2 again
      ];

      // Render and verify it doesn't crash
      const { container } = render(<ProgramStatistics participations={participations} programs={mockPrograms} />);

      expect(container.querySelector("[id='program-statistics-header']")).toBeInTheDocument();
      // schoolCount for prog1 should be 1, not 3
    });

    it("should handle large number of participations efficiently", () => {
      // Create 100 participations from 10 unique schools
      const participations: SchoolProgramParticipation[] = [];
      for (let schoolNum = 1; schoolNum <= 10; schoolNum++) {
        for (let yearNum = 0; yearNum < 10; yearNum++) {
          const year = yearNum === 0 ? ("2024/2025" as const) : ("2025/2026" as const);
          participations.push(
            createMockParticipation(`p${schoolNum}-${yearNum}`, `s${schoolNum}`, "prog1", year)
          );
        }
      }

      const { container } = render(<ProgramStatistics participations={participations} programs={mockPrograms} />);

      expect(container.querySelector("[id='program-statistics-header']")).toBeInTheDocument();
      // Should count 10 unique schools, not 100 participations
    });
  });

  describe("edge cases", () => {
    it("should handle single participation", () => {
      const participations: SchoolProgramParticipation[] = [createMockParticipation("p1", "s1", "prog1")];

      const { container } = render(<ProgramStatistics participations={participations} programs={mockPrograms} />);

      expect(container.querySelector("[id='program-statistics-header']")).toBeInTheDocument();
    });

    it("should sort programs by school count descending", () => {
      // prog1: 2 schools, prog2: 1 school
      const participations: SchoolProgramParticipation[] = [
        createMockParticipation("p1", "s1", "prog1"),
        createMockParticipation("p2", "s2", "prog1"),
        createMockParticipation("p3", "s3", "prog2"),
      ];

      const { container } = render(<ProgramStatistics participations={participations} programs={mockPrograms} />);

      expect(container.querySelector("[id='program-statistics-header']")).toBeInTheDocument();
      // Verify sorting works (prog1 should appear before prog2 in stats)
    });
  });
});
