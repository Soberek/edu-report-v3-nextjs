import { z } from "zod";
import { VALIDATION_MESSAGES } from "@/constants";

/** Schema for creating a new act (case record) */
export const ActCreateDTO = z.object({
  code: z.string().min(1, VALIDATION_MESSAGES.act.code),
  referenceNumber: z.string().min(1, VALIDATION_MESSAGES.act.referenceNumber),
  date: z.string().min(1, VALIDATION_MESSAGES.act.date),
  title: z.string().min(1, VALIDATION_MESSAGES.act.title),
  startDate: z.string().min(1, VALIDATION_MESSAGES.act.startDate),
  endDate: z.string().min(1, VALIDATION_MESSAGES.act.endDate),
  sender: z.string().min(1, VALIDATION_MESSAGES.act.sender),
  comments: z.string().optional().default(""),
  notes: z.string().optional().default(""),
});

/** Schema for updating an existing act */
export const ActUpdateDTO = z.object({
  id: z.string(),
  code: z.string().min(1, VALIDATION_MESSAGES.act.code),
  referenceNumber: z.string().min(1, VALIDATION_MESSAGES.act.referenceNumber),
  date: z.string().min(1, VALIDATION_MESSAGES.act.date),
  title: z.string().min(1, VALIDATION_MESSAGES.act.title),
  startDate: z.string().min(1, VALIDATION_MESSAGES.act.startDate),
  endDate: z.string().min(1, VALIDATION_MESSAGES.act.endDate),
  sender: z.string().min(1, VALIDATION_MESSAGES.act.sender),
  comments: z.string().optional().default(""),
  notes: z.string().optional().default(""),
  createdAt: z.string(),
  userId: z.string(),
});

/** Inferred types for type safety */
export type ActCreate = z.infer<typeof ActCreateDTO>;
export type ActUpdate = z.infer<typeof ActUpdateDTO>;

