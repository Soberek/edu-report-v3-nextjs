import type { CaseRecord } from "@/types";
import { ActCreateDTO, ActUpdateDTO, type ActCreate, type ActUpdate } from "@/features/spisy-spraw/schemas/actSchemas";

/**
 * Act Service
 * 
 * Business logic layer for case records operations.
 * Handles validation and interaction with Firebase data layer.
 */

export interface ActServiceDependencies {
  userId: string | undefined;
  createItem: (data: Omit<CaseRecord, "id" | "createdAt" | "userId" | "updatedAt">) => Promise<CaseRecord | null>;
  updateItem: (id: string, updates: Partial<CaseRecord>) => Promise<boolean>;
  deleteItem: (id: string) => Promise<boolean>;
  refetch: () => Promise<void>;
}

export class ActService {
  constructor(private deps: ActServiceDependencies) {}

  /**
   * Creates a new act record with validation
   */
  async create(data: Omit<ActCreate, "userId">): Promise<CaseRecord | null> {
    if (!this.deps.userId) {
      throw new Error("User not authenticated");
    }

    const parsedData = ActCreateDTO.parse(data);
    const result = await this.deps.createItem(parsedData);
    await this.deps.refetch();
    return result;
  }

  /**
   * Updates an existing act record with validation
   */
  async update(data: ActUpdate): Promise<boolean> {
    if (!this.deps.userId) {
      throw new Error("User not authenticated");
    }

    const parsedData = ActUpdateDTO.parse(data);
    const result = await this.deps.updateItem(parsedData.id, parsedData);
    await this.deps.refetch();
    return result;
  }

  /**
   * Deletes an act record
   */
  async delete(id: string): Promise<boolean> {
    if (!this.deps.userId) {
      throw new Error("User not authenticated");
    }

    const result = await this.deps.deleteItem(id);
    await this.deps.refetch();
    return result;
  }
}
