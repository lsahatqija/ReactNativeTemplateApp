# React Native App Template

A lightweight, production-ready Expo + React Native template meant to be the starting
point for new applications. It establishes architecture that is expensive to retrofit
later (navigation, typed API layer, storage separation, auth seam, providers, forms,
testing) while staying free of app-specific features.

## Requirements

- Node.js 20+
- npm 10+
- Expo Go app (for quick device testing) or Android Studio / Xcode for native builds
- [EAS CLI](https://docs.expo.dev/eas/) (`npm i -g eas-cli`) for cloud builds

## Installation

```bash
npm install
cp .env.example .env
```

Fill in `.env` with real values — see [Environment configuration](#environment-configuration).

## Starting the app

```bash
npm start        # Metro bundler, choose a platform interactively
npm run android  # Android emulator/device
npm run ios      # iOS simulator (macOS only)
npm run web      # Web
```

## Environment configuration

Configuration is read from `EXPO_PUBLIC_*` environment variables and validated at
startup by `src/config/env.ts` (Zod schema). Missing/invalid values throw a clear error
in development instead of failing silently later.

| Variable              | Values                                     | Purpose                               |
| --------------------- | ------------------------------------------ | ------------------------------------- |
| `EXPO_PUBLIC_APP_ENV` | `development` \| `staging` \| `production` | Selects environment-specific behavior |
| `EXPO_PUBLIC_API_URL` | URL                                        | Base URL for the API client           |

**`EXPO_PUBLIC_*` variables are bundled into the JavaScript bundle and are public.**
Never put API keys, tokens, or other secrets in them or in any `.env` file that gets
committed. `.env` is git-ignored; only `.env.example` (with placeholder values) is
committed.

## Running tests and validation

```bash
npm run typecheck     # tsc --noEmit
npm run lint          # ESLint
npm run format:check  # Prettier check
npm test              # Jest + React Native Testing Library
npm run validate      # all of the above, in order
```

## Directory structure

```
app/                   Expo Router routes — thin, no business logic
  _layout.tsx           Root layout: providers + root stack
  index.tsx             Redirects to (auth) or (main) based on session state
  (auth)/               Unauthenticated routes (sign-in)
  (main)/               Authenticated routes (tabs: home, notes, settings)
  modal.tsx              Modal route (example feature's create/edit form)

src/
  api/                  Typed fetch client + normalized ApiError
  components/ui/        Small reusable primitives (AppText, Button, TextField, ...)
  config/                Typed, validated environment config
  features/example/      Removable example vertical slice (notes)
  hooks/                  Cross-cutting hooks (network status, ...)
  providers/              AppProviders composition, AuthProvider, ThemeProvider
  storage/                AsyncStorage/SecureStore abstractions
  theme/                  Color/spacing/typography tokens
  types/                  Shared cross-feature types
  utils/                  Error reporting seam, misc helpers

assets/                 Icons, splash images
tests/                  Jest + React Native Testing Library tests
```

## Architectural rules

See [ARCHITECTURE.md](./ARCHITECTURE.md) for the full list. In short: route files stay
thin, features own their own logic, components never call `fetch`/storage libraries
directly, remote state lives in TanStack Query, sensitive/non-sensitive storage stay
separated, and every infrastructure piece is meant to be replaceable.

## Removing the example feature

The "notes" feature under `src/features/example/` and its routes
(`app/(main)/example/`, `app/modal.tsx`) are a complete but disposable example. To remove it:

1. Delete `src/features/example/`.
2. Delete `app/(main)/example/` and `app/modal.tsx`.
3. Remove the `example`/notes tab entry from `app/(main)/_layout.tsx` and the `modal`
   screen entry from `app/_layout.tsx`.
4. Delete `tests/features/example/`.

## Changing branding and theme tokens

Edit `src/theme/colors.ts`, `spacing.ts`, and `typography.ts`. All UI primitives in
`src/components/ui/` read from `useTheme()` (`src/providers/ThemeProvider.tsx`), so
updating tokens re-themes the whole app. Update `app.json`'s `icon`/`splash`/
`adaptiveIcon` fields and files under `assets/` to rebrand app icons.

## Connecting a real backend

Edit `src/api/client.ts`'s base URL handling (already reads `EXPO_PUBLIC_API_URL`) and
implement real feature API modules following the pattern in
`src/features/example/api/notesApi.ts` — replace the mock adapter's functions with
calls to `apiClient.request(...)`, keeping the same interface so hooks/screens don't change.

## Replacing mock authentication

`src/providers/AuthProvider.tsx` contains a clearly marked mock implementation. Replace
the bodies of `signIn`/`signOut` with real calls to your auth backend/vendor (Firebase,
Auth0, Supabase, a custom API, etc.), keeping the same `useAuth()` contract
(`status`, `user`, `signIn`, `signOut`) so routes and screens don't need to change.
Token storage already goes through `src/storage/secure.ts`.

## Introducing SQLite

This template intentionally has no local database. If a future app needs structured
relational data, complex offline queries, or large local datasets that don't fit in
small JSON blobs, add `expo-sqlite` and build a storage module analogous to
`src/storage/preferences.ts` (a single sanctioned import point) rather than importing
it ad hoc across features.

## Adding a global client-state library

Component state + TanStack Query + the `Auth`/`Theme` React contexts cover most needs.
If a real application develops meaningful cross-screen client state that doesn't belong
in TanStack Query (e.g. a complex multi-step wizard spanning screens), consider adding
Zustand at that point — don't add it speculatively.

## EAS build profiles

`eas.json` defines three profiles:

- `development` — internal distribution, dev client, `EXPO_PUBLIC_APP_ENV=development`
- `preview` — internal distribution/staging, `EXPO_PUBLIC_APP_ENV=staging`
- `production` — store-ready build, `EXPO_PUBLIC_APP_ENV=production`

```bash
eas build --profile development --platform android
eas build --profile preview --platform all
eas build --profile production --platform all
```

Automated store submission is intentionally not configured — `eas submit` is left as a
manual, deliberate step.

## Upgrading the Expo SDK

1. Read the [Expo SDK upgrade guide](https://docs.expo.dev/workflow/upgrading-expo-sdk-walkthrough/) for the target version.
2. Run `npx expo install expo@latest` then `npx expo install --fix`.
3. Run `npx expo-doctor` to catch incompatible dependencies.
4. Re-run `npm run validate` and smoke-test on all platforms before merging.

## Deliberate exclusions

No Redux, SQLite, UI component framework, analytics, push notifications, maps, camera
access, WebSockets, or auth vendor SDKs are included. These are common enough needs in
individual apps that they should be added deliberately when a concrete requirement
exists, not carried by the template speculatively.
