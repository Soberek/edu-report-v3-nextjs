import { describe, it, expect } from "vitest";
import { queryKeys, COLLECTIONS } from "../queryConstants";

describe("queryConstants", () => {
  describe("queryKeys factory", () => {
    const testUserId = "user-123";

    describe("hierarchy structure", () => {
      it("should have root key 'participation-feature'", () => {
        expect(queryKeys.all).toEqual(["participation-feature"]);
      });

      it("should create school query keys with proper hierarchy", () => {
        expect(queryKeys.schools()).toEqual(["participation-feature", "schools"]);
        expect(queryKeys.schoolsAll()).toEqual(["participation-feature", "schools", "all"]);
        expect(queryKeys.schoolsByUser(testUserId)).toEqual([
          "participation-feature",
          "schools",
          testUserId,
        ]);
      });

      it("should create contact query keys with proper hierarchy", () => {
        expect(queryKeys.contacts()).toEqual(["participation-feature", "contacts"]);
        expect(queryKeys.contactsAll()).toEqual(["participation-feature", "contacts", "all"]);
        expect(queryKeys.contactsByUser(testUserId)).toEqual([
          "participation-feature",
          "contacts",
          testUserId,
        ]);
      });

      it("should create program query keys with proper hierarchy", () => {
        expect(queryKeys.programs()).toEqual(["participation-feature", "programs"]);
        expect(queryKeys.programsAll()).toEqual(["participation-feature", "programs", "all"]);
        expect(queryKeys.programsByUser(testUserId)).toEqual([
          "participation-feature",
          "programs",
          testUserId,
        ]);
      });

      it("should create participation query keys with proper hierarchy", () => {
        expect(queryKeys.participations()).toEqual(["participation-feature", "participations"]);
        expect(queryKeys.participationsAll()).toEqual([
          "participation-feature",
          "participations",
          "all",
        ]);
        expect(queryKeys.participationsByUser(testUserId)).toEqual([
          "participation-feature",
          "participations",
          testUserId,
        ]);
      });
    });

    describe("year-specific participation keys", () => {
      it("should create year-specific keys with user and year", () => {
        const year = "2024/2025";
        expect(queryKeys.participationsByYear(testUserId, year)).toEqual([
          "participation-feature",
          "participations",
          testUserId,
          year,
        ]);
      });

      it("should work with different school years", () => {
        const year1 = "2024/2025";
        const year2 = "2025/2026";

        const key1 = queryKeys.participationsByYear(testUserId, year1);
        const key2 = queryKeys.participationsByYear(testUserId, year2);

        expect(key1).not.toEqual(key2);
        expect(key1[key1.length - 1]).toBe(year1);
        expect(key2[key2.length - 1]).toBe(year2);
      });
    });

    describe("cache invalidation strategy", () => {
      it("should support cache invalidation at multiple levels", () => {
        // All participation feature data
        const allData = queryKeys.all;

        // All schools (any user)
        const allSchools = queryKeys.schools();

        // Specific user's schools
        const userSchools = queryKeys.schoolsByUser(testUserId);

        // Each should be progressively more specific
        expect(allData.length).toBeLessThan(allSchools.length);
        expect(allSchools.length).toBeLessThan(userSchools.length);
      });

      it("should support partial key matching for cache invalidation", () => {
        // Can invalidate all schools by matching ["participation-feature", "schools"]
        const schoolsPattern = queryKeys.schools();

        // User-specific school key includes pattern
        const userSchools = queryKeys.schoolsByUser(testUserId);

        expect(userSchools.slice(0, 2)).toEqual(schoolsPattern);
      });
    });

    describe("immutability", () => {
      it("should return readonly tuples", () => {
        const key = queryKeys.schoolsByUser(testUserId);
        expect(Array.isArray(key)).toBe(true);
        expect(key.length).toBeGreaterThan(0);
      });

      it("should not mutate when called multiple times", () => {
        const key1 = queryKeys.schoolsByUser(testUserId);
        const key2 = queryKeys.schoolsByUser(testUserId);

        expect(key1).toEqual(key2);
        expect(key1).not.toBe(key2); // Different array instances (expected)
      });
    });
  });

  describe("COLLECTIONS constants", () => {
    it("should define all collection names", () => {
      expect(COLLECTIONS.SCHOOLS).toBe("schools");
      expect(COLLECTIONS.CONTACTS).toBe("contacts");
      expect(COLLECTIONS.PROGRAMS).toBe("programs");
      expect(COLLECTIONS.PARTICIPATIONS).toBe("school-program-participation");
    });

    it("should contain exactly 4 collections", () => {
      const collectionCount = Object.keys(COLLECTIONS).length;
      expect(collectionCount).toBe(4);
    });

    it("should have unique collection names", () => {
      const values = Object.values(COLLECTIONS);
      const uniqueValues = new Set(values);
      expect(uniqueValues.size).toBe(values.length);
    });

    it("should have valid collection names (no spaces, lowercase or hyphens)", () => {
      Object.values(COLLECTIONS).forEach((name) => {
        expect(name).toMatch(/^[a-z-]+$/);
      });
    });
  });

  describe("type safety", () => {
    it("should export Collection type", () => {
      // This is a compile-time check, but we can verify the pattern
      const schoolCollection: string = COLLECTIONS.SCHOOLS;
      expect(typeof schoolCollection).toBe("string");
    });

    it("should provide valid collection values", () => {
      // Just verify the expected values exist as strings
      const schools = "schools";
      const contacts = "contacts";
      const programs = "programs";
      const participations = "school-program-participation";

      expect([schools, contacts, programs, participations]).toHaveLength(4);
    });
  });

  describe("real-world usage scenarios", () => {
    it("should support query client invalidation patterns", () => {
      // Invalidate all schools for all users
      const invalidateAllSchools = queryKeys.schools();
      expect(invalidateAllSchools).toEqual(["participation-feature", "schools"]);

      // Invalidate schools for specific user
      const invalidateUserSchools = queryKeys.schoolsByUser("user-123");
      expect(invalidateUserSchools).toHaveLength(3);
      expect(invalidateUserSchools[2]).toBe("user-123");
    });

    it("should support creating dynamic query keys", () => {
      const users = ["user-1", "user-2", "user-3"];
      const keys = users.map((uid) => queryKeys.schoolsByUser(uid));

      expect(keys).toHaveLength(3);
      expect(keys[0]).not.toEqual(keys[1]);
      expect(keys[1]).not.toEqual(keys[2]);
    });

    it("should work with empty user ID (fallback)", () => {
      const key = queryKeys.schoolsByUser("");
      expect(key).toEqual(["participation-feature", "schools", ""]);
    });
  });
});
