import { Program } from "../types";
import { programs as PROGRAMS } from "@/constants/programs";

export const generateProgramId = (): string => {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
};

export const validateProgramCode = (code: string, programs: Program[], excludeId?: string): boolean => {
  return !programs.some((program) => program.code === code && program.id !== excludeId);
};

export const getProgramTypeLabel = (type: "programowy" | "nieprogramowy"): string => {
  return type === "programowy" ? "Programowy" : "Nieprogramowy";
};

export const getProgramTypeColor = (type: "programowy" | "nieprogramowy"): "primary" | "secondary" => {
  return type === "programowy" ? "primary" : "secondary";
};

export const loadInitialPrograms = (): Program[] => {
  return PROGRAMS;
};

export const searchPrograms = (programs: Program[], searchTerm: string): Program[] => {
  if (!searchTerm.trim()) return programs;

  const term = searchTerm.toLowerCase();
  return programs.filter(
    (program) =>
      program.name.toLowerCase().includes(term) ||
      program.code.toLowerCase().includes(term) ||
      program.description.toLowerCase().includes(term) ||
      program.programType.toLowerCase().includes(term)
  );
};

export const sortPrograms = (programs: Program[], sortBy: keyof Program, order: "asc" | "desc" = "asc"): Program[] => {
  return [...programs].sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];

    if (aValue < bValue) return order === "asc" ? -1 : 1;
    if (aValue > bValue) return order === "asc" ? 1 : -1;
    return 0;
  });
};
