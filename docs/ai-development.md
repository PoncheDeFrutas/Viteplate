# AI-Assisted Development Guide

Viteplate is designed from the ground up to be safe and predictable for AI coding agents. Its strict Feature-Sliced Design (FSD) boundaries and rigorous TypeScript environment give agents distinct structural "rails" to follow.

This guide outlines how to easily leverage AI in Viteplate, UI customization tips, and safe prompt strategies.

---

## 1. Overview of AI-Assisted Development

AI development inside Viteplate revolves heavily around leveraging its atomic component architecture combined with the `shared/ui` component primitive library. Because components logically build upwards (`shared -> entities -> features -> widgets -> pages`), an AI can comfortably reason about complex applications merely by keeping changes locked within a single slice.

Viteplate provides detailed internal boundaries using an `AGENTS.md` file located at the repository root. All mainstream AI coding agents (such as GitHub Copilot and Cursor) are explicitly instructed to adhere to these repository rules implicitly over manual configuration.

---

## 2. Rules Agents Must Follow

Due to the internal `AGENTS.md` instruction file, an AI handling this project applies the following strict directives:

- **Strict FSD Hierarchy**: Never import upwards in the layer graph. Never deep-import into slice internals outside `index.ts`.
- **Domain-Agnostic UI**: The `share/ui/` layer acts strictly as a dumb representation layer. No business logic (Zustand, Axios) goes inside here.
- **Data Encapsulation**: Untrusted payloads are parsed with Zod, and HTTP communication rests within custom abstractions over Axios.
- **Safety First**: Features like single-flight JWT token refresh flow must not be rewritten haphazardly.

---

## 3. Safe Boundaries

AI agents are great at creating boilerplate, but occasionally overstep boundaries. Guide them safely using the following principles:

- **No Business Logic in Pages/Widgets**: Insist to the agent that data fetching must happen via `entities` or `features`, while pages simply compose Widgets.
- **Isolate Your Demands**: When asking an agent to redesign a component, scope your prompt strictly: _"Only modify the Tailwind variants inside the Button component; do not change any prop signatures or the `cva` base execution."_
- **Acknowledge `AGENTS.md`**: Start your request assuring the AI that you rely on its understanding of the FSD constraints.

---

## 4. UI Editing Guidelines

Viteplate’s `shared/ui` is built to be a simple, raw base that relies heavily on Tailwind CSS and `class-variance-authority` (cva).

### Shared UI Philosophy

- **Minimality**: Viteplate components are minimally styled.
- **Editable Variants**: Appearance is largely managed through `.cva()` strings.

### How to Modify Common Components

#### **Button** (`src/shared/ui/input/Button.tsx`)

- **Action**: Modify the `variant: { ... }` object directly.
- **Guidance**: If introducing heavy animations or multi-state changes (hover/active), extend Tailwind strings cleanly. Use `cn()` if injecting outside standard variants.

#### **Input / Form Elements** (`src/shared/ui/input/Input.tsx`)

- **Action**: Form elements heavily rely on accessible border strategies and placeholder colors. Focus on adjusting rounded corners, inner spacing, and simple generic sizing classes.

#### **Card** (`src/shared/ui/layout/Card.tsx`)

- **Action**: Only manage structure classes (e.g. `p-6` or `border`).
- **What NOT to do**: Avoid injecting complex transitions natively directly unneeded on typical structural blocks. Treat Card identically to a standard `<div />` wrapper with safe visual rules.

#### **Layout Components** (`src/shared/ui/layout/*`)

- Ensure that you utilize composition (`<Stack />`, `<Grid />`). Never create bloated one-off classes for padding/margins when these foundational layout engines already exist.

**Anti-Pattern:** Do not over-engineer component variants. If a variant uniquely changes text length processing and layout flows simultaneously, build a higher-level feature component instead of complicating a fundamental primitives’ UI configuration.

---

## 5. Example Prompts

Paste these directly to your internal AI agent (Cursor, Copilot, etc.) to achieve rapid development with strong architecture alignment:

**Creating a Safe Page:**

> _"Create a new page slice for 'Dashboard'. Leverage a layout from `shared/ui` to structure it. Fetch the mock data via a new entity in `src/entities/dashboard-stats`, but expose the rendering structure strictly in a new Widget called `StatsOverview` in `src/widgets`. Adhere strictly to FSD structure and avoid business logic in the page component."_

**Simplifying UI:**

> _"Look at `src/shared/ui/feedback/Alert.tsx`. I want to add a new `toast` style visual variant called 'immersive'. Keep the CVA setup, do not replace the icons or disrupt current logic, merely return a new variant option relying on `bg-primary text-secondary`."_

**Using Agent Design Skills:**

> _"Use the `frontend-design` skill to generate a modern multi-column pricing dashboard layout. Output the layout pieces in `src/widgets/pricing/`. Ensure it complies with the existing Viteplate UI system constraints utilizing only available `shared/ui` primitives whenever possible."_

---

## 6. Combining System Practices

Successfully steering an agent requires understanding three distinct rules simultaneously:

1. **FSD Routing & Composition**: Business goes in features; UI composition handles layout.
2. **Minimal UI Styling (`cva`)**: Ensure Tailwind changes happen predictably inside variables instead of complex conditional Javascript variables.
3. **External Guidance (`skills`)**: Call out specific skills via agent integrations.

Combining them conceptually: Use **skills** like `web-design-guidelines` explicitly to review your layout and UI components' accessibility. Use an internal AI model to isolate those UI recommendations entirely to the `shared/ui/` slice, while building robust data retrieval via custom tanstack-query hooks hidden within `features/`.
