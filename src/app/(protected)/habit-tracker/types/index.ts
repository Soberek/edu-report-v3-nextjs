import { z } from "zod";

// Zod schemas
export const habitSchema = z.object({
  water: z.coerce.number().min(0).max(10),
  sleep: z.coerce.number().min(0).max(24),
  steps: z.coerce.number().min(0).max(50000),
  exercise: z.coerce.number().min(0).max(300),
  meditation: z.coerce.number().min(0).max(120),
  healthyMeals: z.coerce.number().min(0).max(5),
  mood: z.enum(["excellent", "good", "neutral", "bad", "terrible"]),
  notes: z.string().optional(),
});

export const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

// Types
export type Habit = {
  id: string;
  date: string;
  userId: string;
  water: number;
  sleep: number;
  steps: number;
  exercise: number;
  meditation: number;
  healthyMeals: number;
  mood: "excellent" | "good" | "neutral" | "bad" | "terrible";
  notes?: string;
};

export type Goals = {
  water: number;
  sleep: number;
  steps: number;
  exercise: number;
  meditation: number;
  healthyMeals: number;
};

export type User = {
  email: string;
  uid: string;
};

export type State = {
  user: User | null;
  habits: Habit[];
  todayHabits: Habit | null;
  goals: Goals;
  loading?: boolean;
  error?: string;
  view: "dashboard" | "track" | "history" | "goals";
  dateFilter: string;
};

// Action types
export type Action =
  | { type: "SET_USER"; payload: User }
  | { type: "SET_HABITS"; payload: Habit[] }
  | { type: "ADD_HABIT"; payload: Habit }
  | { type: "UPDATE_HABIT"; payload: Habit }
  | { type: "SET_TODAY_HABITS"; payload: Habit | null }
  | { type: "UPDATE_GOALS"; payload: Goals }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string }
  | { type: "SET_VIEW"; payload: State["view"] }
  | { type: "SET_DATE_FILTER"; payload: string }
  | { type: "LOGOUT" };

export const initialState: State = {
  user: null,
  habits: [],
  todayHabits: null,
  goals: {
    water: 8,
    sleep: 8,
    steps: 10000,
    exercise: 30,
    meditation: 10,
    healthyMeals: 3,
  },
  loading: false,
  error: undefined,
  view: "dashboard",
  dateFilter: new Date().toISOString().split("T")[0],
};
