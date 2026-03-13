# Styling

Viteplate uses Tailwind CSS v4 with a custom design token system, dark mode support, and component variant management through CVA. This document covers the styling architecture and patterns used throughout the project.

---

## Table of Contents

- [Overview](#overview)
- [Design Tokens](#design-tokens)
- [Theme System](#theme-system)
- [Utility Functions](#utility-functions)
- [Component Variants with CVA](#component-variants-with-cva)
- [Animation](#animation)
- [Conventions](#conventions)

---

## Overview

The styling stack consists of:

| Tool                                  | Purpose                             |
| ------------------------------------- | ----------------------------------- |
| Tailwind CSS v4                       | Utility-first CSS framework         |
| `@tailwindcss/vite`                   | Vite plugin for Tailwind processing |
| Design tokens (CSS custom properties) | Semantic color system               |
| `cn()` (clsx + tailwind-merge)        | Class name composition              |
| CVA (class-variance-authority)        | Component variant management        |
| Motion                                | Animation library                   |
| `prettier-plugin-tailwindcss`         | Automatic class sorting             |

Global styles are organized as modular files under `src/app/styles/`:

```text
src/app/styles/
├── index.css                      # Aggregator (imports all style modules)
├── theme.css                      # Design tokens + @theme mapping
├── base.css                       # Base/reset and view transitions
└── components/
    ├── toast.css
    ├── accordion.css
    ├── collapsible.css
    ├── overlay-animations.css
    ├── skeleton.css
    └── dot-grid.css
```

---

## Design Tokens

The design system uses a two-tier token architecture:

1. **Primitive tokens** -- Raw color values (zinc palette)
2. **Semantic tokens** -- Named by purpose (background, foreground, primary, etc.)

### Semantic Color Tokens

| Token                  | Purpose           | Light       | Dark        |
| ---------------------- | ----------------- | ----------- | ----------- |
| `--background`         | Page background   | zinc-50     | zinc-950    |
| `--foreground`         | Primary text      | zinc-950    | zinc-50     |
| `--surface`            | Elevated surface  | white       | zinc-900    |
| `--card`               | Card background   | white       | zinc-900    |
| `--card-foreground`    | Card text         | zinc-950    | zinc-50     |
| `--muted`              | Muted backgrounds | zinc-100    | zinc-800    |
| `--muted-foreground`   | Secondary text    | zinc-500    | zinc-400    |
| `--primary`            | Primary actions   | zinc-900    | zinc-50     |
| `--primary-foreground` | Text on primary   | zinc-50     | zinc-900    |
| `--secondary`          | Secondary actions | zinc-100    | zinc-800    |
| `--accent`             | Accent highlights | zinc-100    | zinc-800    |
| `--destructive`        | Error/danger      | red-500     | red-400     |
| `--success`            | Success states    | emerald-500 | emerald-400 |
| `--warning`            | Warning states    | amber-500   | amber-400   |
| `--info`               | Informational     | sky-500     | sky-400     |
| `--border`             | Default borders   | zinc-200    | zinc-800    |
| `--ring`               | Focus rings       | zinc-950    | zinc-300    |
| `--disabled`           | Disabled elements | zinc-300    | zinc-700    |

### Tailwind Integration

Tokens are mapped to Tailwind via the `@theme` block in `src/app/styles/theme.css`:

```css
@theme {
    --color-background: var(--background);
    --color-foreground: var(--foreground);
    --color-primary: var(--primary);
    /* ... etc */
}
```

This allows using tokens with standard Tailwind classes:

```html
<div class="bg-background text-foreground border-border">
    <button class="bg-primary text-primary-foreground">
        <span class="text-muted-foreground"></span>
    </button>
</div>
```

### Typography

| Token         | Value                              |
| ------------- | ---------------------------------- |
| Font family   | Poppins (loaded via Google Fonts)  |
| `--font-sans` | `'Poppins', system-ui, sans-serif` |

---

## Theme System

### How It Works

Theme switching is managed by the `ThemeProvider` in `src/app/providers/theme/`:

| File                      | Purpose                                |
| ------------------------- | -------------------------------------- |
| `theme-context.ts`        | React context definition               |
| `ThemeProvider.tsx`       | Provider that manages theme state      |
| `use-theme.ts`            | Hook for consuming theme context       |
| `src/shared/lib/theme.ts` | Pure utility functions for theme logic |

The theme is applied by toggling the `.dark` class on the `<html>` element. Tailwind v4 uses this class to switch between light and dark token values defined in the CSS.

### Theme Persistence

The user's theme preference is persisted to `localStorage`. On load:

1. Check `localStorage` for a saved preference
2. If none, check `prefers-color-scheme` media query
3. Apply the resolved theme by setting/removing `.dark` on `<html>`

### Theme Transitions

Theme switches use the [View Transitions API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API) for a smooth 250ms cross-fade. The transition respects `prefers-reduced-motion` -- when the user prefers reduced motion, the theme changes instantly without animation.

```css
::view-transition-old(root),
::view-transition-new(root) {
    animation-duration: 250ms;
    animation-timing-function: ease-in-out;
}
```

### Usage

```typescript
import { useTheme } from '@app/providers/theme/use-theme';

function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();
    return (
        <button onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'dark' ? 'Light' : 'Dark'}
        </button>
    );
}
```

---

## Utility Functions

### `cn()` -- Class Name Composition

**File:** `src/shared/lib/cn.ts`

Combines `clsx` (conditional class joining) with `tailwind-merge` (deduplicates conflicting Tailwind classes):

```typescript
import { cn } from '@shared/lib/cn';

// Conditional classes
cn('px-4 py-2', isActive && 'bg-primary', className);

// Override-safe: last conflicting class wins
cn('px-4', 'px-8'); // Result: 'px-8'
cn('text-red-500', 'text-blue-500'); // Result: 'text-blue-500'
```

`cn()` is used in every shared UI component to allow consumers to override default styles safely.

---

## Component Variants with CVA

[class-variance-authority](https://cva.style/) (CVA) manages component variants -- predefined combinations of Tailwind classes that can be selected via props.

### Pattern

```typescript
import { cva } from 'class-variance-authority';
import { cn } from '@shared/lib/cn';
import type { VariantProps } from 'class-variance-authority';

// 1. Define variants
const buttonVariants = cva(
    // Base classes (always applied)
    'inline-flex items-center justify-center rounded-md font-medium transition-colors',
    {
        variants: {
            variant: {
                default: 'bg-primary text-primary-foreground hover:bg-primary/90',
                outline: 'border border-border bg-transparent hover:bg-accent',
                ghost: 'hover:bg-accent hover:text-accent-foreground',
                destructive: 'bg-destructive text-white hover:bg-destructive/90',
                link: 'text-primary underline-offset-4 hover:underline',
                secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
            },
            size: {
                sm: 'h-8 px-3 text-xs',
                md: 'h-9 px-4 text-sm',
                lg: 'h-10 px-6 text-sm',
                icon: 'h-9 w-9',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'md',
        },
    },
);

// 2. Type the props
interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    loading?: boolean;
    fullWidth?: boolean;
}

// 3. Apply in the component
function Button({ className, variant, size, ...props }: ButtonProps) {
    return (
        <button className={cn(buttonVariants({ variant, size }), className)} {...props} />
    );
}
```

### Usage

```tsx
<Button variant="default" size="md">Save</Button>
<Button variant="outline" size="sm">Cancel</Button>
<Button variant="destructive">Delete</Button>
<Button variant="ghost" size="icon"><X /></Button>
```

### Components Using CVA

| Component     | Variants                                                                                        |
| ------------- | ----------------------------------------------------------------------------------------------- |
| `Button`      | 6 variants (default, outline, ghost, destructive, link, secondary), 4 sizes, fullWidth, loading |
| `Badge`       | 8 variants (default, secondary, outline, destructive, success, warning, info, muted)            |
| `Input`       | 2 variants (default, error)                                                                     |
| `Avatar`      | 3 sizes (sm, md, lg)                                                                            |
| `Spinner`     | 4 sizes (xs, sm, md, lg)                                                                        |
| `ProgressBar` | 5 colors, 3 sizes                                                                               |
| `Card`        | 2 variants (default, filled), 3 padding levels, interactive option                              |
| `Container`   | 5 max-width levels (sm, md, lg, xl, 2xl)                                                        |

---

## Animation

### Motion Library

Viteplate uses [Motion](https://motion.dev) for component animations. Common patterns:

```typescript
import { motion } from 'motion/react';

// Fade up on mount
<motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
>
    Content
</motion.div>
```

### Animation Presets

**File:** `src/shared/lib/animation-presets.ts`

Reusable animation configurations are extracted into shared presets to ensure consistency:

```typescript
import { FADE_UP, STAGGER_CONTAINER } from '@shared/lib/animation-presets';

<motion.div {...FADE_UP}>Animated content</motion.div>
```

### CSS Animations

CSS animations are grouped in modular component style files (mainly
`src/app/styles/components/overlay-animations.css`, `skeleton.css`, and
`accordion.css` / `collapsible.css`):

| Animation family               | Usage                                                               |
| ------------------------------ | ------------------------------------------------------------------- |
| `overlay-fade-*`               | Dialog/Drawer/AlertDialog backdrops                                 |
| `dialog-*`                     | Dialog and AlertDialog content enter/exit                           |
| `drawer-slide-*`               | Drawer panel transitions by side (`left`, `right`, `top`, `bottom`) |
| `floating-*`                   | Select, DropdownMenu, ContextMenu, Popover, HoverCard               |
| `tab-fade-in`                  | Active `TabsContent` transition                                     |
| `accordion-*`, `collapsible-*` | Height-based disclosure animation via Radix measured height vars    |
| `skeleton-shimmer`             | Loading skeleton shimmer effect                                     |
| `.dot-grid` utility            | Decorative dotted background pattern                                |

---

## Conventions

| Rule                         | Description                                                               |
| ---------------------------- | ------------------------------------------------------------------------- |
| Use `cn()` for class merging | Every component that accepts `className` should use `cn()`                |
| Use CVA for variants         | Components with multiple visual variations should use CVA                 |
| Use design tokens            | Never use raw color values; always reference semantic tokens              |
| Domain-agnostic UI           | Shared UI must not contain business logic                                 |
| Tailwind class sorting       | Automated via Prettier plugin                                             |
| Responsive design            | Use Tailwind responsive prefixes (`sm:`, `md:`, `lg:`, `xl:`)             |
| Dark mode                    | Handled automatically via design tokens (no manual dark: prefixes needed) |
