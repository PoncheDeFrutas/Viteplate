# Creating a Shared UI Component

This guide walks through creating a new shared UI component in Viteplate, covering the CVA variant pattern, accessibility, and composition. Shared UI components are domain-agnostic primitives that can be used anywhere in the application.

---

## Table of Contents

- [What is a Shared UI Component?](#what-is-a-shared-ui-component)
- [Component Categories](#component-categories)
- [Step-by-Step Guide](#step-by-step-guide)
- [Variant Pattern with CVA](#variant-pattern-with-cva)
- [Real Examples](#real-examples)
- [Accessibility](#accessibility)
- [Checklist](#checklist)

---

## What is a Shared UI Component?

A shared UI component is a **domain-agnostic primitive** that provides reusable visual building blocks. These components know nothing about the application's business domain -- they are generic tools like buttons, cards, badges, and spinners.

**FSD Rules for Shared UI:**

- May only import from `@shared/lib` and external packages
- May NOT import from entities, features, widgets, pages, or app
- Must remain domain-agnostic (no user types, no auth logic)
- Must accept `className` for style composition

---

## Component Categories

Shared UI is organized into six categories:

```
src/shared/ui/
├── index.ts          # Barrel export for all components
├── input/            # Interactive form elements
│   ├── Button.tsx
│   ├── Input.tsx
│   └── Label.tsx
├── display/          # Visual data presentation
│   ├── Avatar.tsx
│   ├── Badge.tsx
│   ├── CodeBlock.tsx
│   ├── Kbd.tsx
│   ├── ProgressBar.tsx
│   ├── Separator.tsx
│   └── Skeleton.tsx
├── feedback/         # Status and state communication
│   ├── Spinner.tsx
│   ├── ErrorMessage.tsx
│   └── EmptyState.tsx
├── overlay/          # Portaled/floating surfaces
│   ├── Dialog.tsx
│   ├── Drawer.tsx
│   └── Popover.tsx
├── navigation/       # Navigational primitives
│   ├── Breadcrumb.tsx
│   ├── Pagination.tsx
│   └── Stepper.tsx
└── layout/           # Structural containers
    ├── Card.tsx
    └── Container.tsx
```

### Choosing a Category

| Category      | Purpose                                      | Examples                                 |
| ------------- | -------------------------------------------- | ---------------------------------------- |
| `input/`      | Elements users interact with to provide data | Button, Input, Label, Select, Checkbox   |
| `display/`    | Elements that present data visually          | Avatar, Badge, CodeBlock, ProgressBar    |
| `feedback/`   | Elements that communicate status or state    | Spinner, ErrorMessage, EmptyState, Toast |
| `overlay/`    | Floating/layered UI surfaces                 | Dialog, Drawer, Popover, DropdownMenu    |
| `navigation/` | Wayfinding and flow controls                 | Breadcrumb, Pagination, Stepper          |
| `layout/`     | Structural wrappers that organize content    | Card, Container, Stack, Grid             |

---

## Step-by-Step Guide

### Step 1: Choose the Category

Decide which subdirectory the component belongs in based on its primary purpose.

### Step 2: Create the Component File

```bash
# PascalCase.tsx for components
touch src/shared/ui/display/Tag.tsx
```

### Step 3: Define Variants (if applicable)

Use CVA for components with multiple visual states:

```typescript
// src/shared/ui/display/Tag.tsx
import { cva } from 'class-variance-authority';
import { cn } from '@shared/lib/cn';
import type { HTMLAttributes } from 'react';
import type { VariantProps } from 'class-variance-authority';

// ---------------------------------------------------------------------------
// Variants
// ---------------------------------------------------------------------------

const tagVariants = cva(
    // Base classes (always applied)
    'inline-flex items-center rounded-full font-medium',
    {
        variants: {
            variant: {
                default: 'bg-primary/10 text-primary',
                success: 'bg-success/10 text-success',
                warning: 'bg-warning/10 text-warning',
                destructive: 'bg-destructive/10 text-destructive',
            },
            size: {
                sm: 'px-2 py-0.5 text-xs',
                md: 'px-2.5 py-0.5 text-sm',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'md',
        },
    },
);
```

### Step 4: Define the Props Interface

Extend HTML element attributes and CVA variant props:

```typescript
// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface TagProps extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof tagVariants> {
    /** Optional dismiss handler. When provided, shows a close button. */
    onDismiss?: () => void;
}
```

### Step 5: Implement the Component

```typescript
/**
 * Compact label for categorization or status indication.
 */
export function Tag({ className, variant, size, children, onDismiss, ...props }: TagProps) {
    return (
        <span className={cn(tagVariants({ variant, size }), className)} {...props}>
            {children}
            {onDismiss && (
                <button
                    type="button"
                    onClick={onDismiss}
                    className="ml-1 opacity-60 hover:opacity-100"
                    aria-label="Remove"
                >
                    x
                </button>
            )}
        </span>
    );
}
```

### Step 6: Export from the Category Barrel

If the category has a barrel file (like `display/index.ts`), add the export:

```typescript
// src/shared/ui/display/index.ts
export { Tag } from './Tag';
```

### Step 7: Export from the Main Barrel

Add to the top-level `src/shared/ui/index.ts`:

```typescript
export { Tag } from './display/Tag';
```

---

## Variant Pattern with CVA

### Anatomy

Every CVA-based component follows this pattern:

```
1. Import CVA and cn()
2. Define variant configuration with cva()
3. Define props interface extending HTML attrs + VariantProps
4. Implement component using cn(variants({ ... }), className)
5. Export as named function
```

### CVA Configuration Structure

```typescript
const componentVariants = cva(
    'base-classes always-applied', // Base styles
    {
        variants: {
            // Variant definitions
            variant: {
                // Visual style
                default: '...',
                outline: '...',
            },
            size: {
                // Size scale
                sm: '...',
                md: '...',
                lg: '...',
            },
        },
        compoundVariants: [
            // Combinations (optional)
            {
                variant: 'outline',
                size: 'sm',
                className: 'border',
            },
        ],
        defaultVariants: {
            // Defaults when props omitted
            variant: 'default',
            size: 'md',
        },
    },
);
```

### The `cn()` Pattern

Every component that accepts `className` must use `cn()` to merge classes:

```typescript
// This allows consumers to override or extend styles
<div className={cn(tagVariants({ variant, size }), className)} />
```

`cn()` uses `tailwind-merge` under the hood, so conflicting classes are properly resolved:

```tsx
// Consumer can override padding
<Tag className="px-6">Custom</Tag>
// tailwind-merge removes the default px-2.5 and applies px-6
```

---

## Real Examples

### Simple Component (no variants): Separator

```typescript
interface SeparatorProps extends HTMLAttributes<HTMLDivElement> {
    orientation?: 'horizontal' | 'vertical';
    decorative?: boolean;
}

export function Separator({ className, orientation = 'horizontal', decorative = true, ...props }: SeparatorProps) {
    return (
        <div
            role={decorative ? 'none' : 'separator'}
            aria-orientation={decorative ? undefined : orientation}
            className={cn(
                'shrink-0 bg-border',
                orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
                className,
            )}
            {...props}
        />
    );
}
```

### CVA Component with Multiple Variant Axes: Button

The Button component demonstrates the full CVA pattern with:

- 6 visual variants (default, outline, ghost, destructive, link, secondary)
- 4 size variants (sm, md, lg, icon)
- Boolean props (fullWidth, loading)
- Loading state that disables interaction and shows a spinner

### Composition Component: EmptyState

EmptyState accepts `icon`, `title`, `description`, and `action` as props, composing them into a layout. It does not use CVA because it has no visual variants -- it is a fixed composition pattern.

```typescript
interface EmptyStateProps extends HTMLAttributes<HTMLDivElement> {
    icon?: ReactNode;
    title: string;
    description?: string;
    action?: ReactNode;
}
```

---

## Accessibility

### ARIA Patterns

| Component      | ARIA Pattern                                                      |
| -------------- | ----------------------------------------------------------------- |
| `Button`       | Native `<button>` with `disabled` and `aria-disabled` for loading |
| `Spinner`      | `role="status"` + `aria-label` + visually hidden text             |
| `ErrorMessage` | `role="alert"` for screen reader announcement                     |
| `Separator`    | `role="separator"` or `role="none"` (decorative)                  |
| `Avatar`       | `aria-label` with full name, `title` for hover                    |
| `ProgressBar`  | `role="progressbar"` + `aria-valuenow/min/max`                    |
| `Skeleton`     | `aria-hidden="true"` (decorative placeholder)                     |

### Rules

| Rule                                    | Description                                      |
| --------------------------------------- | ------------------------------------------------ |
| Preserve native semantics               | Use `<button>` for buttons, `<input>` for inputs |
| Forward HTML attributes                 | Always spread `...props` onto the root element   |
| Include `className`                     | Allow style customization via `cn()`             |
| Label required for visual-only elements | Spinners, avatars need text alternatives         |
| Use semantic HTML elements              | `<label>`, `<kbd>`, `<pre>` where appropriate    |

---

## Checklist

| Step                                                                | Done? |
| ------------------------------------------------------------------- | ----- |
| File is `PascalCase.tsx` in the correct category directory          |       |
| Component is a named export (no default export)                     |       |
| Uses `cn()` with `className` prop for style composition             |       |
| Uses CVA for variants (if the component has multiple visual states) |       |
| Props interface extends appropriate HTML attributes                 |       |
| Props interface extends `VariantProps` (if using CVA)               |       |
| Spreads `...props` onto the root element                            |       |
| Has a JSDoc comment describing the component                        |       |
| Appropriate ARIA attributes for accessibility                       |       |
| Uses design tokens (not raw colors)                                 |       |
| Domain-agnostic (no business logic, no entity types)                |       |
| Exported from category barrel (if exists)                           |       |
| Exported from `src/shared/ui/index.ts`                              |       |
| No `any` types                                                      |       |
