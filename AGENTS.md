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
