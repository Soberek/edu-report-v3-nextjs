// Shared types for the szkoly-w-programie module

export interface SelectOption {
  readonly id: string;
  readonly name: string;
  readonly code?: string;
  readonly firstName?: string;
  readonly lastName?: string;
  [key: string]: unknown;
}
