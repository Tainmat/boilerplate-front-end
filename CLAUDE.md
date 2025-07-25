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
- `npm run preview` - Preview production build locally
- `npm test` - Run tests (currently outputs "No tests defined")

## Architecture Overview

This is a React + TypeScript + Vite application called "UsinCheck" - an industrial inspection management system.

### Module Structure
The application follows a feature-based modular architecture under `src/modules/`:

- **Auth** - Authentication system (Login, FirstLogin, RecoverPassword)
- **Admin** - Administrative features for managing:
  - Customers and Customer Contacts
  - Users and User Profiles  
  - Equipment management
  - Inspections
- **Dashboard** - Main dashboard interface
- **Home** - Home page functionality
- **Errors** - Error handling pages (NotFound)

### Shared Architecture
All shared components and utilities are in `src/shared/`:

- **components/** - Reusable UI components organized by category:
  - `Core/` - Basic UI elements (Buttons, Forms, Tables, etc.)
  - `Layout/` - Layout components (Header, SideMenu, Content, etc.)
  - `Rules/` - Business rule components (SearchForm)
- **contexts/** - React contexts for state management (Auth, Alert, Toast, etc.)
- **hooks/** - Custom hooks, especially for API services
- **services/api/** - Axios-based API client with authentication
- **routes/** - Routing configuration and route protection
- **styles/** - Global styles, theme, and design system tokens
- **utils/** - Utility functions (validation, date, masks, storage, etc.)

### Path Aliases
The project uses TypeScript path aliases configured in both `tsconfig.json` and `vite.config.ts`:
- `@/*` → `src/*`
- `@modules/*` → `src/modules/*`
- `@shared/*` → `src/shared/*`
- `@styles/*` → `src/styles/*`
- `@assets/*` → `src/assets/*`

### API Configuration
- API proxy configured in Vite for `/api/*` requests
- Base URL configured via `VITE_API_URL` environment variable
- Authentication token managed automatically via axios interceptors
- API responses include automatic error handling and redirects

### Key Technologies
- React 19 with TypeScript
- Vite for build tooling
- React Router for routing
- Styled Components for styling
- Bootstrap for base styles
- React Query for API state management
- Formik + Yup for form handling
- Chart.js for data visualization
- PWA capabilities via Vite PWA plugin

### Development Notes
- Development server runs on port 15975
- API calls are proxied to `https://qas-usincheck.jometto.com.br/`
- No test framework currently configured
- Uses Husky for Git hooks
- ESLint and Prettier configured for code quality