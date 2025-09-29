import { describe, it, expect } from "vitest";
import { createEducationalTaskSchema, editEducationalTaskSchema } from "../educationalTaskSchemas";

describe("educationalTaskSchemas", () => {
  const validTaskData = {
    title: "Test Task",
    programName: "Test Program",
    date: "2025-01-15",
    schoolId: "school-1",
    taskNumber: "1/2025",
    referenceNumber: "TEST.001.2025",
    activities: [
      {
        type: "presentation",
        title: "Test Activity",
        actionCount: 1,
        description: "Test description",
        audienceGroups: [
          {
            id: "group-1",
            name: "Grupa I",
            type: "dorośli" as const,
            count: 30,
          },
        ],
      },
    ],
  };

  describe("createEducationalTaskSchema", () => {
    it("should validate correct task data", () => {
      const result = createEducationalTaskSchema.safeParse(validTaskData);
      expect(result.success).toBe(true);
    });

    it("should require title", () => {
      const data = { ...validTaskData, title: "" };
      const result = createEducationalTaskSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("Tytuł zadania jest wymagany");
      }
    });

    it("should require programName", () => {
      const data = { ...validTaskData, programName: "" };
      const result = createEducationalTaskSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("Nazwa programu jest wymagana");
      }
    });

    it("should require date", () => {
      const data = { ...validTaskData, date: "" };
      const result = createEducationalTaskSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("Data jest wymagana");
      }
    });

    it("should require schoolId", () => {
      const data = { ...validTaskData, schoolId: "" };
      const result = createEducationalTaskSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("Wybór szkoły jest wymagany");
      }
    });

    it("should validate taskNumber format", () => {
      const data = { ...validTaskData, taskNumber: "invalid" };
      const result = createEducationalTaskSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("Numer zadania musi mieć format: liczba/rok");
      }
    });

    it("should accept valid taskNumber format", () => {
      const data = { ...validTaskData, taskNumber: "45/2025" };
      const result = createEducationalTaskSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should require referenceNumber", () => {
      const data = { ...validTaskData, referenceNumber: "" };
      const result = createEducationalTaskSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("Numer referencyjny jest wymagany");
      }
    });

    it("should require at least one activity", () => {
      const data = { ...validTaskData, activities: [] };
      const result = createEducationalTaskSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("Dodaj co najmniej jedną aktywność");
      }
    });

    it("should validate activity type", () => {
      const data = {
        ...validTaskData,
        activities: [
          {
            ...validTaskData.activities[0],
            type: "invalid-type",
          },
        ],
      };
      const result = createEducationalTaskSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("should validate activity title", () => {
      const data = {
        ...validTaskData,
        activities: [
          {
            ...validTaskData.activities[0],
            title: "",
          },
        ],
      };
      const result = createEducationalTaskSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("Tytuł aktywności jest wymagany");
      }
    });

    it("should validate activity description", () => {
      const data = {
        ...validTaskData,
        activities: [
          {
            ...validTaskData.activities[0],
            description: "",
          },
        ],
      };
      const result = createEducationalTaskSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("Opis jest wymagany");
      }
    });

    it("should validate actionCount as number", () => {
      const data = {
        ...validTaskData,
        activities: [
          {
            ...validTaskData.activities[0],
            actionCount: "invalid",
          },
        ],
      };
      const result = createEducationalTaskSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("should coerce string numbers to numbers", () => {
      const data = {
        ...validTaskData,
        activities: [
          {
            ...validTaskData.activities[0],
            actionCount: "5",
          },
        ],
      };
      const result = createEducationalTaskSchema.safeParse(data);
      expect(result.success).toBe(true);
      if (result.success) {
        const activity = result.data.activities[0];
        if (activity.type === "presentation" || activity.type === "lecture") {
          expect(activity.actionCount).toBe(5);
        }
      }
    });

    it("should validate audienceGroups", () => {
      const data = {
        ...validTaskData,
        activities: [
          {
            ...validTaskData.activities[0],
            audienceGroups: [
              {
                id: "",
                name: "Grupa I",
                type: "dorośli" as const,
                count: 30,
              },
            ],
          },
        ],
      };
      const result = createEducationalTaskSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("ID grupy jest wymagane");
      }
    });

    it("should validate audienceGroup type", () => {
      const data = {
        ...validTaskData,
        activities: [
          {
            ...validTaskData.activities[0],
            audienceGroups: [
              {
                id: "group-1",
                name: "Grupa I",
                type: "invalid-type" as any,
                count: 30,
              },
            ],
          },
        ],
      };
      const result = createEducationalTaskSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("Wybierz prawidłowy typ odbiorcy");
      }
    });

    it("should validate audienceGroup count", () => {
      const data = {
        ...validTaskData,
        activities: [
          {
            ...validTaskData.activities[0],
            audienceGroups: [
              {
                id: "group-1",
                name: "Grupa I",
                type: "dorośli" as const,
                count: 0,
              },
            ],
          },
        ],
      };
      const result = createEducationalTaskSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("Liczba osób musi być większa od 0");
      }
    });

    it("should require media for publikacja media type", () => {
      const data = {
        ...validTaskData,
        activities: [
          {
            ...validTaskData.activities[0],
            type: "media_publication",
            media: undefined,
          },
        ],
      };
      const result = createEducationalTaskSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("expected object, received undefined");
      }
    });

    it("should validate media fields", () => {
      const data = {
        ...validTaskData,
        activities: [
          {
            ...validTaskData.activities[0],
            type: "media_publication",
            media: {
              title: "",
              link: "invalid-url",
              platform: "facebook",
            },
          },
        ],
      };
      const result = createEducationalTaskSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("should require materials for dystrybucja type", () => {
      const data = {
        ...validTaskData,
        activities: [
          {
            ...validTaskData.activities[0],
            type: "distribution",
            materials: undefined,
          },
        ],
      };
      const result = createEducationalTaskSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("expected array, received undefined");
      }
    });

    it("should validate material fields", () => {
      const data = {
        ...validTaskData,
        activities: [
          {
            ...validTaskData.activities[0],
            type: "distribution",
            materials: [
              {
                id: "",
                name: "Test Material",
                type: "ulotka",
                distributedCount: "invalid",
              },
            ],
          },
        ],
      };
      const result = createEducationalTaskSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe("editEducationalTaskSchema", () => {
    it("should validate correct edit data with id", () => {
      const data = { ...validTaskData, id: "task-1" };
      const result = editEducationalTaskSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should require id for edit", () => {
      const result = editEducationalTaskSchema.safeParse(validTaskData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("expected string, received undefined");
      }
    });

    it("should validate empty id", () => {
      const data = { ...validTaskData, id: "" };
      const result = editEducationalTaskSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("ID jest wymagane");
      }
    });
  });
});
