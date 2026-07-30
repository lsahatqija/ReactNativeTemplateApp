# Architecture

This document records the boundaries that keep this template maintainable as it grows
into real applications. They are deliberately simple — prefer composition over
elaborate abstractions.

## Route files coordinate screens; they do not contain business logic

Files under `app/` (Expo Router) should read like a table of contents: they wire up a
screen from feature hooks/components and handle navigation, nothing else. Validation,
data fetching, and mutation logic belong in `src/features/*`.

## Feature modules own feature-specific behavior

Each feature under `src/features/<name>/` owns its own `api/`, `components/`, `hooks/`,
`schemas/`, and `types.ts`. Features should be removable as a unit (see README's
"Removing the example feature") without leaving orphaned code elsewhere.

## Components do not call `fetch` or storage libraries directly

- All HTTP calls go through `src/api/client.ts` (or feature-specific functions built on
  top of it, e.g. `src/features/example/api/notesApi.ts`).
- All AsyncStorage access goes through `src/storage/preferences.ts`.
- All SecureStore access goes through `src/storage/secure.ts`.

This keeps every infrastructure choice swappable without touching UI code.

## Remote state belongs in TanStack Query

Anything that comes from (or is persisted to) a server is a query or mutation, not
component state or a global store. Component state is for local UI concerns (form
input, toggles, animations). React context (`AuthProvider`, `ThemeProvider`) is
reserved for low-frequency, truly global concerns.

## Sensitive and non-sensitive storage are separated

Tokens and credentials go through `secureStorage` (Keychain/Keystore-backed). Everything
else non-sensitive and JSON-serializable goes through `preferences` (AsyncStorage-backed).
Never mix the two.

## Infrastructure implementations remain replaceable

- Authentication (`AuthProvider`) is a provider-agnostic seam with a clearly marked mock
  implementation — no vendor SDK is assumed.
- The example feature's API (`notesApi.ts`) is a mock/dev adapter implementing an
  interface a real backend-backed implementation would also satisfy.
- Error reporting (`src/utils/errorReporting.ts`) only logs in development; production
  reporting (Sentry, etc.) plugs in at a single point.

## New dependencies should solve an existing requirement, not a hypothetical one

Before adding a package, confirm a concrete, current need exists. See the README's
"Deliberate exclusions" and the per-topic guidance on when Zustand or SQLite would
become appropriate.
