import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useFilterState } from "../useFilterState";

describe("useFilterState hook", () => {
  describe("initial state", () => {
    it("should initialize with default filter values", () => {
      const { result } = renderHook(() => useFilterState());

      expect(result.current.filters.schoolYear).toBe("all");
      expect(result.current.filters.program).toBe("all");
      expect(result.current.filters.schoolName).toBe("");
      expect(result.current.filters.status).toBe("all");
      expect(result.current.filters.search).toBe("");
    });
  });

  describe("setSchoolYear", () => {
    it("should update school year filter", () => {
      const { result } = renderHook(() => useFilterState());

      act(() => {
        result.current.setSchoolYear("2024/2025");
      });

      expect(result.current.filters.schoolYear).toBe("2024/2025");
    });

    it("should handle 'all' value", () => {
      const { result } = renderHook(() => useFilterState());

      act(() => {
        result.current.setSchoolYear("2024/2025");
      });

      act(() => {
        result.current.setSchoolYear("all");
      });

      expect(result.current.filters.schoolYear).toBe("all");
    });

    it("should not affect other filters", () => {
      const { result } = renderHook(() => useFilterState());

      act(() => {
        result.current.setProgram("program-1");
        result.current.setSchoolYear("2024/2025");
      });

      expect(result.current.filters.program).toBe("program-1");
      expect(result.current.filters.schoolYear).toBe("2024/2025");
    });
  });

  describe("setProgram", () => {
    it("should update program filter", () => {
      const { result } = renderHook(() => useFilterState());

      act(() => {
        result.current.setProgram("program-123");
      });

      expect(result.current.filters.program).toBe("program-123");
    });

    it("should handle 'all' value", () => {
      const { result } = renderHook(() => useFilterState());

      act(() => {
        result.current.setProgram("program-123");
      });

      act(() => {
        result.current.setProgram("all");
      });

      expect(result.current.filters.program).toBe("all");
    });

    it("should not affect other filters", () => {
      const { result } = renderHook(() => useFilterState());

      act(() => {
        result.current.setSchoolYear("2024/2025");
        result.current.setProgram("program-1");
      });

      expect(result.current.filters.schoolYear).toBe("2024/2025");
      expect(result.current.filters.program).toBe("program-1");
    });
  });

  describe("setSchoolName", () => {
    it("should update school name filter", () => {
      const { result } = renderHook(() => useFilterState());

      act(() => {
        result.current.setSchoolName("Szkoła Podstawowa nr 1");
      });

      expect(result.current.filters.schoolName).toBe("Szkoła Podstawowa nr 1");
    });

    it("should handle empty string", () => {
      const { result } = renderHook(() => useFilterState());

      act(() => {
        result.current.setSchoolName("Test School");
        result.current.setSchoolName("");
      });

      expect(result.current.filters.schoolName).toBe("");
    });

    it("should handle special characters", () => {
      const { result } = renderHook(() => useFilterState());
      const specialName = "Szkoła im. J. Piłsudskiego - Z. I.L.O.";

      act(() => {
        result.current.setSchoolName(specialName);
      });

      expect(result.current.filters.schoolName).toBe(specialName);
    });

    it("should not affect other filters", () => {
      const { result } = renderHook(() => useFilterState());

      act(() => {
        result.current.setStatus("participating");
        result.current.setSchoolName("School A");
      });

      expect(result.current.filters.status).toBe("participating");
      expect(result.current.filters.schoolName).toBe("School A");
    });
  });

  describe("setStatus", () => {
    it("should update status filter", () => {
      const { result } = renderHook(() => useFilterState());

      act(() => {
        result.current.setStatus("participating");
      });

      expect(result.current.filters.status).toBe("participating");
    });

    it("should handle 'notParticipating' status", () => {
      const { result } = renderHook(() => useFilterState());

      act(() => {
        result.current.setStatus("notParticipating");
      });

      expect(result.current.filters.status).toBe("notParticipating");
    });

    it("should handle 'all' status", () => {
      const { result } = renderHook(() => useFilterState());

      act(() => {
        result.current.setStatus("participating");
        result.current.setStatus("all");
      });

      expect(result.current.filters.status).toBe("all");
    });

    it("should not affect other filters", () => {
      const { result } = renderHook(() => useFilterState());

      act(() => {
        result.current.setSchoolYear("2024/2025");
        result.current.setStatus("participating");
      });

      expect(result.current.filters.schoolYear).toBe("2024/2025");
      expect(result.current.filters.status).toBe("participating");
    });
  });

  describe("setSearch", () => {
    it("should update search filter", () => {
      const { result } = renderHook(() => useFilterState());

      act(() => {
        result.current.setSearch("coordinator name");
      });

      expect(result.current.filters.search).toBe("coordinator name");
    });

    it("should handle empty search", () => {
      const { result } = renderHook(() => useFilterState());

      act(() => {
        result.current.setSearch("test");
        result.current.setSearch("");
      });

      expect(result.current.filters.search).toBe("");
    });

    it("should handle special characters in search", () => {
      const { result } = renderHook(() => useFilterState());
      const searchText = "Jan Kowalski (O.I)";

      act(() => {
        result.current.setSearch(searchText);
      });

      expect(result.current.filters.search).toBe(searchText);
    });

    it("should not affect other filters", () => {
      const { result } = renderHook(() => useFilterState());

      act(() => {
        result.current.setProgram("program-1");
        result.current.setSearch("search text");
      });

      expect(result.current.filters.program).toBe("program-1");
      expect(result.current.filters.search).toBe("search text");
    });
  });

  describe("resetFilters", () => {
    it("should reset all filters to default values", () => {
      const { result } = renderHook(() => useFilterState());

      act(() => {
        result.current.setSchoolYear("2024/2025");
        result.current.setProgram("program-1");
        result.current.setSchoolName("School A");
        result.current.setStatus("participating");
        result.current.setSearch("test");
      });

      act(() => {
        result.current.resetFilters();
      });

      expect(result.current.filters.schoolYear).toBe("all");
      expect(result.current.filters.program).toBe("all");
      expect(result.current.filters.schoolName).toBe("");
      expect(result.current.filters.status).toBe("all");
      expect(result.current.filters.search).toBe("");
    });

    it("should work when called on initial state", () => {
      const { result } = renderHook(() => useFilterState());

      act(() => {
        result.current.resetFilters();
      });

      expect(result.current.filters.schoolYear).toBe("all");
      expect(result.current.filters.program).toBe("all");
    });

    it("should work when called multiple times", () => {
      const { result } = renderHook(() => useFilterState());

      act(() => {
        result.current.setSchoolYear("2024/2025");
        result.current.resetFilters();
        result.current.setSchoolYear("2025/2026");
        result.current.resetFilters();
      });

      expect(result.current.filters.schoolYear).toBe("all");
    });
  });

  describe("multiple updates", () => {
    it("should handle sequential updates correctly", () => {
      const { result } = renderHook(() => useFilterState());

      act(() => {
        result.current.setSchoolYear("2024/2025");
        result.current.setProgram("program-1");
        result.current.setSchoolName("School A");
      });

      expect(result.current.filters).toEqual({
        schoolYear: "2024/2025",
        program: "program-1",
        schoolName: "School A",
        status: "all",
        search: "",
      });
    });

    it("should handle rapid updates", () => {
      const { result } = renderHook(() => useFilterState());

      act(() => {
        for (let i = 0; i < 10; i++) {
          result.current.setSchoolYear(`${2024 + i}/${2025 + i}`);
        }
      });

      // Last iteration should be i=9, so year should be 2033/2034
      expect(result.current.filters.schoolYear).toBe("2033/2034");
    });

    it("should allow independent filter updates", () => {
      const { result } = renderHook(() => useFilterState());

      act(() => {
        result.current.setSchoolYear("2024/2025");
      });

      expect(result.current.filters.schoolYear).toBe("2024/2025");
      expect(result.current.filters.program).toBe("all");

      act(() => {
        result.current.setProgram("program-1");
      });

      expect(result.current.filters.schoolYear).toBe("2024/2025");
      expect(result.current.filters.program).toBe("program-1");
    });
  });

  describe("state persistence across renders", () => {
    it("should maintain state after re-render", () => {
      const { result, rerender } = renderHook(() => useFilterState());

      act(() => {
        result.current.setSchoolYear("2024/2025");
        result.current.setProgram("program-1");
      });

      rerender();

      expect(result.current.filters.schoolYear).toBe("2024/2025");
      expect(result.current.filters.program).toBe("program-1");
    });

    it("should maintain separate state across different hook instances", () => {
      const { result: result1 } = renderHook(() => useFilterState());
      const { result: result2 } = renderHook(() => useFilterState());

      act(() => {
        result1.current.setSchoolYear("2024/2025");
        result2.current.setSchoolYear("2025/2026");
      });

      expect(result1.current.filters.schoolYear).toBe("2024/2025");
      expect(result2.current.filters.schoolYear).toBe("2025/2026");
    });
  });

  describe("edge cases", () => {
    it("should handle whitespace in school name", () => {
      const { result } = renderHook(() => useFilterState());

      act(() => {
        result.current.setSchoolName("  School A  ");
      });

      expect(result.current.filters.schoolName).toBe("  School A  ");
    });

    it("should handle very long search strings", () => {
      const { result } = renderHook(() => useFilterState());
      const longString = "A".repeat(1000);

      act(() => {
        result.current.setSearch(longString);
      });

      expect(result.current.filters.search).toBe(longString);
    });

    it("should handle numeric strings in school name", () => {
      const { result } = renderHook(() => useFilterState());

      act(() => {
        result.current.setSchoolName("Szkoła nr 123-456");
      });

      expect(result.current.filters.schoolName).toBe("Szkoła nr 123-456");
    });

    it("should handle unicode characters", () => {
      const { result } = renderHook(() => useFilterState());
      const unicodeName = "Szkoła imienia Ł.L. Zamenhof 🏫";

      act(() => {
        result.current.setSchoolName(unicodeName);
      });

      expect(result.current.filters.schoolName).toBe(unicodeName);
    });
  });

  describe("type safety", () => {
    it("should enforce filter types", () => {
      const { result } = renderHook(() => useFilterState());

      // These should work
      act(() => {
        result.current.setStatus("all");
        result.current.setStatus("participating");
        result.current.setStatus("notParticipating");
      });

      expect(result.current.filters.status).toBe("notParticipating");
    });

    it("should return all required filter setters", () => {
      const { result } = renderHook(() => useFilterState());

      expect(typeof result.current.setSchoolYear).toBe("function");
      expect(typeof result.current.setProgram).toBe("function");
      expect(typeof result.current.setSchoolName).toBe("function");
      expect(typeof result.current.setStatus).toBe("function");
      expect(typeof result.current.setSearch).toBe("function");
      expect(typeof result.current.resetFilters).toBe("function");
    });

    it("should return filters object with all required properties", () => {
      const { result } = renderHook(() => useFilterState());

      expect(result.current.filters).toHaveProperty("schoolYear");
      expect(result.current.filters).toHaveProperty("program");
      expect(result.current.filters).toHaveProperty("schoolName");
      expect(result.current.filters).toHaveProperty("status");
      expect(result.current.filters).toHaveProperty("search");
    });
  });
});
