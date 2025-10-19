/**
 * Edge case and error scenario tests
 * Tests boundary conditions, error handling, and unusual inputs
 */

import { describe, it, expect } from "vitest";
import { searchContacts, calculateContactStats } from "../utils/statistics";
import { getInitials, getAvatarColor, getAvatarDimensions } from "../utils/avatar";
import { isValidEmail, normalizePhoneNumber } from "../utils/validation";
import { contactsReducer, initialState } from "../reducers/contactsReducer";
import type { Contact } from "../types";

describe("Edge Cases and Error Scenarios", () => {
  describe("Avatar Utilities Edge Cases", () => {
    it("should handle very long names", () => {
      const longFirst = "A".repeat(1000);
      const longLast = "B".repeat(1000);

      const initials = getInitials(longFirst, longLast);
      expect(initials).toBe("AB");
      expect(initials).toHaveLength(2);
    });

    it("should handle unicode characters", () => {
      expect(getInitials("François", "Müller")).toBe("FM");
      expect(getInitials("北京", "张三")).toBe("北张");
      expect(getInitials("Москва", "Петров")).toBe("МП");
    });

    it("should handle special characters in names", () => {
      expect(getInitials("O'Brien", "D'Angelo")).toBe("OD");
      expect(getInitials("Mary-Jane", "Van-Der-Berg")).toBe("MV");
    });

    it("should return consistent colors for boundary characters", () => {
      const colorA = getAvatarColor("A");
      const colorZ = getAvatarColor("Z");
      const color0 = getAvatarColor("0");

      expect(colorA).toMatch(/^#[0-9a-f]{6}$/i);
      expect(colorZ).toMatch(/^#[0-9a-f]{6}$/i);
      expect(color0).toMatch(/^#[0-9a-f]{6}$/i);
    });

    it("should handle emoji in names", () => {
      // While unusual, function should not crash
      const initials = getInitials("😀John", "😎Doe");
      expect(initials.length).toBeGreaterThan(0);
    });
  });

  describe("Validation Edge Cases", () => {
    it("should handle email edge cases", () => {
      expect(isValidEmail("a@b.c")).toBe(true);
      expect(isValidEmail("user+tag@example.co.uk")).toBe(true);
      expect(isValidEmail("user.name@sub.domain.example.com")).toBe(true);
      expect(isValidEmail("@")).toBe(false);
      expect(isValidEmail("user@")).toBe(false);
      expect(isValidEmail("@example.com")).toBe(false);
    });

    it("should normalize phone numbers with various formats", () => {
      expect(normalizePhoneNumber("123-456-7890")).toBe("123-456-7890");
      expect(normalizePhoneNumber("(123) 456-7890")).toBe("(123) 456-7890");
      expect(normalizePhoneNumber("+48 123 456 789")).toBe("48 123 456 789");
      expect(normalizePhoneNumber("123456789")).toBe("123456789");
    });

    it("should handle phone numbers with special characters", () => {
      const normalized = normalizePhoneNumber("*67#123-456-7890");
      expect(normalized).not.toContain("*");
      expect(normalized).not.toContain("#");
    });

    it("should handle extremely long phone numbers", () => {
      const longPhone = "1".repeat(100);
      const normalized = normalizePhoneNumber(longPhone);
      expect(normalized).toHaveLength(100);
    });
  });

  describe("Search Edge Cases", () => {
    const createContact = (overrides?: Partial<Contact>): Contact => ({
      id: "1",
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      phone: "123456789",
      userId: "user123",
      createdAt: new Date().toISOString(),
      ...overrides,
    });

    it("should handle search with special characters", () => {
      const contacts = [
        createContact({ email: "user+tag@example.com" }),
        createContact({ phone: "(555) 123-4567" }),
      ];

      // Search for special character patterns
      const results1 = searchContacts(contacts, "+tag");
      expect(results1).toHaveLength(1);

      const results2 = searchContacts(contacts, "(555)");
      expect(results2).toHaveLength(1);
    });

    it("should handle search with very long strings", () => {
      const contacts = [createContact()];
      const longSearch = "a".repeat(1000);
      const results = searchContacts(contacts, longSearch);
      expect(results).toHaveLength(0);
    });

    it("should handle search with only whitespace", () => {
      const contacts = [createContact()];
      const results = searchContacts(contacts, "   ");
      expect(results).toHaveLength(0);
    });

    it("should handle contacts with null/undefined optional fields", () => {
      const contacts = [
        createContact({ email: undefined, phone: undefined }),
        createContact({ email: "", phone: "" }),
      ];

      const results = searchContacts(contacts, "John");
      expect(results).toHaveLength(2);
    });

    it("should handle unicode in search", () => {
      const contacts = [
        createContact({
          firstName: "François",
          lastName: "Müller",
          email: "francois@müller.com",
        }),
      ];

      const results = searchContacts(contacts, "François");
      expect(results).toHaveLength(1);
    });
  });

  describe("Statistics Edge Cases", () => {
    const createContact = (overrides?: Partial<Contact>): Contact => ({
      id: "1",
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      phone: "123456789",
      userId: "user123",
      createdAt: new Date().toISOString(),
      ...overrides,
    });

    it("should handle array with single contact", () => {
      const contacts = [createContact()];
      const stats = calculateContactStats(contacts);
      expect(stats.total).toBe(1);
      expect(stats.withEmail).toBe(1);
      expect(stats.withPhone).toBe(1);
    });

    it("should handle array with very many contacts", () => {
      const contacts: Contact[] = [];
      for (let i = 0; i < 10000; i++) {
        contacts.push(
          createContact({
            id: `contact-${i}`,
            firstName: `Person${i}`,
          })
        );
      }

      const stats = calculateContactStats(contacts);
      expect(stats.total).toBe(10000);
    });

    it("should handle contacts with far future dates", () => {
      // Note: Future dates will technically count as "recent" since they're > sevenDaysAgo
      // This tests that the function handles them without errors
      const futureDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();
      const contacts = [createContact({ createdAt: futureDate })];

      const stats = calculateContactStats(contacts);
      expect(stats.total).toBe(1);
      // Future dates are technically > sevenDaysAgo, so they count as recent
      expect(stats.recentCount).toBe(1);
    });

    it("should handle contacts with far past dates", () => {
      const pastDate = new Date(1970, 0, 1).toISOString();
      const contacts = [createContact({ createdAt: pastDate })];

      const stats = calculateContactStats(contacts);
      expect(stats.total).toBe(1);
      expect(stats.recentCount).toBe(0);
    });
  });

  describe("Reducer Edge Cases", () => {
    const createContact = (overrides?: Partial<Contact>): Contact => ({
      id: "1",
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      phone: "123456789",
      userId: "user123",
      createdAt: new Date().toISOString(),
      ...overrides,
    });

    it("should handle deleting non-existent contact", () => {
      const contact = createContact();
      const state = { data: [contact], loading: false, error: null };

      const newState = contactsReducer(state, {
        type: "DELETE_CONTACT",
        payload: "non-existent-id",
      });

      expect(newState.data).toHaveLength(1);
      expect(newState.data[0]).toEqual(contact);
    });

    it("should handle updating non-existent contact", () => {
      const contact = createContact();
      const state = { data: [contact], loading: false, error: null };

      const newState = contactsReducer(state, {
        type: "UPDATE_CONTACT",
        payload: createContact({ id: "non-existent" }),
      });

      expect(newState.data).toHaveLength(1);
      expect(newState.data[0]).toEqual(contact);
    });

    it("should handle adding duplicate IDs", () => {
      const contact = createContact({ id: "1" });
      const state = { data: [contact], loading: false, error: null };

      const newState = contactsReducer(state, {
        type: "ADD_CONTACT",
        payload: createContact({ id: "1", firstName: "Different" }),
      });

      // Should add anyway (no deduplication)
      expect(newState.data).toHaveLength(2);
      expect(newState.data[0].firstName).toBe("Different");
    });

    it("should handle clearing error multiple times", () => {
      const state = { data: [], loading: false, error: null };

      let newState = contactsReducer(state, { type: "CLEAR_ERROR" });
      expect(newState.error).toBeNull();

      newState = contactsReducer(newState, { type: "CLEAR_ERROR" });
      expect(newState.error).toBeNull();
    });

    it("should maintain data order when updating", () => {
      const contacts = [
        createContact({ id: "1", firstName: "First" }),
        createContact({ id: "2", firstName: "Second" }),
        createContact({ id: "3", firstName: "Third" }),
      ];

      const state = { data: contacts, loading: false, error: null };
      const newState = contactsReducer(state, {
        type: "UPDATE_CONTACT",
        payload: createContact({ id: "2", firstName: "Updated" }),
      });

      expect(newState.data[0].id).toBe("1");
      expect(newState.data[1].firstName).toBe("Updated");
      expect(newState.data[2].id).toBe("3");
    });
  });

  describe("Data Type Edge Cases", () => {
    it("should handle empty strings in all fields", () => {
      const initials = getInitials("", "");
      expect(initials).toBe("");

      const color = getAvatarColor("");
      expect(typeof color).toBe("string");
      expect(color).toMatch(/^#[0-9a-f]{6}$/i);
    });

    it("should handle whitespace-only fields", () => {
      const initials = getInitials("   ", "   ");
      // getInitials takes first character, so should get spaces
      expect(initials).toBe("  ");
    });

    it("should handle single character names", () => {
      expect(getInitials("A", "B")).toBe("AB");
      expect(getInitials("X", "Y")).toBe("XY");
    });

    it("should handle numbers in names", () => {
      expect(getInitials("123", "456")).toBe("14");
      expect(getInitials("John2", "Doe3")).toBe("JD");
    });
  });
});
