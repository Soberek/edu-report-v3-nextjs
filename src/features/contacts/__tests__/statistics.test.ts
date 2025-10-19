/**
 * Tests for statistics utility functions
 * Tests contact statistics calculation and filtering
 */

import { describe, it, expect } from "vitest";
import { calculateContactStats, searchContacts } from "../utils/statistics";
import type { Contact } from "../types";

// Mock contact data
const mockContact = (overrides?: Partial<Contact>): Contact => ({
  id: "1",
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  phone: "123456789",
  userId: "user123",
  createdAt: new Date().toISOString(),
  ...overrides,
});

describe("Statistics Utilities", () => {
  describe("calculateContactStats", () => {
    it("should return zero stats for empty array", () => {
      const stats = calculateContactStats([]);
      expect(stats).toEqual({
        total: 0,
        withEmail: 0,
        withPhone: 0,
        recentCount: 0,
      });
    });

    it("should count total contacts", () => {
      const contacts = [
        mockContact({ id: "1" }),
        mockContact({ id: "2" }),
        mockContact({ id: "3" }),
      ];
      const stats = calculateContactStats(contacts);
      expect(stats.total).toBe(3);
    });

    it("should count contacts with email", () => {
      const contacts = [
        mockContact({ email: "john@example.com" }),
        mockContact({ email: "" }),
        mockContact({ email: "jane@example.com" }),
      ];
      const stats = calculateContactStats(contacts);
      expect(stats.withEmail).toBe(2);
    });

    it("should count contacts with phone", () => {
      const contacts = [
        mockContact({ phone: "123456789" }),
        mockContact({ phone: "" }),
        mockContact({ phone: "987654321" }),
      ];
      const stats = calculateContactStats(contacts);
      expect(stats.withPhone).toBe(2);
    });

    it("should count recent contacts (added in last 7 days)", () => {
      const now = new Date();
      const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
      const tenDaysAgo = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000);

      const contacts = [
        mockContact({ id: "1", createdAt: new Date().toISOString() }),
        mockContact({ id: "2", createdAt: threeDaysAgo.toISOString() }),
        mockContact({ id: "3", createdAt: tenDaysAgo.toISOString() }),
      ];

      const stats = calculateContactStats(contacts);
      expect(stats.recentCount).toBe(2);
    });

    it("should handle contacts with empty email and phone strings", () => {
      const contacts = [
        mockContact({ email: "", phone: "" }),
        mockContact({ email: "test@example.com", phone: "123456" }),
      ];
      const stats = calculateContactStats(contacts);
      expect(stats.withEmail).toBe(1);
      expect(stats.withPhone).toBe(1);
    });
  });

  describe("searchContacts", () => {
    const contacts = [
      mockContact({
        id: "1",
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        phone: "123456789",
      }),
      mockContact({
        id: "2",
        firstName: "Jane",
        lastName: "Smith",
        email: "jane@example.com",
        phone: "987654321",
      }),
      mockContact({
        id: "3",
        firstName: "Bob",
        lastName: "Johnson",
        email: "bob@example.com",
        phone: "555555555",
      }),
    ];

    it("should return empty array when search term is empty", () => {
      expect(searchContacts(contacts, "")).toEqual([]);
      expect(searchContacts(contacts, "   ")).toEqual([]);
    });

    it("should search by first name", () => {
      const results = searchContacts(contacts, "Jane");
      expect(results).toHaveLength(1);
      expect(results[0].firstName).toBe("Jane");
    });

    it("should search by last name", () => {
      const results = searchContacts(contacts, "Smith");
      expect(results).toHaveLength(1);
      expect(results[0].lastName).toBe("Smith");
    });

    it("should search by email", () => {
      const results = searchContacts(contacts, "bob@example.com");
      expect(results).toHaveLength(1);
      expect(results[0].id).toBe("3");
    });

    it("should search by phone", () => {
      const results = searchContacts(contacts, "987654321");
      expect(results).toHaveLength(1);
      expect(results[0].firstName).toBe("Jane");
    });

    it("should search by full name", () => {
      const results = searchContacts(contacts, "Bob Johnson");
      expect(results).toHaveLength(1);
      expect(results[0].firstName).toBe("Bob");
    });

    it("should be case-insensitive", () => {
      expect(searchContacts(contacts, "jane")).toHaveLength(1);
      expect(searchContacts(contacts, "BOB")).toHaveLength(1);
      expect(searchContacts(contacts, "sMiTh")).toHaveLength(1);
    });

    it("should match partial strings", () => {
      const results = searchContacts(contacts, "oh");
      expect(results).toHaveLength(2); // John Doe, Bob Johnson
    });

    it("should return empty array when no matches found", () => {
      const results = searchContacts(contacts, "NonExistent");
      expect(results).toHaveLength(0);
    });
  });
});
