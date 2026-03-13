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
    },
    {
        name: 'pages',
        description: 'Thin route-level composition — no direct HTTP or complex logic',
    },
    {
        name: 'widgets',
        description: 'Reusable compositions of features, entities, and shared UI',
    },
    {
        name: 'features',
        description: 'Business use cases like login, search, toggle-theme',
    },
    {
        name: 'entities',
        description: 'Domain concepts like user and session',
    },
    {
        name: 'shared',
        description: 'Domain-agnostic infrastructure, UI primitives, config, types',
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

const PROOF_POINTS = [
    { label: 'React + TypeScript', value: '19 + strict' },
    { label: 'Architecture', value: 'FSD-first' },
    { label: 'Libraries', value: 'Single-purpose' },
] as const;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function HomePage() {
    return (
        <Container maxWidth="2xl" className="relative space-y-20 py-20 sm:py-24">
            <div
                aria-hidden="true"
                className="dot-grid pointer-events-none absolute inset-0 opacity-35"
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute top-6 right-[-8rem] h-64 w-64 rounded-full bg-foreground/5 blur-3xl"
            />

            {/* ─── Hero ─── */}
            <section className="relative overflow-hidden rounded-2xl border border-border/80 bg-card/70 px-6 py-12 text-center shadow-sm sm:px-10 sm:py-16">
                <motion.div {...FADE_UP}>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
                        <Sparkles className="h-3 w-3" />
                        Production starter template
                    </span>
                </motion.div>

                <motion.h1
                    {...FADE_UP}
                    transition={{ ...FADE_UP.transition, delay: 0.1 }}
                    className="mx-auto max-w-3xl bg-linear-to-r from-foreground to-muted-foreground bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-6xl"
                >
                    Viteplate: build serious React products without architectural drift.
                </motion.h1>

                <motion.p
                    {...FADE_UP}
                    transition={{ ...FADE_UP.transition, delay: 0.2 }}
                    className="mx-auto max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg"
                >
                    Viteplate gives you a clean foundation from day one: Feature-Sliced Design,
                    strict TypeScript, resilient auth infrastructure, and battle-tested tooling.
                </motion.p>

                <motion.div
                    {...FADE_UP}
                    transition={{ ...FADE_UP.transition, delay: 0.3 }}
                    className="flex flex-wrap items-center justify-center gap-3 pt-2"
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

                <motion.div
                    {...FADE_UP}
                    transition={{ ...FADE_UP.transition, delay: 0.4 }}
                    className="mt-8 grid gap-3 sm:grid-cols-3"
                >
                    {PROOF_POINTS.map((item) => (
                        <Card key={item.label} padding="sm" className="bg-background/70 text-left">
                            <p className="text-xs uppercase tracking-wide text-muted-foreground">
                                {item.label}
                            </p>
                            <p className="mt-1 text-sm font-semibold text-foreground">
                                {item.value}
                            </p>
                        </Card>
                    ))}
                </motion.div>
            </section>

            {/* ─── Highlight cards ─── */}
            <section className="relative grid gap-6 sm:grid-cols-3">
                {HIGHLIGHTS.map((item, i) => {
                    const Icon = item.icon;
                    return (
                        <motion.div key={item.title} {...stagger(i, 0.1, 0.1)}>
                            <Card
                                interactive
                                padding="md"
                                className="h-full border-border/80 bg-card/80 text-left"
                            >
                                <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background text-foreground">
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

                <div className="relative mx-auto max-w-4xl rounded-2xl border border-border/80 bg-card/70 p-5 shadow-sm sm:p-6">
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-x-8 top-9 h-px bg-linear-to-r from-transparent via-border to-transparent"
                    />

                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {FSD_LAYERS.map((layer, i) => (
                            <motion.div key={layer.name} {...stagger(i, 0.1, 0.1)}>
                                <div className="relative h-full rounded-xl border border-border/80 bg-background/70 p-4 backdrop-blur">
                                    <span className="absolute top-[-0.6rem] left-4 rounded-full border border-border bg-background px-2 py-0.5 text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">
                                        L{i + 1}
                                    </span>

                                    <p className="text-sm font-semibold text-foreground">
                                        {layer.name}
                                    </p>
                                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                                        {layer.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
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
                                <Card padding="sm" className="h-full border-border/80 bg-card/80">
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
                        <Card
                            interactive
                            padding="md"
                            className="h-full border-border/80 bg-card/80"
                        >
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
                        <Card
                            interactive
                            padding="md"
                            className="h-full border-border/80 bg-card/80"
                        >
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
