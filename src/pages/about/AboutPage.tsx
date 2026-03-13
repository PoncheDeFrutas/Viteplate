import { Link } from '@tanstack/react-router';
import { motion } from 'motion/react';
import {
    ArrowLeft,
    ArrowRight,
    Layers,
    ShieldCheck,
    AlertTriangle,
    Rocket,
    Target,
    Lock,
    RefreshCcw,
    UserCheck,
    KeyRound,
} from 'lucide-react';
import { ROUTE_PATHS } from '@shared/config';
import { FADE_UP, stagger } from '@shared/lib/animation-presets';
import { Button, Card, Container, Badge, Separator } from '@shared/ui';
import type { LucideIcon } from 'lucide-react';

// ---------------------------------------------------------------------------
// Implementation phases
// ---------------------------------------------------------------------------

interface Phase {
    number: number;
    title: string;
    description: string;
}

const PHASES: Phase[] = [
    {
        number: 1,
        title: 'Foundations',
        description:
            'Project scaffolding, Vite config, Tailwind CSS v4, path aliases, ESLint, Prettier, and the CSS design system.',
    },
    {
        number: 2,
        title: 'Entities',
        description:
            'Domain models for User and Session with Zod schemas, TypeScript types, and session adapter.',
    },
    {
        number: 3,
        title: 'Auth features',
        description:
            'Login/logout features with HTTP interceptors, token refresh controller, and error normalization.',
    },
    {
        number: 4,
        title: 'Providers',
        description:
            'QueryClient provider, theme provider with persistence, router context, and MSW conditional setup.',
    },
    {
        number: 5,
        title: 'Router & guards',
        description:
            'Code-based route tree, auth/guest/role guards, layout routes, and role-aware redirects.',
    },
    {
        number: 6,
        title: 'Pages',
        description:
            'All route-level pages: Home, About, Login, Dashboard, Admin, Viewer, NotFound, Unauthorized.',
    },
    {
        number: 7,
        title: 'Shared UI',
        description:
            'Component library: 35+ components across 6 categories (input, display, feedback, overlay, navigation, layout), built with CVA and Radix UI primitives.',
    },
    {
        number: 8,
        title: 'Testing',
        description:
            'Vitest + MSW integration tests covering login, logout, guards, session refresh — 21 tests passing.',
    },
];

// ---------------------------------------------------------------------------
// Auth model
// ---------------------------------------------------------------------------

interface AuthStep {
    title: string;
    description: string;
    icon: LucideIcon;
}

const AUTH_STEPS: AuthStep[] = [
    {
        title: 'Session store',
        description:
            'Zustand holds tokens, user profile, and role in memory. Provides setAccessToken, setUser, and clearSession actions. No browser storage is used — tokens live only in the JS runtime.',
        icon: KeyRound,
    },
    {
        title: 'Request interceptor',
        description:
            'Attaches Bearer token to every outgoing request via the session adapter. Tokens never appear in logs.',
        icon: Lock,
    },
    {
        title: 'Token refresh',
        description:
            'Single-flight refresh controller: on 401, queues concurrent requests, retries up to 2 times, then forces logout.',
        icon: RefreshCcw,
    },
    {
        title: 'Role-based guards',
        description:
            'beforeLoad guards check authentication and role. Unauthorized users redirect to /login or /unauthorized.',
        icon: UserCheck,
    },
];

// ---------------------------------------------------------------------------
// Anti-patterns
// ---------------------------------------------------------------------------

const ANTI_PATTERNS: string[] = [
    'Mixing Axios transport concerns with TanStack Query caching responsibilities',
    'Placing business logic directly in page components instead of features',
    'Violating FSD boundaries by importing upward or bypassing public APIs',
    'Duplicating retry logic in Axios when TanStack Query already handles it',
    'Using explicit any instead of unknown with proper narrowing',
    'Creating barrel files that add no architectural value',
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function AboutPage() {
    return (
        <Container maxWidth="2xl" className="space-y-16 py-24">
            {/* ─── Header ─── */}
            <motion.header {...FADE_UP} className="space-y-4 text-center">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                    About Viteplate
                </h1>
                <p className="mx-auto max-w-lg text-muted-foreground">
                    A production-ready starter template and living architectural reference for
                    scalable React applications. Every design decision is intentional.
                </p>
            </motion.header>

            <Separator />

            {/* ─── Project Goals ─── */}
            <motion.section
                {...FADE_UP}
                transition={{ ...FADE_UP.transition, delay: 0.1 }}
                className="space-y-6"
            >
                <div className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-foreground" />
                    <h2 className="text-xl font-bold text-foreground">Project Goals</h2>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                    {[
                        {
                            title: 'Reusable foundation',
                            text: 'Clone and start building immediately with a clean, tested architecture that scales.',
                        },
                        {
                            title: 'Architectural reference',
                            text: 'Every pattern demonstrated here — from FSD layers to auth flows — serves as documentation.',
                        },
                        {
                            title: 'Strict conventions',
                            text: 'Named exports only, type-only imports, kebab-case files, zero any — enforced by tooling.',
                        },
                        {
                            title: 'Minimal dependencies',
                            text: 'Every dependency is justified by clear architectural value. No bloat, no unnecessary abstractions.',
                        },
                    ].map((goal, i) => (
                        <motion.div key={goal.title} {...stagger(i)}>
                            <Card padding="sm" className="h-full">
                                <p className="text-sm font-medium text-foreground">{goal.title}</p>
                                <p className="mt-1 text-sm text-muted-foreground">{goal.text}</p>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </motion.section>

            <Separator />

            {/* ─── Implementation Phases ─── */}
            <motion.section
                {...FADE_UP}
                transition={{ ...FADE_UP.transition, delay: 0.15 }}
                className="space-y-6"
            >
                <div className="flex items-center gap-2">
                    <Rocket className="h-5 w-5 text-foreground" />
                    <h2 className="text-xl font-bold text-foreground">Implementation Phases</h2>
                </div>
                <p className="text-sm text-muted-foreground">
                    Viteplate was built in 8 incremental phases, each adding a specific
                    architectural layer.
                </p>

                <div className="space-y-3">
                    {PHASES.map((phase, i) => (
                        <motion.div key={phase.number} {...stagger(i)}>
                            <Card padding="sm">
                                <div className="flex items-start gap-3">
                                    <Badge variant="secondary" className="mt-0.5 shrink-0">
                                        {phase.number}
                                    </Badge>
                                    <div>
                                        <p className="text-sm font-medium text-foreground">
                                            {phase.title}
                                        </p>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            {phase.description}
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </motion.section>

            <Separator />

            {/* ─── Auth Model ─── */}
            <motion.section
                {...FADE_UP}
                transition={{ ...FADE_UP.transition, delay: 0.2 }}
                className="space-y-6"
            >
                <div className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-foreground" />
                    <h2 className="text-xl font-bold text-foreground">Auth Model</h2>
                </div>
                <p className="text-sm text-muted-foreground">
                    JWT-based authentication with role-based access control, built across four
                    interconnected layers.
                </p>

                <div className="grid gap-4 sm:grid-cols-2">
                    {AUTH_STEPS.map((step, i) => {
                        const Icon = step.icon;
                        return (
                            <motion.div key={step.title} {...stagger(i)}>
                                <Card padding="sm" className="h-full">
                                    <div className="flex items-start gap-3">
                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted text-foreground">
                                            <Icon className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-foreground">
                                                {step.title}
                                            </p>
                                            <p className="mt-1 text-sm text-muted-foreground">
                                                {step.description}
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

            {/* ─── Architecture Quick Reference ─── */}
            <motion.section
                {...FADE_UP}
                transition={{ ...FADE_UP.transition, delay: 0.25 }}
                className="space-y-4"
            >
                <div className="flex items-center gap-2">
                    <Layers className="h-5 w-5 text-foreground" />
                    <h2 className="text-xl font-bold text-foreground">FSD at a Glance</h2>
                </div>
                <Card padding="md">
                    <code className="block text-center text-sm leading-relaxed text-muted-foreground">
                        app &rarr; pages &rarr; widgets &rarr; features &rarr; entities &rarr;
                        shared
                    </code>
                    <p className="mt-3 text-center text-sm text-muted-foreground">
                        Every layer may only import from the layers below it. Cross-slice
                        communication flows through public barrel APIs, keeping coupling minimal and
                        the dependency graph predictable.
                    </p>
                </Card>
            </motion.section>

            <Separator />

            {/* ─── Anti-Patterns ─── */}
            <motion.section
                {...FADE_UP}
                transition={{ ...FADE_UP.transition, delay: 0.3 }}
                className="space-y-4"
            >
                <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-warning" />
                    <h2 className="text-xl font-bold text-foreground">Anti-Patterns to Avoid</h2>
                </div>

                <Card padding="md">
                    <ul className="space-y-2">
                        {ANTI_PATTERNS.map((ap, i) => (
                            <motion.li
                                key={i}
                                {...stagger(i)}
                                className="flex items-start gap-2 text-sm text-muted-foreground"
                            >
                                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-warning" />
                                {ap}
                            </motion.li>
                        ))}
                    </ul>
                </Card>
            </motion.section>

            {/* ─── Navigation ─── */}
            <motion.div
                {...FADE_UP}
                transition={{ ...FADE_UP.transition, delay: 0.35 }}
                className="flex items-center justify-center gap-4"
            >
                <Link to={ROUTE_PATHS.home}>
                    <Button variant="outline">
                        <ArrowLeft className="h-4 w-4" />
                        Home
                    </Button>
                </Link>
                <Link to={ROUTE_PATHS.stack}>
                    <Button variant="outline">
                        Tech Stack
                        <ArrowRight className="h-4 w-4" />
                    </Button>
                </Link>
            </motion.div>
        </Container>
    );
}
