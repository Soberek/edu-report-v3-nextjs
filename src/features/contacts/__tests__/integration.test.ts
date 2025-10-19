/**
 * Integration tests for contacts feature
 * Tests multiple components working together
 */

import { describe, it, expect } from "vitest";
import { searchContacts, calculateContactStats } from "../utils/statistics";
import { getInitials, getAvatarColor } from "../utils/avatar";
import { isValidEmail, normalizePhoneNumber } from "../utils/validation";
import type { Contact } from "../types";

// Mock contact factory
const createMockContact = (overrides?: Partial<Contact>): Contact => ({
  id: "1",
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  phone: "123456789",
  userId: "user123",
  createdAt: new Date().toISOString(),
  ...overrides,
});

describe("Contacts Integration Tests", () => {
  describe("Search and Statistics Integration", () => {
    it("should correctly calculate stats after filtering", () => {
      const contacts = [
        createMockContact({ id: "1", firstName: "John", email: "john@example.com", phone: "" }),
        createMockContact({ id: "2", firstName: "Jane", email: "", phone: "" }),
        createMockContact({ id: "3", firstName: "Bob", email: "", phone: "987654321" }),
      ];

      const stats = calculateContactStats(contacts);
      expect(stats.total).toBe(3);
      expect(stats.withEmail).toBe(1);
      expect(stats.withPhone).toBe(1);

      // Search for specific contacts
      const janeResults = searchContacts(contacts, "Jane");
      const janeStats = calculateContactStats(janeResults);
      expect(janeStats.total).toBe(1);
      expect(janeStats.withEmail).toBe(0);
    });

    it("should handle empty search results stats", () => {
      const contacts = [
        createMockContact({ id: "1", firstName: "John" }),
        createMockContact({ id: "2", firstName: "Jane" }),
      ];

      const searchResults = searchContacts(contacts, "NonExistent");
      const stats = calculateContactStats(searchResults);

      expect(stats.total).toBe(0);
      expect(stats.withEmail).toBe(0);
      expect(stats.withPhone).toBe(0);
    });
  });

  describe("Avatar and Contact Data Integration", () => {
    it("should generate consistent initials and colors for same contact", () => {
      const contact = createMockContact({
        firstName: "Christopher",
        lastName: "Johnson",
      });

      const initials = getInitials(contact.firstName, contact.lastName);
      const color = getAvatarColor(contact.firstName);

      // Same contact should produce same results
      const initials2 = getInitials(contact.firstName, contact.lastName);
      const color2 = getAvatarColor(contact.firstName);

      expect(initials).toBe(initials2);
      expect(color).toBe(color2);
    });

    it("should provide unique identifiers for different contacts", () => {
      const contact1 = createMockContact({
        id: "1",
        firstName: "Alice",
        lastName: "Smith",
      });
      const contact2 = createMockContact({
        id: "2",
        firstName: "Bob",
        lastName: "Jones",
      });

      const initials1 = getInitials(contact1.firstName, contact1.lastName);
      const initials2 = getInitials(contact2.firstName, contact2.lastName);

      expect(initials1).not.toBe(initials2);
      expect(initials1).toBe("AS");
      expect(initials2).toBe("BJ");
    });
  });

  describe("Validation Integration", () => {
    it("should validate email and normalize phone in contact data", () => {
      const contactData = {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        phone: "(555) 123-4567",
      };

      expect(isValidEmail(contactData.email)).toBe(true);
      const normalizedPhone = normalizePhoneNumber(contactData.phone);
      expect(normalizedPhone).toContain("555");
      expect(normalizedPhone).toMatch(/123.*4567/);
    });

    it("should handle invalid emails gracefully", () => {
      expect(isValidEmail("invalid-email")).toBe(false);
      expect(isValidEmail("")).toBe(true); // Empty is valid (optional field)
      expect(isValidEmail("user@domain.co.uk")).toBe(true);
    });
  });

  describe("Contact Workflow Integration", () => {
    it("should support complete contact lifecycle operations", () => {
      // Create
      const newContact = createMockContact({
        id: "new-1",
        firstName: "New",
        lastName: "Contact",
        email: "new@example.com",
      });

      expect(newContact).toBeDefined();
      expect(isValidEmail(newContact.email || "")).toBe(true);

      // Read (via search)
      const contacts = [
        createMockContact({ id: "1", firstName: "John" }),
        newContact,
      ];
      const results = searchContacts(contacts, "New");
      expect(results).toHaveLength(1);
      expect(results[0].id).toBe("new-1");

      // Update (in memory)
      const updated = { ...newContact, email: "updated@example.com" };
      expect(isValidEmail(updated.email)).toBe(true);

      // Delete (removal from array)
      const remaining = contacts.filter((c) => c.id !== "new-1");
      expect(remaining).toHaveLength(1);
    });

    it("should calculate accurate statistics throughout contact operations", () => {
      let contacts: Contact[] = [];

      // Initially empty
      let stats = calculateContactStats(contacts);
      expect(stats.total).toBe(0);

      // Add first contact
      contacts = [
        createMockContact({
          id: "1",
          firstName: "Alice",
          email: "alice@example.com",
          phone: "111111111",
        }),
      ];
      stats = calculateContactStats(contacts);
      expect(stats.total).toBe(1);
      expect(stats.withEmail).toBe(1);
      expect(stats.withPhone).toBe(1);

      // Add second contact without email
      contacts = [
        ...contacts,
        createMockContact({
          id: "2",
          firstName: "Bob",
          email: "",
          phone: "222222222",
        }),
      ];
      stats = calculateContactStats(contacts);
      expect(stats.total).toBe(2);
      expect(stats.withEmail).toBe(1);
      expect(stats.withPhone).toBe(2);

      // Remove first contact
      contacts = contacts.filter((c) => c.id !== "1");
      stats = calculateContactStats(contacts);
      expect(stats.total).toBe(1);
      expect(stats.withEmail).toBe(0);
      expect(stats.withPhone).toBe(1);
    });
  });

  describe("Search Filtering Edge Cases", () => {
    const contacts = [
      createMockContact({
        id: "1",
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        phone: "123-456-7890",
      }),
      createMockContact({
        id: "2",
        firstName: "Jane",
        lastName: "Doe",
        email: "jane@example.com",
        phone: "098-765-4321",
      }),
      createMockContact({
        id: "3",
        firstName: "Bob",
        lastName: "Smith",
        email: "bob@smith.com",
        phone: "555-1234",
      }),
    ];

    it("should find contacts by partial name", () => {
      const results = searchContacts(contacts, "Doe");
      expect(results).toHaveLength(2);
    });

    it("should find contacts by email domain", () => {
      const results = searchContacts(contacts, "smith.com");
      expect(results).toHaveLength(1);
      expect(results[0].firstName).toBe("Bob");
    });

    it("should find contacts by phone prefix", () => {
      const results = searchContacts(contacts, "555");
      expect(results).toHaveLength(1);
      expect(results[0].firstName).toBe("Bob");
    });

    it("should be case-insensitive across all fields", () => {
      expect(searchContacts(contacts, "JOHN")).toHaveLength(1);
      expect(searchContacts(contacts, "jane@EXAMPLE.com")).toHaveLength(1);
      expect(searchContacts(contacts, "BOB")).toHaveLength(1);
    });

    it("should handle special characters in search", () => {
      const results = searchContacts(contacts, "123-456");
      expect(results).toHaveLength(1);
    });
  });

  describe("Data Consistency", () => {
    it("should maintain data consistency when combining operations", () => {
      const contacts: Contact[] = [];

      // Create multiple contacts
      for (let i = 0; i < 5; i++) {
        contacts.push(
          createMockContact({
            id: `contact-${i}`,
            firstName: `Person${i}`,
            email: i % 2 === 0 ? `person${i}@example.com` : "",
            phone: i % 2 === 0 ? `${111111111 + i}` : "",
          })
        );
      }

      // Get stats
      const stats = calculateContactStats(contacts);
      expect(stats.total).toBe(5);
      expect(stats.withEmail).toBe(3); // 0, 2, 4
      expect(stats.withPhone).toBe(3); // 0, 2, 4

      // Search and verify stats of results
      const searchResults = searchContacts(contacts, "Person");
      const searchStats = calculateContactStats(searchResults);
      expect(searchStats.total).toBe(5); // All match "Person"

      // Search more specifically
      const specific = searchContacts(contacts, "Person2");
      expect(specific).toHaveLength(1);
      expect(isValidEmail(specific[0].email || "")).toBe(true);
    });
  });
});
