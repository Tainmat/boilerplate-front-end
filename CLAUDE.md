# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server on port 15975
- `npm run build` - Build for production (TypeScript check + Vite build)
- `npm run build:dev` - Build for development environment
- `npm run build:test` - Build for test environment
- `npm run build:production` - Build for production environment
- `npm run lint` - Run ESLint with TypeScript rules
- `npm run lint:fix` - Run ESLint and auto-fix issues
- `npm run lint:format` - Format code with Prettier

## Architecture Overview

This is a React 19 + TypeScript + Vite PWA called "UsinCheck" — an industrial inspection management system with full offline support.

### Module Structure
Feature-based modular architecture under `src/modules/`:

- **Auth** - Login, FirstLogin, RecoverPassword
- **Admin** - Customers, CustomerContacts, Users, Equipments, Inspections
- **Dashboard** - Charts and totalizing cards
- **Home** - Home page
- **Errors** - NotFound

### Page Component Pattern
Every list/form page follows the same two-file pattern:
- `PageName.tsx` — Pure render component. Destructures everything from the Rules hook.
- `usePageNameRules.ts` — All business logic: state, API calls, navigation, event handlers. Returns a flat object consumed by the component.

Example: `ListInspections.tsx` + `useInspectionsRules.ts`

### Form Pattern
Forms each have a `.form.ts` file co-located with the form component containing:
- TypeScript interface for form values (e.g., `IInspectionRegisterForm`)
- `initialValues` object
- Yup `validationSchema`

Forms use Formik + Yup. No React Query — API calls are done manually inside custom hooks.

### API Layer (`src/shared/services/api/api.service.ts`)
Exports named functions: `get`, `post`, `put`, `getBlob`, `login`. Each function manually injects the `Authorization` token via `getAuthorizationToken()`.

The axios interceptor handles:
- `401` → clears localStorage, redirects to `/login?redirect=...`
- `403` → redirects to home
- Auth routes are excluded from redirect behavior

Note: `get` returns the full `AxiosResponse` (`response`), while `post`/`put` return `response.data`. Keep this asymmetry in mind.

### Service Hooks (`src/shared/hooks/services/`)
API calls are wrapped in custom hooks (not React Query):
- `use[Entity]s.ts` — list fetching with `params`/`setParams`/`refetch` pattern
- `use[Entity].ts` — single entity fetch
- `Admin/Dropdown/` — dropdown data loaders

Search params are base64-encoded into `?q=<btoa(JSON)>` URL params for shareability.

### State Management (Redux Toolkit)
Two slices in `src/shared/store/modules/`:
- `dropdownsData` — cached dropdown options, **encrypted and persisted** to `localStorage`
- `offlineInspectionsData` — offline inspection cards and current inspection

Redux state (only `dropdownsData`) is persisted encrypted to `localStorage` via a custom `encryptionMiddleware` using `VITE_KEY_CRIPTOGRAFIA`. On startup, `preloadedState()` decrypts and rehydrates the store.

Access dropdowns via `useDropdownsRedux()` hook.

### Offline-First Architecture
The app supports creating inspections while offline:

1. **IndexedDB** (`src/shared/services/indexedDB/inspectionsDB.ts`): Stores full `IOfflineInspection` records using the `idb` library. DB name is environment-scoped: `usincheck-db-${VITE_AMBIENTE}`.
2. **`useOfflineInspections` hook**: CRUD interface over IndexedDB, synced to Redux state (`offlineInspectionsData`).
3. **`OnlineStatusContext`**: Monitors `window.online`/`offline` events. When connection is restored and stable for 15 seconds, automatically calls `syncAll()` to POST pending inspections to the API.
4. **Inspection list** shows two tabs: Online (API data) and Offline (IndexedDB data). Tab switches based on `isOnline`.

### Role-Based Access (`src/shared/hooks/services/Rules/Auth/useRoles.ts`)
Roles are env-var-configured strings: `SA` (SystemAdmin), `ADM` (Administrator), `INS` (Inspector), `CLI` (Customer). Checked via `useAuthRoles()` hook which reads from `AuthContext`.

### Contexts (`src/shared/contexts/`)
All contexts are composed in `Context.tsx` as a single `<Contexts>` provider. Key contexts:
- `AuthContext` — current user and token
- `OnlineStatusContext` — online status and sync operations
- `ToastContext` — toast notifications
- `AlertContext` — confirmation modal dialogs
- `LoaderContext` — global loader overlay
- `BreadcrumbContext` — page breadcrumb

### Path Aliases
- `@/*` → `src/*`
- `@modules/*` → `src/modules/*`
- `@shared/*` → `src/shared/*`
- `@styles/*` → `src/styles/*`
- `@assets/*` → `src/assets/*`

### Required Environment Variables
```
VITE_API_URL=           # Backend base URL (e.g. http://localhost:3333/api/)
VITE_AMBIENTE=          # DEVELOP | TEST | PRODUCTION (used for IndexedDB naming)
VITE_APP_CRYPTO_KEY=    # AES encryption key for sensitive data
VITE_KEY_CRIPTOGRAFIA=  # localStorage key for encrypted Redux state
VITE_APP_ROLE_SYSTEM_ADMIN=SA
VITE_APP_ROLE_ADMINISTRATOR=ADM
VITE_APP_ROLE_INSPECTOR=INS
VITE_APP_ROLE_CUSTOMER=CLI
```

### Key Technologies
- React 19, TypeScript, Vite
- React Router v6
- Styled Components + Bootstrap
- Redux Toolkit (manual persistence, no redux-persist)
- Formik + Yup
- Axios (manual token injection per request)
- IndexedDB via `idb`
- Chart.js
- PWA via Vite PWA plugin
- Husky for git hooks
