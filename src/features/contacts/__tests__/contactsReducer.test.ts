/**
 * Tests for contacts reducer
 * Tests all state transitions through reducer actions
 */

import { describe, it, expect } from "vitest";
import { contactsReducer, initialState } from "../reducers/contactsReducer";
import type { Contact } from "../types";

// Mock contact factory
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

describe("Contacts Reducer", () => {
  describe("initial state", () => {
    it("should have empty data, loading true, and no error", () => {
      expect(initialState).toEqual({
        data: [],
        loading: true,
        error: null,
      });
    });
  });

  describe("SET_LOADING action", () => {
    it("should set loading state", () => {
      const newState = contactsReducer(initialState, {
        type: "SET_LOADING",
        payload: false,
      });
      expect(newState.loading).toBe(false);
    });

    it("should preserve other state", () => {
      const currentState = {
        data: [mockContact()],
        loading: false,
        error: "some error",
      };
      const newState = contactsReducer(currentState, {
        type: "SET_LOADING",
        payload: true,
      });
      expect(newState.data).toEqual(currentState.data);
      expect(newState.error).toBe("some error");
      expect(newState.loading).toBe(true);
    });
  });

  describe("SET_DATA action", () => {
    it("should set data and clear error and loading", () => {
      const contacts = [mockContact({ id: "1" }), mockContact({ id: "2" })];
      const newState = contactsReducer(initialState, {
        type: "SET_DATA",
        payload: contacts,
      });
      expect(newState.data).toEqual(contacts);
      expect(newState.loading).toBe(false);
      expect(newState.error).toBeNull();
    });
  });

  describe("SET_ERROR action", () => {
    it("should set error and clear loading", () => {
      const errorMsg = "Something went wrong";
      const newState = contactsReducer(initialState, {
        type: "SET_ERROR",
        payload: errorMsg,
      });
      expect(newState.error).toBe(errorMsg);
      expect(newState.loading).toBe(false);
    });
  });

  describe("ADD_CONTACT action", () => {
    it("should add contact to beginning of data array", () => {
      const existingContact = mockContact({ id: "1" });
      const currentState = { data: [existingContact], loading: false, error: null };
      const newContact = mockContact({ id: "2", firstName: "Jane" });

      const newState = contactsReducer(currentState, {
        type: "ADD_CONTACT",
        payload: newContact,
      });

      expect(newState.data).toHaveLength(2);
      expect(newState.data[0]).toEqual(newContact);
      expect(newState.data[1]).toEqual(existingContact);
    });

    it("should work on empty data array", () => {
      const contact = mockContact();
      const newState = contactsReducer(initialState, {
        type: "ADD_CONTACT",
        payload: contact,
      });
      expect(newState.data).toEqual([contact]);
    });
  });

  describe("UPDATE_CONTACT action", () => {
    it("should update contact by id", () => {
      const contact1 = mockContact({ id: "1", firstName: "John" });
      const contact2 = mockContact({ id: "2", firstName: "Jane" });
      const currentState = { data: [contact1, contact2], loading: false, error: null };

      const updatedContact = mockContact({ id: "1", firstName: "Jonathan" });
      const newState = contactsReducer(currentState, {
        type: "UPDATE_CONTACT",
        payload: updatedContact,
      });

      expect(newState.data[0].firstName).toBe("Jonathan");
      expect(newState.data[1]).toEqual(contact2);
      expect(newState.data).toHaveLength(2);
    });

    it("should not affect non-matching contacts", () => {
      const contact = mockContact({ id: "1" });
      const currentState = { data: [contact], loading: false, error: null };

      const newState = contactsReducer(currentState, {
        type: "UPDATE_CONTACT",
        payload: mockContact({ id: "999", firstName: "NonExistent" }),
      });

      expect(newState.data).toHaveLength(1);
      expect(newState.data[0]).toEqual(contact);
    });
  });

  describe("DELETE_CONTACT action", () => {
    it("should remove contact by id", () => {
      const contact1 = mockContact({ id: "1" });
      const contact2 = mockContact({ id: "2" });
      const contact3 = mockContact({ id: "3" });
      const currentState = { data: [contact1, contact2, contact3], loading: false, error: null };

      const newState = contactsReducer(currentState, {
        type: "DELETE_CONTACT",
        payload: "2",
      });

      expect(newState.data).toHaveLength(2);
      expect(newState.data.map((c) => c.id)).toEqual(["1", "3"]);
    });

    it("should handle deleting non-existent id", () => {
      const contact = mockContact({ id: "1" });
      const currentState = { data: [contact], loading: false, error: null };

      const newState = contactsReducer(currentState, {
        type: "DELETE_CONTACT",
        payload: "999",
      });

      expect(newState.data).toEqual([contact]);
    });
  });

  describe("CLEAR_ERROR action", () => {
    it("should clear error message", () => {
      const currentState = { data: [], loading: false, error: "Error message" };
      const newState = contactsReducer(currentState, {
        type: "CLEAR_ERROR",
      });

      expect(newState.error).toBeNull();
      expect(newState.data).toEqual([]);
      expect(newState.loading).toBe(false);
    });
  });

  describe("unknown action", () => {
    it("should return current state for unknown action", () => {
      const currentState = { data: [mockContact()], loading: false, error: null };
      const newState = contactsReducer(currentState, {
        type: "UNKNOWN" as any,
      });

      expect(newState).toEqual(currentState);
    });
  });
});
