import { describe, it, expect } from "vitest";
import { ActCreateDTO, ActUpdateDTO } from "../actSchemas";

describe("actSchemas", () => {
  describe("ActCreateDTO", () => {
    it("validates a valid act", () => {
      const validData = {
        code: "966.1",
        referenceNumber: "2024/001",
        date: "2024-01-15",
        title: "Sample Case",
        startDate: "2024-01-15",
        endDate: "2024-12-31",
        sender: "Urząd",
      };

      const result = ActCreateDTO.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("rejects missing required fields", () => {
      const invalidData = {
        code: "",
        referenceNumber: "2024/001",
        date: "2024-01-15",
        title: "Sample Case",
        startDate: "2024-01-15",
        endDate: "2024-12-31",
        sender: "Urząd",
      };

      const result = ActCreateDTO.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("allows optional fields", () => {
      const dataWithOptional = {
        code: "966.1",
        referenceNumber: "2024/001",
        date: "2024-01-15",
        title: "Sample Case",
        startDate: "2024-01-15",
        endDate: "2024-12-31",
        sender: "Urząd",
        comments: "Important case",
        notes: "Special handling required",
      };

      const result = ActCreateDTO.safeParse(dataWithOptional);
      expect(result.success).toBe(true);
    });

    it("defaults optional fields to empty strings", () => {
      const minimalData = {
        code: "966.1",
        referenceNumber: "2024/001",
        date: "2024-01-15",
        title: "Sample Case",
        startDate: "2024-01-15",
        endDate: "2024-12-31",
        sender: "Urząd",
      };

      const result = ActCreateDTO.safeParse(minimalData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.comments).toBe("");
        expect(result.data.notes).toBe("");
      }
    });
  });

  describe("ActUpdateDTO", () => {
    it("validates a valid act update with all fields", () => {
      const validData = {
        id: "123",
        code: "966.1",
        referenceNumber: "2024/001",
        date: "2024-01-15",
        title: "Updated Case",
        startDate: "2024-01-15",
        endDate: "2024-12-31",
        sender: "Urząd",
        comments: "Updated comments",
        notes: "Updated notes",
        createdAt: "2024-01-15T10:00:00Z",
        userId: "user123",
      };

      const result = ActUpdateDTO.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("requires id field", () => {
      const dataWithoutId = {
        code: "966.1",
        referenceNumber: "2024/001",
        date: "2024-01-15",
        title: "Sample Case",
        startDate: "2024-01-15",
        endDate: "2024-12-31",
        sender: "Urząd",
        createdAt: "2024-01-15T10:00:00Z",
        userId: "user123",
      };

      const result = ActUpdateDTO.safeParse(dataWithoutId);
      expect(result.success).toBe(false);
    });

    it("requires createdAt field", () => {
      const dataWithoutCreatedAt = {
        id: "123",
        code: "966.1",
        referenceNumber: "2024/001",
        date: "2024-01-15",
        title: "Sample Case",
        startDate: "2024-01-15",
        endDate: "2024-12-31",
        sender: "Urząd",
        userId: "user123",
      };

      const result = ActUpdateDTO.safeParse(dataWithoutCreatedAt);
      expect(result.success).toBe(false);
    });

    it("requires userId field", () => {
      const dataWithoutUserId = {
        id: "123",
        code: "966.1",
        referenceNumber: "2024/001",
        date: "2024-01-15",
        title: "Sample Case",
        startDate: "2024-01-15",
        endDate: "2024-12-31",
        sender: "Urząd",
        createdAt: "2024-01-15T10:00:00Z",
      };

      const result = ActUpdateDTO.safeParse(dataWithoutUserId);
      expect(result.success).toBe(false);
    });
  });
});
