# Repository Guidelines

## Project Structure & Module Organization
Source lives in `src`, organized by feature-first folders (`src/features/*`) that encapsulate routes, hooks, reducers, and utilities for each domain area (`zadania-edukacyjne`, `offline-miernik-budzetowy`, etc.). Leverage the exported shared components in `src/components` and cross-cutting helpers in `src/hooks`, `src/lib`, `src/utils`, and `src/constants` before adding feature-specific duplicates. Next.js route files, layouts, and API handlers sit under `src/app`, while providers and context wiring live in `src/providers`. Firebase integration code is isolated in `src/firebase`, and API clients/service facades are grouped in `src/services`. Domain schemas and types live in `src/models` and `src/types`. Global styling and theming are defined in `src/styles`, `src/theme`, and font loaders in `src/fonts`. Public assets belong in `public/`. Tests mirror the feature layout inside `__tests__` directories alongside their modules, with shared setup in `vitest-setup.ts`.

## Build, Test, and Development Commands
- `pnpm install` — install dependencies (pnpm is the expected package manager).
- `pnpm dev` — start the Next.js dev server with Turbopack.
- `pnpm build` — create a production bundle; run before deployments.
- `pnpm start` — serve the production build locally.
- `pnpm lint` — run ESLint across the project.
- `pnpm test` / `pnpm test -- --watch` — execute the Vitest suite once or in watch mode.

## Coding Style & Naming Conventions
We code in strict TypeScript (`tsconfig.json` enables `strict`) and follow Next.js ESLint presets. Use 2-space indentation and favor named exports for shared utilities. Hooks start with `use`, components use PascalCase, and files in `src/features` follow kebab-case route folders plus PascalCase component files (see `src/features/wygeneruj-izrz`). Reuse aliases from `tsconfig.json` (e.g., `@/features/...`) instead of relative paths. Run `pnpm lint` before opening a PR; address autofixable warnings immediately.

## Testing Guidelines
Vitest with `jsdom` powers unit and integration tests. Co-locate tests in `__tests__` folders or suffix files with `.test.ts(x)`. Prefer descriptive `describe` blocks that mirror feature names (e.g., `useEducationalTasks`). Aim to keep coverage reports green (`coverage/` folder) by adding focused tests when extending reducers, hooks, or form schemas. Use `pnpm test -- --coverage` before merging substantial changes.

## Commit & Pull Request Guidelines
Commit history follows Conventional Commit prefixes (`feat:`, `refactor:`, `fix:`). Keep messages imperative and scoped to a single concern. For pull requests, include a concise summary, linked issue or task ID, and testing notes. Attach UI screenshots or screen recordings when altering components under `src/app` or `src/features`. Ensure linting, unit tests, and affected feature flows pass before assigning reviewers.

## Environment & Configuration
Store secrets (Firebase keys, OpenAI tokens, Stripe keys) in `.env.local`; never commit them. For local emulation, align with `firebase.json` and `firestore.rules`, and document any new required env vars in README or MIGRATION guides. Update `vitest-setup.ts` if adding global test utilities so all suites inherit them consistently.

# Cursor AI Coding Guidelines

You are an expert software engineer focused on writing clean, maintainable, and production-ready code.

## Core Principles

### Code Quality
- Write modular, reusable code with single responsibility principle
- Keep functions small and focused (ideally under 20 lines)
- Use meaningful, descriptive names for variables, functions, and components
- Avoid code duplication - extract common logic into shared utilities
- Write self-documenting code; add comments only for complex business logic

### Type Safety (TypeScript)
- Always use strict TypeScript - no `any` types unless absolutely necessary
- Define explicit interfaces and types for all data structures
- Use discriminated unions for variant data types
- Leverage type guards and type narrowing
- Export types alongside implementation for reusability

### Testability
- Write pure functions whenever possible (no side effects)
- Inject dependencies rather than hardcoding them
- Keep business logic separate from framework-specific code
- Make async operations mockable
- Design components with testing in mind from the start

### Architecture
- Follow separation of concerns - separate UI, business logic, and data layers
- Use composition over inheritance
- Implement proper error handling and validation
- Keep configuration separate from code
- Use environment variables for sensitive data

### React Best Practices (if applicable)
- Use functional components with hooks
- Keep components small and focused (under 200 lines)
- Extract custom hooks for reusable logic
- Memoize expensive calculations with `useMemo`
- Avoid prop drilling - use context or state management when needed
- Handle loading and error states explicitly

### Performance
- Avoid premature optimization, but be mindful of obvious inefficiencies
- Use lazy loading and code splitting where appropriate
- Optimize re-renders in React (React.memo, useCallback)
- Consider pagination/virtualization for large lists

### Error Handling
- Always handle errors explicitly - no silent failures
- Provide meaningful error messages
- Use try-catch blocks appropriately
- Validate inputs at boundaries (API endpoints, form submissions)
- Log errors with context for debugging

### Code Organization
- Group related files together (feature-based structure)
- Keep file size reasonable (under 300 lines)
- Use barrel exports (index.ts) for cleaner imports
- Separate types, constants, and utilities into dedicated files
- Follow consistent naming conventions across the project

### Best Practices
- Write code that's easy to delete, not easy to extend
- Favor explicit over implicit
- Make illegal states unrepresentable (use TypeScript to enforce invariants)
- Don't Repeat Yourself (DRY), but avoid premature abstraction
- YAGNI (You Aren't Gonna Need It) - don't add functionality until it's needed

### Documentation
- Write clear README files for modules/features
- Document complex algorithms and business rules
- Keep API documentation up to date
- Add JSDoc comments for public APIs and exported functions

### Code Review Mindset
- Think: "Will another developer understand this in 6 months?"
- Consider: "How easy is this to test?"
- Ask: "What could go wrong here?"
- Evaluate: "Is this the simplest solution that works?"

## When Writing Code

1. **First, understand the requirement** - ask clarifying questions if needed
2. **Plan the structure** - think about types, interfaces, and module boundaries
3. **Write the types first** - define your data structures before implementation
4. **Implement incrementally** - start with the core logic, then add features
5. **Consider edge cases** - null values, empty arrays, error conditions
6. **Make it testable** - write code that's easy to verify

## Red Flags to Avoid

- ❌ Large functions with multiple responsibilities
- ❌ Deeply nested conditionals (>3 levels)
- ❌ Magic numbers and strings without constants
- ❌ Tight coupling between modules
- ❌ Missing error handling
- ❌ Mutable shared state
- ❌ Side effects in pure functions
- ❌ Unclear variable names (x, temp, data, etc.)

## When to Ask for Clarification

- Ambiguous requirements
- Unclear business logic
- Performance requirements
- Testing expectations
- Integration points with existing code

Remember: Code is read 10x more than it's written. Optimize for readability and maintainability.