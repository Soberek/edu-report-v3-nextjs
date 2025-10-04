import type { User as FirebaseUser } from "firebase/auth";

// User roles enum
export enum UserRole {
  ADMIN = "admin",
  USER = "user",
}

// Extended user type with role
export interface UserData {
  uid: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
  displayName?: string;
  city?: string;
  postalCode?: string;
  countryCode?: string; // ISO 3166, e.g. 'PL'
}

// User context type
export interface UserContextType {
  user: FirebaseUser | null;
  userData: UserData | null;
  loading: boolean;
  isAdmin: boolean;
  hasRole: (role: UserRole) => boolean;
}
