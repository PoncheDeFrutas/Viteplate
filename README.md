# Viteplate

![Vite logo](https://vitejs.dev/logo.svg)

**A production-ready React 19 starter template built on Feature-Sliced Design.**

[![wakatime](https://wakatime.com/badge/user/dd9cbf79-b76d-4202-aae2-be6bff8a804e/project/f7c0d23e-1665-4282-8c1c-65db47344c21.svg)](https://wakatime.com/badge/user/dd9cbf79-b76d-4202-aae2-be6bff8a804e/project/f7c0d23e-1665-4282-8c1c-65db47344c21)

</p>
*
---

## Overview

Viteplate is a scalable frontend starter template designed for teams that value architectural clarity. It combines **React 19**, **TypeScript 5.9**, and **Vite 7** with a strict [Feature-Sliced Design](https://feature-sliced.design/) architecture, providing a solid foundation for building production applications of any size.

Rather than being a minimal boilerplate, Viteplate ships with a fully implemented authentication system, role-based access control, a design token-based theme system with dark mode, and a library of shared UI primitives -- all wired together following FSD best practices. It serves as both a reusable production foundation and a living architectural reference.

---

## Table of Contents

- [Viteplate](#viteplate)
    - [Overview](#overview)
    - [Table of Contents](#table-of-contents)
    - [Tech Stack](#tech-stack)
        - [Core](#core)
        - [Routing and Data](#routing-and-data)
        - [UI and Styling](#ui-and-styling)
        - [Development and Testing](#development-and-testing)
    - [Quick Start](#quick-start)
    - [Project Structure](#project-structure)
    - [Architecture](#architecture)
    - [Available Scripts](#available-scripts)
        - [Validation Checklist](#validation-checklist)
    - [Environment Variables](#environment-variables)
    - [Documentation](#documentation)
    - [Key Features](#key-features)
    - [Design System Showcase](#design-system-showcase)
    - [License](#license)

---

## Tech Stack

### Core

| Technology                                   | Version | Purpose                   |
| -------------------------------------------- | ------- | ------------------------- |
| [React](https://react.dev)                   | 19.2    | UI library                |
| [TypeScript](https://www.typescriptlang.org) | ~5.9    | Type safety               |
| [Vite](https://vite.dev)                     | 7.3     | Build tool and dev server |
| [Tailwind CSS](https://tailwindcss.com)      | 4.2     | Utility-first styling     |

### Routing and Data

| Technology                                     | Version | Purpose                      |
| ---------------------------------------------- | ------- | ---------------------------- |
| [TanStack Router](https://tanstack.com/router) | 1.166   | Type-safe code-based routing |
| [TanStack Query](https://tanstack.com/query)   | 5.90    | Server state management      |
| [TanStack Form](https://tanstack.com/form)     | 1.28    | Form state management        |
| [Axios](https://axios-http.com)                | 1.13    | HTTP client                  |
| [Zod](https://zod.dev)                         | 4.3     | Runtime schema validation    |
| [Zustand](https://zustand.docs.pmnd.rs)        | 5.0     | Client state management      |

### UI and Styling

| Technology                                                                                           | Version   | Purpose                        |
| ---------------------------------------------------------------------------------------------------- | --------- | ------------------------------ |
| [Radix UI](https://www.radix-ui.com)                                                                 | various   | Headless accessible primitives |
| [class-variance-authority](https://cva.style)                                                        | 0.7       | Component variant management   |
| [clsx](https://github.com/lukeed/clsx) + [tailwind-merge](https://github.com/dcastil/tailwind-merge) | 2.1 / 3.5 | Class name composition         |
| [Motion](https://motion.dev)                                                                         | 12.36     | Animation library              |
| [Lucide React](https://lucide.dev)                                                                   | 0.577     | Icon library                   |

### Development and Testing

| Technology                                                | Version | Purpose                      |
| --------------------------------------------------------- | ------- | ---------------------------- |
| [Vitest](https://vitest.dev)                              | 4.0     | Unit and integration testing |
| [MSW](https://mswjs.io)                                   | 2.12    | API mocking                  |
| [Testing Library](https://testing-library.com)            | 16.3    | Component testing utilities  |
| [ESLint](https://eslint.org)                              | 9.39    | Code linting                 |
| [Prettier](https://prettier.io)                           | 3.8     | Code formatting              |
| [Husky](https://typicode.github.io/husky)                 | 9.1     | Git hooks                    |
| [lint-staged](https://github.com/lint-staged/lint-staged) | 16.3    | Staged file linting          |

---

## Quick Start

**Prerequisites:** Node.js >= 18 and [pnpm](https://pnpm.io) >= 10.

```bash
# Clone the repository
git clone https://github.com/PoncheDeFrutas/frontend-fsd-vite.git
cd viteplate

# Install dependencies
pnpm install

# Start the development server
pnpm dev
```

The dev server starts at `http://localhost:5173` by default.

See [Getting Started](docs/getting-started.md) for detailed setup instructions and environment configuration.

---

## Project Structure

Viteplate follows [Feature-Sliced Design](https://feature-sliced.design/) with a strict top-down dependency rule:

```
src/
├── app/                    # Bootstrap, providers, router, guards, layouts
├── pages/                  # Route-level page compositions
│   └── design-system/      # Dev-only component showcase (lazy-loaded tabs)
├── widgets/                # Reusable composed UI blocks (navbar, footer)
├── features/               # Business use cases (auth/login, auth/logout)
├── entities/               # Domain models (session, user)
├── shared/                 # Domain-agnostic infrastructure
│   ├── api/                # HTTP client, interceptors, error handling
│   ├── config/             # Environment validation, constants
│   ├── lib/                # Utility functions (cn, parseWithSchema)
│   ├── types/              # Shared type definitions
│   └── ui/                 # 65 UI components (193 exports across 6 categories)
│       ├── input/          # Button, Checkbox, Combobox, FileUpload, Input, Label, NumberInput, PinInput, RadioGroup, Rating, SegmentedControl, Select, Slider, Switch, Textarea, Toggle, ToggleGroup
│       ├── display/        # Accordion, Avatar, Badge, Blockquote, Carousel, CodeBlock, DataList, Indicator, Kbd, ProgressBar, Separator, Skeleton, Table, Tabs, Tag, Timeline, Tooltip, Tree
│       ├── feedback/       # Alert, Banner, CopyButton, EmptyState, ErrorMessage, LoadingOverlay, Spinner, Toast (imperative API)
│       ├── overlay/        # AlertDialog, ContextMenu, Dialog, Drawer, DropdownMenu, HoverCard, Popover
│       ├── navigation/     # Breadcrumb, CommandPalette, NavigationMenu, Pagination, Stepper, StyledLink
│       └── layout/         # Affix, AspectRatio, Card, Collapsible, Container, Grid, ResizablePanels, ScrollArea, Stack
└── main.tsx                # Application entry point

test/
├── unit/                   # Unit tests (mirrors src/ structure)
├── integration/            # Integration tests
├── msw/                    # MSW handlers and fixtures
├── utils/                  # Test utilities (renderApp, resetAuth)
└── setup.ts                # Global test setup
```

---

## Architecture

Imports flow strictly **downward** through the layer hierarchy:

```
app  -->  pages  -->  widgets  -->  features  -->  entities  -->  shared
```

| Layer      | Responsibility                           | May Import From                            |
| ---------- | ---------------------------------------- | ------------------------------------------ |
| `app`      | Bootstrap, providers, router, guards     | pages, widgets, features, entities, shared |
| `pages`    | Route-level composition (thin)           | widgets, features, entities, shared        |
| `widgets`  | Reusable composed UI blocks              | features, entities, shared                 |
| `features` | Business use cases                       | entities, shared                           |
| `entities` | Domain models and data access            | shared                                     |
| `shared`   | Infrastructure, utilities, UI primitives | external packages only                     |

Cross-slice imports must go through each slice's `index.ts` public API. Deep imports into another slice's internals are prohibited.

For a comprehensive architecture guide, see [Architecture](docs/architecture.md).

---

## Available Scripts

| Command              | Description                                     |
| -------------------- | ----------------------------------------------- |
| `pnpm dev`           | Start the Vite development server               |
| `pnpm build`         | Type-check with `tsc` then build for production |
| `pnpm check-types`   | Run TypeScript type checking only               |
| `pnpm lint`          | Lint the entire project with ESLint             |
| `pnpm format`        | Format all files with Prettier                  |
| `pnpm test`          | Run tests in watch mode                         |
| `pnpm test -- --run` | Run all tests once (CI mode)                    |
| `pnpm test:coverage` | Run tests with coverage report                  |
| `pnpm preview`       | Preview the production build locally            |

### Validation Checklist

Run these commands before any meaningful change:

```bash
pnpm lint
pnpm check-types
pnpm build
pnpm test -- --run
```

---

## Environment Variables

All variables are validated at startup with Zod and have sensible defaults.

| Variable            | Type           | Default                 | Description                     |
| ------------------- | -------------- | ----------------------- | ------------------------------- |
| `VITE_API_BASE_URL` | `string` (URL) | `http://localhost:3000` | Base URL for all API requests   |
| `VITE_ENABLE_MSW`   | `boolean`      | `true`                  | Enable MSW request interception |
| `VITE_ENABLE_DEBUG` | `boolean`      | `false`                 | Enable debug logging            |

Create a `.env.local` file in the project root to override defaults:

```env
VITE_API_BASE_URL=https://api.example.com
VITE_ENABLE_MSW=false
VITE_ENABLE_DEBUG=true
```

---

## Documentation

| Document                                                                        | Description                                                        |
| ------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| **Getting Started**                                                             |                                                                    |
| [Getting Started](docs/getting-started.md)                                      | Prerequisites, installation, environment configuration             |
| **Architecture**                                                                |                                                                    |
| [Architecture](docs/architecture.md)                                            | FSD layers, dependency rules, naming conventions, directory layout |
| [Routing](docs/routing.md)                                                      | TanStack Router setup, route tree, guards, layouts                 |
| [API Layer](docs/api-layer.md)                                                  | HTTP client, typed methods, interceptors, error normalization      |
| [Auth System](docs/auth.md)                                                     | JWT auth, session management, guards, refresh flow                 |
| [Backend Integration](docs/backend-integration.md)                              | Required backend endpoints, auth contract, CORS, cookies           |
| [State Management](docs/state-management.md)                                    | Zustand stores, TanStack Query integration                         |
| [Styling](docs/styling.md)                                                      | Tailwind v4, design tokens, theming, cn(), CVA patterns            |
| [Testing](docs/testing.md)                                                      | Vitest configuration, MSW handlers, test utilities                 |
| **Guides**                                                                      |                                                                    |
| [Creating a Feature](docs/guides/creating-a-feature.md)                         | Step-by-step guide using auth/login as an example                  |
| [Creating an Entity](docs/guides/creating-an-entity.md)                         | Step-by-step guide using user as an example                        |
| [Creating a Page](docs/guides/creating-a-page.md)                               | Step-by-step guide for route-level pages                           |
| [Creating a Widget](docs/guides/creating-a-widget.md)                           | Step-by-step guide using navbar as an example                      |
| [Creating a Shared UI Component](docs/guides/creating-a-shared-ui-component.md) | CVA variant patterns, accessibility, composition                   |

---

## Key Features

- **Feature-Sliced Design** -- strict architectural boundaries with enforced dependency direction
- **JWT Authentication** -- complete auth flow with token refresh, role-based access control, and route guards
- **Type-Safe Routing** -- code-based TanStack Router with typed route contexts and navigation
- **Design System** -- zinc-based color palette with semantic tokens, dark mode, and smooth theme transitions
- **65 Shared UI Components** -- 193 exports across 6 categories (input, display, feedback, overlay, navigation, layout), built with CVA, Radix UI primitives, and Motion animations
- **Design System Showcase** -- dev-only `/design-system` page with tabbed, lazy-loaded sections showcasing every component and variant (tree-shaken from production builds)
- **API Error Normalization** -- structured error handling with retry flags, trace IDs, and error codes
- **Zod Validation** -- runtime schema validation for API responses and environment configuration
- **MSW Testing** -- realistic API mocking with in-memory session state for integration tests
- **Pre-commit Hooks** -- automated formatting with Husky and lint-staged

---

## Design System Showcase

In development mode, navigate to `/design-system` (or click "Design System" in the navbar) to browse an interactive showcase of every shared UI component and its variants. The page is organized into six tabbed sections:

| Tab            | Components                                                                                                                                                               |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Input**      | Button, Checkbox, Combobox, FileUpload, Input, Label, NumberInput, PinInput, RadioGroup, Rating, SegmentedControl, Select, Slider, Switch, Textarea, Toggle, ToggleGroup |
| **Display**    | Accordion, Avatar, Badge, Blockquote, Carousel, CodeBlock, DataList, Indicator, Kbd, ProgressBar, Separator, Skeleton, Table, Tabs, Tag, Timeline, Tooltip, Tree         |
| **Feedback**   | Alert, Banner, CopyButton, EmptyState, ErrorMessage, LoadingOverlay, Spinner, Toast                                                                                      |
| **Overlay**    | AlertDialog, ContextMenu, Dialog, Drawer, DropdownMenu, HoverCard, Popover                                                                                               |
| **Navigation** | Breadcrumb, CommandPalette, NavigationMenu, Pagination, Stepper, StyledLink                                                                                              |
| **Layout**     | Affix, AspectRatio, Card, Collapsible, Container, Grid, ResizablePanels, ScrollArea, Stack                                                                               |

Each section is lazy-loaded via `React.lazy()` + `Suspense`, so only the active tab's code is downloaded. The route and nav link are guarded by `import.meta.env.DEV` and fully tree-shaken from production builds.

---

## License

This project is available as open source under the terms of the [MIT License](LICENSE).
