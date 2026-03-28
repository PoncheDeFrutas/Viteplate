# Getting Started

This guide covers everything needed to set up and run Viteplate locally.

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Configuration](#environment-configuration)
- [Development Server](#development-server)
- [Available Scripts](#available-scripts)
- [Validation Checklist](#validation-checklist)
- [Editor Setup](#editor-setup)
- [Project Conventions](#project-conventions)

---

## Prerequisites

| Requirement | Minimum Version | Notes                                                         |
| ----------- | --------------- | ------------------------------------------------------------- |
| Node.js     | 18.x            | LTS recommended                                               |
| pnpm        | 10.x            | Optional ([installation guide](https://pnpm.io/installation)) |
| npm         | 10.x            | Optional (bundled with Node.js)                               |
| Git         | 2.x             | For cloning and hooks                                         |

You can run Viteplate with either **pnpm** or **npm**. All scripts in `package.json` work with both package managers.

---

## Installation

```bash
# Clone the repository
git clone https://github.com/PoncheDeFrutas/frontend-fsd-vite.git
cd viteplate

# Install all dependencies (choose one)
pnpm install
# or
npm install
```

The install step also sets up Husky git hooks via the `prepare` script, which enables automatic formatting on pre-commit.

---

## Environment Configuration

Viteplate validates environment variables at startup using Zod. All variables have sensible defaults, so the application runs out of the box without any `.env` file.

### Variables

| Variable            | Type           | Default                 | Description                                                 |
| ------------------- | -------------- | ----------------------- | ----------------------------------------------------------- |
| `VITE_API_BASE_URL` | `string` (URL) | `http://localhost:3000` | Base URL for all API requests                               |
| `VITE_ENABLE_MSW`   | `boolean`      | `true`                  | Enable Mock Service Worker for local development            |
| `VITE_ENABLE_DEBUG` | `boolean`      | `false`                 | Enable debug logging (session events, interceptor activity) |

### Overriding Defaults

Create a `.env.local` file in the project root:

```env
VITE_API_BASE_URL=https://api.staging.example.com
VITE_ENABLE_MSW=false
VITE_ENABLE_DEBUG=true
```

Vite loads `.env.local` automatically and it is gitignored by default.

### How Validation Works

Environment variables are parsed in `src/shared/config/env.ts` using Zod's `safeParse`. If validation fails, the application logs a warning and falls back to default values rather than crashing. This ensures a smooth developer experience while still catching misconfiguration early.

```typescript
// src/shared/config/env.ts (simplified)
const DEFAULT_ENV = {
    VITE_API_BASE_URL: 'http://localhost:3000',
    VITE_ENABLE_MSW: true,
    VITE_ENABLE_DEBUG: false,
};

const envSchema = z.object({
    VITE_API_BASE_URL: z.url(),
    VITE_ENABLE_MSW: booleanEnvSchema, // z.preprocess for string-to-boolean
    VITE_ENABLE_DEBUG: booleanEnvSchema,
});
```

Each variable is individually validated with `safeParse`. If validation fails or the variable is missing, the default from `DEFAULT_ENV` is used.

---

## Development Server

```bash
pnpm dev
# or
npm run dev
```

The Vite development server starts at `http://localhost:5173` with:

- Hot Module Replacement (HMR) for instant feedback
- MSW intercepting API requests (when `VITE_ENABLE_MSW=true`)
- TanStack Router and Query devtools in the browser

### MSW in Development

When MSW is enabled (the default), the browser service worker intercepts all API requests and returns mock responses. This allows full development without a backend server. The MSW worker is registered in `src/main.tsx` before the React app mounts.

---

## Available Scripts

### Development

| Command                            | Description                                       |
| ---------------------------------- | ------------------------------------------------- |
| `pnpm dev` / `npm run dev`         | Start the Vite dev server with HMR                |
| `pnpm preview` / `npm run preview` | Serve the production build locally for inspection |

### Building

| Command                                    | Description                                                      |
| ------------------------------------------ | ---------------------------------------------------------------- |
| `pnpm build` / `npm run build`             | Type-check (`tsc -b`) then produce an optimized production build |
| `pnpm check-types` / `npm run check-types` | Run TypeScript type checking without emitting                    |

### Code Quality

| Command                          | Description                          |
| -------------------------------- | ------------------------------------ |
| `pnpm lint` / `npm run lint`     | Run ESLint across the entire project |
| `pnpm format` / `npm run format` | Run Prettier write mode on all files |

### Testing

| Command                                                                                  | Description                                        |
| ---------------------------------------------------------------------------------------- | -------------------------------------------------- |
| `pnpm test` / `npm run test`                                                             | Run Vitest in watch mode (re-runs on file changes) |
| `pnpm test -- --run` / `npm run test -- --run`                                           | Run all tests once and exit (suitable for CI)      |
| `pnpm test -- --run path/to/file.test.ts` / `npm run test -- --run path/to/file.test.ts` | Run a single test file                             |
| `pnpm test -- --run -t "pattern"` / `npm run test -- --run -t "pattern"`                 | Run tests matching a name pattern                  |
| `pnpm test:coverage` / `npm run test:coverage`                                           | Run tests with coverage reporting                  |

---

## Validation Checklist

Before pushing any meaningful change, run these four commands in order:

```bash
pnpm lint            # Ensure no linting violations
pnpm check-types     # Verify TypeScript compiles cleanly
pnpm build           # Confirm production build succeeds
pnpm test -- --run   # Run all tests (21 tests across 4 suites)

# npm equivalents
npm run lint
npm run check-types
npm run build
npm run test -- --run
```

All four must pass with zero errors.

---

## Editor Setup

### Recommended Extensions (VS Code)

| Extension                 | Purpose                                    |
| ------------------------- | ------------------------------------------ |
| ESLint                    | Inline linting feedback                    |
| Prettier                  | Format on save                             |
| Tailwind CSS IntelliSense | Class name autocomplete and hover previews |
| TypeScript Importer       | Auto-import suggestions                    |

### Recommended Settings

```jsonc
{
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true,
    "editor.tabSize": 4,
    "typescript.preferences.importModuleSpecifier": "non-relative",
}
```

---

## Project Conventions

For a quick orientation, here are the most important rules:

| Rule                     | Description                                                  |
| ------------------------ | ------------------------------------------------------------ |
| FSD dependency direction | `app -> pages -> widgets -> features -> entities -> shared`  |
| No default exports       | All exports must be named                                    |
| Type-only imports        | Use `import type { ... }` for types                          |
| No `any`                 | Use `unknown` and narrow with type guards or Zod             |
| kebab-case files         | `.ts` files use `kebab-case`                                 |
| PascalCase components    | `.tsx` files use `PascalCase`                                |
| Cross-slice via barrel   | Import from `@layer/slice`, not `@layer/slice/internal/file` |
| Prettier on commit       | Pre-commit hook formats staged files automatically           |

For the complete rule set, see [Architecture](./architecture.md).
