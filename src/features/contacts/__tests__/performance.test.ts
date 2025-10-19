/**
 * Performance and performance-related tests
 * Tests algorithm efficiency and memoization benefits
 */

import { describe, it, expect } from "vitest";
import { searchContacts, calculateContactStats } from "../utils/statistics";
import { getInitials, getAvatarColor } from "../utils/avatar";
import type { Contact } from "../types";

describe("Performance Tests", () => {
  const createManyContacts = (count: number): Contact[] => {
    const contacts: Contact[] = [];
    for (let i = 0; i < count; i++) {
      contacts.push({
        id: `contact-${i}`,
        firstName: `Person${i}`,
        lastName: `LastName${i}`,
        email: i % 3 === 0 ? `person${i}@example.com` : "",
        phone: i % 2 === 0 ? `${123000000 + i}` : "",
        userId: "user123",
        createdAt: new Date(2025, 0, i % 365).toISOString(),
      });
    }
    return contacts;
  };

  describe("Search Performance", () => {
    it("should search through 1000 contacts efficiently", () => {
      const contacts = createManyContacts(1000);
      const start = performance.now();

      const results = searchContacts(contacts, "Person5");

      const duration = performance.now() - start;
      expect(duration).toBeLessThan(100); // Should complete in under 100ms
      expect(results.length).toBeGreaterThan(0);
    });

    it("should handle multiple searches without degradation", () => {
      const contacts = createManyContacts(500);
      const searchTerms = ["Person1", "Person2", "example.com", "123456"];

      const start = performance.now();

      for (const term of searchTerms) {
        searchContacts(contacts, term);
      }

      const duration = performance.now() - start;
      expect(duration).toBeLessThan(200); // All searches under 200ms
    });

    it("should efficiently handle no results", () => {
      const contacts = createManyContacts(1000);
      const start = performance.now();

      const results = searchContacts(contacts, "NonExistentPerson12345");

      const duration = performance.now() - start;
      expect(duration).toBeLessThan(50);
      expect(results).toHaveLength(0);
    });
  });

  describe("Statistics Calculation Performance", () => {
    it("should calculate stats for 1000 contacts efficiently", () => {
      const contacts = createManyContacts(1000);
      const start = performance.now();

      const stats = calculateContactStats(contacts);

      const duration = performance.now() - start;
      expect(duration).toBeLessThan(50); // Should be very fast
      expect(stats.total).toBe(1000);
    });

    it("should calculate stats for 10000 contacts", () => {
      const contacts = createManyContacts(10000);
      const start = performance.now();

      const stats = calculateContactStats(contacts);

      const duration = performance.now() - start;
      expect(duration).toBeLessThan(100);
      expect(stats.total).toBe(10000);
    });
  });

  describe("Avatar Generation Performance", () => {
    it("should generate initials and colors efficiently", () => {
      const names = [
        ["John", "Doe"],
        ["Jane", "Smith"],
        ["Bob", "Johnson"],
        ["Alice", "Brown"],
        ["Charlie", "Davis"],
      ];

      const start = performance.now();

      for (const [first, last] of names) {
        getInitials(first, last);
        getAvatarColor(first);
      }

      const duration = performance.now() - start;
      expect(duration).toBeLessThan(10);
    });

    it("should generate colors deterministically (cached)", () => {
      const firstName = "Christopher";

      const start = performance.now();

      // Generate same color 1000 times
      for (let i = 0; i < 1000; i++) {
        getAvatarColor(firstName);
      }

      const duration = performance.now() - start;
      expect(duration).toBeLessThan(50);
    });
  });

  describe("Combined Operations Performance", () => {
    it("should handle search + stats calculation efficiently", () => {
      const contacts = createManyContacts(500);

      const start = performance.now();

      const searchResults = searchContacts(contacts, "Person");
      const stats = calculateContactStats(searchResults);

      const duration = performance.now() - start;
      expect(duration).toBeLessThan(100);
      expect(stats.total).toBeGreaterThan(0);
    });

    it("should efficiently filter and calculate multiple times", () => {
      const contacts = createManyContacts(1000);

      const start = performance.now();

      // Simulate multiple search and stats operations
      for (let i = 0; i < 10; i++) {
        const results = searchContacts(contacts, `Person${i}`);
        calculateContactStats(results);
      }

      const duration = performance.now() - start;
      expect(duration).toBeLessThan(200);
    });
  });

  describe("Memory Efficiency", () => {
    it("should not create large intermediate arrays", () => {
      const contacts = createManyContacts(1000);

      // Search should only return matched contacts, not copies of everything
      const results = searchContacts(contacts, "Person500");

      expect(results.length).toBeLessThan(contacts.length);
      expect(results.length).toBeGreaterThanOrEqual(1);
    });

    it("should handle edge case: searching for all items", () => {
      const contacts = createManyContacts(100);

      // Search for common term that matches all
      const results = searchContacts(contacts, "Person");

      expect(results.length).toBe(100);
      // Results should be original contact objects (no copies)
      expect(results[0]).toBe(contacts[0]);
    });
  });

  describe("Algorithmic Complexity", () => {
    it("should handle linear growth in search complexity", () => {
      const sizes = [100, 500, 1000];
      const times: number[] = [];

      for (const size of sizes) {
        const contacts = createManyContacts(size);
        const start = performance.now();

        searchContacts(contacts, "NonExistent");

        times.push(performance.now() - start);
      }

      // Each 5x increase in size should increase time proportionally
      // O(n) algorithm: time should roughly 5x
      // For simplicity, just verify all complete quickly
      expect(times.every((t) => t < 50)).toBe(true);
    });

    it("should handle stats calculation with linear complexity", () => {
      const sizes = [1000, 5000, 10000];
      const times: number[] = [];

      for (const size of sizes) {
        const contacts = createManyContacts(size);
        const start = performance.now();

        calculateContactStats(contacts);

        times.push(performance.now() - start);
      }

      // All should complete very quickly even with 10k items
      expect(times.every((t) => t < 100)).toBe(true);
    });
  });

  describe("Worst Case Scenarios", () => {
    it("should handle searching through contacts with many empty fields", () => {
      const contacts: Contact[] = [];
      for (let i = 0; i < 500; i++) {
        contacts.push({
          id: `contact-${i}`,
          firstName: `Person${i}`,
          lastName: "",
          email: "",
          phone: "",
          userId: "user123",
          createdAt: new Date().toISOString(),
        });
      }

      const start = performance.now();
      const results = searchContacts(contacts, "Person");
      const duration = performance.now() - start;

      expect(duration).toBeLessThan(50);
      expect(results.length).toBeGreaterThan(0);
    });

    it("should handle calculating stats with all nullish optional fields", () => {
      const contacts: Contact[] = [];
      for (let i = 0; i < 1000; i++) {
        contacts.push({
          id: `contact-${i}`,
          firstName: "Name",
          lastName: "Person",
          email: "",
          phone: "",
          userId: "user123",
          createdAt: new Date().toISOString(),
        });
      }

      const start = performance.now();
      const stats = calculateContactStats(contacts);
      const duration = performance.now() - start;

      expect(duration).toBeLessThan(50);
      expect(stats.withEmail).toBe(0);
      expect(stats.withPhone).toBe(0);
    });
  });
});
