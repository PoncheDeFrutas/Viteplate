import { Link } from '@tanstack/react-router';
import { motion } from 'motion/react';
import {
    Layers,
    Route,
    Wrench,
    ArrowRight,
    Sparkles,
    ShieldCheck,
    FileCode2,
    Ban,
    GitBranch,
    ArrowDown,
} from 'lucide-react';
import { ROUTE_PATHS } from '@shared/config';
import { FADE_UP, stagger } from '@shared/lib/animation-presets';
import { Button, Card, Container, Badge, Separator } from '@shared/ui';
import type { LucideIcon } from 'lucide-react';

// ---------------------------------------------------------------------------
// Highlights data
// ---------------------------------------------------------------------------

interface Highlight {
    title: string;
    description: string;
    icon: LucideIcon;
}

const HIGHLIGHTS: Highlight[] = [
    {
        title: 'Feature-Sliced Design',
        description:
            'Organized by business domain with strict layer boundaries that keep the codebase navigable as it grows.',
        icon: Layers,
    },
    {
        title: 'Type-Safe Routing',
        description:
            'TanStack Router with code-based route definitions, role guards, and full TypeScript inference.',
        icon: Route,
    },
    {
        title: 'Modern Tooling',
        description:
            'Vite 7, Tailwind CSS v4, Zod 4, Zustand, and Vitest with MSW for fast, reliable development.',
        icon: Wrench,
    },
];

// ---------------------------------------------------------------------------
// FSD Layers
// ---------------------------------------------------------------------------

const FSD_LAYERS = [
    {
        name: 'app',
        description: 'Bootstrap, providers, router, guards, global error handling',
        color: 'bg-info/15 text-info border-info/25',
    },
    {
        name: 'pages',
        description: 'Thin route-level composition — no direct HTTP or complex logic',
        color: 'bg-success/15 text-success border-success/25',
    },
    {
        name: 'widgets',
        description: 'Reusable compositions of features, entities, and shared UI',
        color: 'bg-warning/15 text-warning border-warning/25',
    },
    {
        name: 'features',
        description: 'Business use cases like login, search, toggle-theme',
        color: 'bg-destructive/15 text-destructive border-destructive/25',
    },
    {
        name: 'entities',
        description: 'Domain concepts like user and session',
        color: 'bg-info/15 text-info border-info/25',
    },
    {
        name: 'shared',
        description: 'Domain-agnostic infrastructure, UI primitives, config, types',
        color: 'bg-muted text-muted-foreground border-border',
    },
];

// ---------------------------------------------------------------------------
// Core principles
// ---------------------------------------------------------------------------

interface Principle {
    title: string;
    description: string;
    icon: LucideIcon;
}

const PRINCIPLES: Principle[] = [
    {
        title: 'Strict layer dependencies',
        description:
            'Each FSD layer may only import from the layers below it. Cross-slice communication flows through public barrel APIs.',
        icon: GitBranch,
    },
    {
        title: 'Zero any policy',
        description:
            'Never use explicit any. Use unknown and narrow with type guards or Zod schemas for runtime validation.',
        icon: ShieldCheck,
    },
    {
        title: 'Separation of concerns',
        description:
            'Every library has a single, non-overlapping responsibility. Axios transports, Query caches, Router navigates, Zustand stores.',
        icon: FileCode2,
    },
    {
        title: 'No anti-patterns',
        description:
            'No business logic in pages, no FSD boundary violations, no duplicated retry logic, no mixing Axios with Query responsibilities.',
        icon: Ban,
    },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function HomePage() {
    return (
        <Container maxWidth="2xl" className="relative space-y-20 py-24">
            {/* Decorative dot-grid background */}
            <div
                aria-hidden="true"
                className="dot-grid pointer-events-none absolute inset-0 opacity-40"
            />

            {/* ─── Hero ─── */}
            <section className="relative space-y-6 text-center">
                <motion.div {...FADE_UP}>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                        <Sparkles className="h-3 w-3" />
                        Starter template
                    </span>
                </motion.div>

                <motion.h1
                    {...FADE_UP}
                    transition={{ ...FADE_UP.transition, delay: 0.1 }}
                    className="bg-linear-to-r from-foreground to-muted-foreground bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl"
                >
                    Viteplate
                </motion.h1>

                <motion.p
                    {...FADE_UP}
                    transition={{ ...FADE_UP.transition, delay: 0.2 }}
                    className="mx-auto max-w-lg text-lg text-muted-foreground"
                >
                    A scalable React&nbsp;19 foundation built on Feature&#8209;Sliced Design.
                    Production&#8209;ready architecture, strict TypeScript, and modern tooling.
                </motion.p>

                <motion.div
                    {...FADE_UP}
                    transition={{ ...FADE_UP.transition, delay: 0.3 }}
                    className="flex items-center justify-center gap-4 pt-2"
                >
                    <Link to={ROUTE_PATHS.login}>
                        <Button size="lg">
                            Sign in
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    </Link>
                    <Link to={ROUTE_PATHS.about}>
                        <Button variant="outline" size="lg">
                            Learn more
                        </Button>
                    </Link>
                </motion.div>
            </section>

            {/* ─── Highlight cards ─── */}
            <section className="relative grid gap-6 sm:grid-cols-3">
                {HIGHLIGHTS.map((item, i) => {
                    const Icon = item.icon;
                    return (
                        <motion.div key={item.title} {...stagger(i, 0.1, 0.1)}>
                            <Card interactive padding="md" className="h-full text-left">
                                <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-md bg-muted text-foreground">
                                    <Icon className="h-4 w-4" />
                                </div>
                                <h3 className="text-sm font-semibold text-foreground">
                                    {item.title}
                                </h3>
                                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                    {item.description}
                                </p>
                            </Card>
                        </motion.div>
                    );
                })}
            </section>

            <Separator />

            {/* ─── FSD Architecture ─── */}
            <motion.section
                {...FADE_UP}
                transition={{ ...FADE_UP.transition, delay: 0.15 }}
                className="relative space-y-6"
            >
                <div className="text-center">
                    <h2 className="text-2xl font-bold tracking-tight text-foreground">
                        Architecture
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Feature&#8209;Sliced Design organizes code into layers with strict
                        downward&#8209;only dependencies.
                    </p>
                </div>

                <div className="mx-auto max-w-md space-y-2">
                    {FSD_LAYERS.map((layer, i) => (
                        <motion.div key={layer.name} {...stagger(i, 0.1, 0.1)}>
                            <div
                                className={`flex items-center gap-3 rounded-lg border px-4 py-3 ${layer.color}`}
                            >
                                <code className="w-20 text-sm font-semibold">{layer.name}</code>
                                <span className="text-xs opacity-80">{layer.description}</span>
                            </div>
                            {i < FSD_LAYERS.length - 1 && (
                                <div className="flex justify-center py-1 text-muted-foreground">
                                    <ArrowDown className="h-3.5 w-3.5" />
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            </motion.section>

            <Separator />

            {/* ─── Core Principles ─── */}
            <motion.section
                {...FADE_UP}
                transition={{ ...FADE_UP.transition, delay: 0.2 }}
                className="relative space-y-6"
            >
                <div className="text-center">
                    <h2 className="text-2xl font-bold tracking-tight text-foreground">
                        Core Principles
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Rules that every change must follow to preserve architectural integrity.
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    {PRINCIPLES.map((p, i) => {
                        const Icon = p.icon;
                        return (
                            <motion.div key={p.title} {...stagger(i, 0.1, 0.1)}>
                                <Card padding="sm" className="h-full">
                                    <div className="flex items-start gap-3">
                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted text-foreground">
                                            <Icon className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-foreground">
                                                {p.title}
                                            </p>
                                            <p className="mt-1 text-sm text-muted-foreground">
                                                {p.description}
                                            </p>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        );
                    })}
                </div>
            </motion.section>

            <Separator />

            {/* ─── Explore CTAs ─── */}
            <motion.section
                {...FADE_UP}
                transition={{ ...FADE_UP.transition, delay: 0.25 }}
                className="relative space-y-6"
            >
                <div className="text-center">
                    <h2 className="text-2xl font-bold tracking-tight text-foreground">
                        Explore More
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Dive deeper into the project details.
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <Link to={ROUTE_PATHS.about} className="block">
                        <Card interactive padding="md" className="h-full">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-semibold text-foreground">About</p>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        Implementation phases, auth model, and project goals.
                                    </p>
                                </div>
                                <Badge variant="outline">
                                    <ArrowRight className="h-3 w-3" />
                                </Badge>
                            </div>
                        </Card>
                    </Link>
                    <Link to={ROUTE_PATHS.stack} className="block">
                        <Card interactive padding="md" className="h-full">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-semibold text-foreground">
                                        Tech Stack
                                    </p>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        Library responsibilities and separation of concerns.
                                    </p>
                                </div>
                                <Badge variant="outline">
                                    <ArrowRight className="h-3 w-3" />
                                </Badge>
                            </div>
                        </Card>
                    </Link>
                </div>
            </motion.section>
        </Container>
    );
}
