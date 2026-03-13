import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { motion } from 'motion/react';
import {
    Atom,
    FileCode2,
    Zap,
    Route as RouteIcon,
    Database,
    Box,
    Shield,
    FlaskConical,
    Paintbrush,
    ArrowLeft,
    ArrowRight,
    Shuffle,
    Check,
    X,
} from 'lucide-react';
import { ROUTE_PATHS } from '@shared/config';
import { FADE_UP, stagger } from '@shared/lib/animation-presets';
import {
    Button,
    Card,
    Container,
    Badge,
    Separator,
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
} from '@shared/ui';
import type { LucideIcon } from 'lucide-react';

// ---------------------------------------------------------------------------
// Stack data with responsibility details
// ---------------------------------------------------------------------------

interface StackEntry {
    category: StackCategory;
    name: string;
    version: string;
    icon: LucideIcon;
    role: string;
    responsibilities: string[];
    doesNot: string[];
}

type StackCategory =
    | 'runtime'
    | 'data'
    | 'routing'
    | 'state'
    | 'validation'
    | 'tooling'
    | 'testing';

const CATEGORY_LABELS: Record<StackCategory, string> = {
    runtime: 'Runtime',
    data: 'Data layer',
    routing: 'Routing',
    state: 'State',
    validation: 'Validation',
    tooling: 'Tooling',
    testing: 'Testing',
};

const CATEGORY_ORDER: StackCategory[] = [
    'runtime',
    'data',
    'routing',
    'state',
    'validation',
    'tooling',
    'testing',
];

const STACK_ENTRIES: StackEntry[] = [
    {
        category: 'data',
        name: 'Axios',
        version: '1.x',
        icon: Shuffle,
        role: 'HTTP transport layer',
        responsibilities: [
            'Sends HTTP requests and receives responses',
            'Manages request/response interceptors',
            'Handles timeouts and cancellation',
            'Normalizes errors to ApiError via normalizeApiError()',
        ],
        doesNot: [
            'Cache responses (TanStack Query does that)',
            'Manage retry logic for queries (TanStack Query does that)',
            'Store or manage UI state',
        ],
    },
    {
        category: 'data',
        name: 'TanStack Query',
        version: '5.x',
        icon: Database,
        role: 'Async state manager',
        responsibilities: [
            'Caches server data and deduplicates requests',
            'Manages loading, error, and success states',
            'Handles background refetches and stale-while-revalidate',
            'Provides retry logic for failed queries',
        ],
        doesNot: [
            'Make HTTP calls directly (Axios does that)',
            'Handle auth token refresh (interceptors do that)',
            'Manage client-only state',
        ],
    },
    {
        category: 'routing',
        name: 'TanStack Router',
        version: '1.x',
        icon: RouteIcon,
        role: 'Type-safe routing',
        responsibilities: [
            'Defines routes via code (not file-based)',
            'Runs beforeLoad guards for auth and role checks',
            'Provides full TypeScript inference for routes',
            'Manages navigation and redirects',
        ],
        doesNot: [
            'Manage auth state (Zustand does that)',
            'Fetch data (TanStack Query does that)',
            'Define UI components',
        ],
    },
    {
        category: 'state',
        name: 'Zustand',
        version: '5.x',
        icon: Box,
        role: 'Client state management',
        responsibilities: [
            'Holds session state (user, tokens, role) in memory',
            'Provides hooks like useSession for reactive access',
            'Exposes setAccessToken, setUser, clearSession actions',
            'Vanilla store enables framework-agnostic access',
        ],
        doesNot: [
            'Fetch data from the server',
            'Handle routing or navigation',
            'Replace TanStack Query for server state',
        ],
    },
    {
        category: 'validation',
        name: 'Zod',
        version: '4.x',
        icon: Shield,
        role: 'Runtime validation',
        responsibilities: [
            'Validates API responses at runtime',
            'Validates environment variables with safeParse',
            'Provides parseWithSchema() utility for strict parsing',
            'Generates TypeScript types from schemas via z.infer',
        ],
        doesNot: [
            'Replace TypeScript static types',
            'Make HTTP requests',
            'Handle error display in UI',
        ],
    },
    {
        category: 'runtime',
        name: 'React',
        version: '19',
        icon: Atom,
        role: 'UI framework',
        responsibilities: [
            'Renders components and manages component lifecycle',
            'Provides hooks for state and effects',
            'Supports concurrent features for smooth UX',
            'Handles the view layer exclusively',
        ],
        doesNot: [
            'Manage global state (Zustand does that)',
            'Fetch data (TanStack Query does that)',
            'Handle routing (TanStack Router does that)',
        ],
    },
    {
        category: 'tooling',
        name: 'TypeScript',
        version: '~5.9',
        icon: FileCode2,
        role: 'Type system',
        responsibilities: [
            'Strict mode with zero implicit any',
            'Type-only imports via verbatimModuleSyntax',
            'Full inference for routes, schemas, and stores',
            'Catches bugs at compile time, not runtime',
        ],
        doesNot: [
            'Validate data at runtime (Zod does that)',
            'Replace unit tests',
            'Run in production (compiled to JS)',
        ],
    },
    {
        category: 'tooling',
        name: 'Vite',
        version: '7',
        icon: Zap,
        role: 'Build tool',
        responsibilities: [
            'Provides instant dev server with HMR',
            'Bundles for production with Rollup',
            'Integrates Tailwind CSS v4 plugin',
            'Resolves FSD path aliases',
        ],
        doesNot: [
            'Lint code (ESLint does that)',
            'Format code (Prettier does that)',
            'Run tests (Vitest does that)',
        ],
    },
    {
        category: 'tooling',
        name: 'Tailwind CSS',
        version: 'v4',
        icon: Paintbrush,
        role: 'Styling framework',
        responsibilities: [
            'Utility-first CSS via @theme and design tokens',
            'Dark mode via .dark class variant',
            'Responsive design with breakpoint prefixes',
            'Class sorting via prettier-plugin-tailwindcss',
        ],
        doesNot: [
            'Manage theme state (useTheme hook does that)',
            'Provide component logic',
            'Replace semantic CSS tokens for theming',
        ],
    },
    {
        category: 'testing',
        name: 'Vitest + MSW',
        version: '4.x + 2.x',
        icon: FlaskConical,
        role: 'Testing infrastructure',
        responsibilities: [
            'Unit and integration tests with globals: true',
            'jsdom environment for React component testing',
            'MSW intercepts HTTP for realistic API mocking',
            'onUnhandledRequest: error ensures no leaks',
        ],
        doesNot: [
            'Replace E2E tests (Playwright/Cypress for that)',
            'Test visual regressions',
            'Run in production',
        ],
    },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function StackPage() {
    const [activeCategory, setActiveCategory] = useState<StackCategory>('runtime');

    return (
        <Container maxWidth="2xl" className="relative space-y-12 py-20 sm:py-24">
            <div
                aria-hidden="true"
                className="pointer-events-none absolute top-10 right-[-7rem] h-56 w-56 rounded-full bg-foreground/5 blur-3xl"
            />

            {/* Header */}
            <motion.header
                {...FADE_UP}
                className="space-y-4 rounded-2xl border border-border/80 bg-card/70 px-6 py-12 text-center shadow-sm sm:px-10"
            >
                <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    Built on deliberate choices
                </p>
                <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                    Tech Stack
                </h1>
                <p className="mx-auto max-w-2xl text-muted-foreground">
                    Each library has a clear, non-overlapping responsibility. Here is exactly what
                    each tool does&mdash;and what it deliberately does not do.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                    {CATEGORY_ORDER.map((category) => (
                        <Badge
                            key={category}
                            variant={category === activeCategory ? 'secondary' : 'outline'}
                        >
                            {CATEGORY_LABELS[category]}
                        </Badge>
                    ))}
                </div>
            </motion.header>

            <Separator />

            {/* Stack entries */}
            <Tabs
                value={activeCategory}
                onValueChange={(value) => setActiveCategory(value as StackCategory)}
                animated
            >
                <TabsList className="mb-6 flex h-auto flex-wrap justify-start gap-1 rounded-xl border border-border/80 bg-card/70 p-1">
                    {CATEGORY_ORDER.map((category) => (
                        <TabsTrigger key={category} value={category} className="rounded-lg">
                            {CATEGORY_LABELS[category]}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {CATEGORY_ORDER.map((category) => {
                    const entries = STACK_ENTRIES.filter((entry) => entry.category === category);

                    return (
                        <TabsContent key={category} value={category} className="mt-0">
                            <div className="mb-4 flex items-center justify-between">
                                <Badge variant="secondary">{CATEGORY_LABELS[category]}</Badge>
                                <span className="text-xs text-muted-foreground">
                                    {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
                                </span>
                            </div>

                            <div className="grid gap-4 lg:grid-cols-2">
                                {entries.map((entry, i) => {
                                    const Icon = entry.icon;

                                    return (
                                        <motion.div key={entry.name} {...stagger(i, 0.08, 0.08)}>
                                            <Card
                                                padding="md"
                                                className="h-full border-border/80 bg-card/80 transition-colors hover:border-foreground/20"
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border bg-background text-foreground">
                                                        <Icon className="h-4 w-4" />
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            <h2 className="text-base font-semibold text-foreground">
                                                                {entry.name}
                                                            </h2>
                                                            <Badge variant="secondary">
                                                                {entry.version}
                                                            </Badge>
                                                        </div>
                                                        <p className="mt-1 text-sm text-muted-foreground">
                                                            {entry.role}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                                                    <div className="rounded-lg border border-success/20 bg-success/5 p-3">
                                                        <p className="text-[11px] font-semibold tracking-wide text-success uppercase">
                                                            Owns
                                                        </p>
                                                        <ul className="mt-2 space-y-1.5">
                                                            {entry.responsibilities.map((item) => (
                                                                <li
                                                                    key={item}
                                                                    className="flex items-start gap-2 text-xs text-muted-foreground"
                                                                >
                                                                    <Check className="mt-0.5 h-3 w-3 shrink-0 text-success" />
                                                                    {item}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>

                                                    <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3">
                                                        <p className="text-[11px] font-semibold tracking-wide text-destructive uppercase">
                                                            Avoids
                                                        </p>
                                                        <ul className="mt-2 space-y-1.5">
                                                            {entry.doesNot.map((item) => (
                                                                <li
                                                                    key={item}
                                                                    className="flex items-start gap-2 text-xs text-muted-foreground"
                                                                >
                                                                    <X className="mt-0.5 h-3 w-3 shrink-0 text-destructive" />
                                                                    {item}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>
                                            </Card>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </TabsContent>
                    );
                })}
            </Tabs>

            {/* Navigation */}
            <motion.div
                {...FADE_UP}
                transition={{ ...FADE_UP.transition, delay: 0.4 }}
                className="flex items-center justify-center gap-4"
            >
                <Link to={ROUTE_PATHS.about}>
                    <Button variant="outline">
                        <ArrowLeft className="h-4 w-4" />
                        About
                    </Button>
                </Link>
                <Link to={ROUTE_PATHS.home}>
                    <Button variant="outline">
                        Home
                        <ArrowRight className="h-4 w-4" />
                    </Button>
                </Link>
            </motion.div>
        </Container>
    );
}
