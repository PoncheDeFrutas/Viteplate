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
import { Button, Card, Container, Badge, Separator } from '@shared/ui';
import type { LucideIcon } from 'lucide-react';

// ---------------------------------------------------------------------------
// Animation presets
// ---------------------------------------------------------------------------

const FADE_UP = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
} as const;

function stagger(index: number) {
    return { ...FADE_UP, transition: { ...FADE_UP.transition, delay: 0.05 + index * 0.06 } };
}

// ---------------------------------------------------------------------------
// Stack data with responsibility details
// ---------------------------------------------------------------------------

interface StackEntry {
    name: string;
    version: string;
    icon: LucideIcon;
    role: string;
    responsibilities: string[];
    doesNot: string[];
}

const STACK_ENTRIES: StackEntry[] = [
    {
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
        name: 'Zustand',
        version: '5.x',
        icon: Box,
        role: 'Client state management',
        responsibilities: [
            'Holds session state (user, tokens, role)',
            'Provides hooks like useSession for reactive access',
            'Persists and hydrates session via sessionStorage',
            'Exposes login/logout/setSession actions',
        ],
        doesNot: [
            'Fetch data from the server',
            'Handle routing or navigation',
            'Replace TanStack Query for server state',
        ],
    },
    {
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
    return (
        <Container maxWidth="2xl" className="space-y-12 py-24">
            {/* Header */}
            <motion.header {...FADE_UP} className="space-y-4 text-center">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Tech Stack</h1>
                <p className="mx-auto max-w-lg text-muted-foreground">
                    Each library has a clear, non-overlapping responsibility. Here is exactly what
                    each tool does&mdash;and what it deliberately does not do.
                </p>
            </motion.header>

            <Separator />

            {/* Stack entries */}
            <div className="space-y-6">
                {STACK_ENTRIES.map((entry, i) => {
                    const Icon = entry.icon;
                    return (
                        <motion.div key={entry.name} {...stagger(i)}>
                            <Card padding="md" className="space-y-4">
                                {/* Title row */}
                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-muted text-foreground">
                                        <Icon className="h-4 w-4" />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <h2 className="text-base font-semibold text-foreground">
                                            {entry.name}
                                        </h2>
                                        <Badge variant="secondary">{entry.version}</Badge>
                                    </div>
                                    <Badge variant="outline" className="ml-auto hidden sm:flex">
                                        {entry.role}
                                    </Badge>
                                </div>

                                {/* Role (visible on small screens) */}
                                <p className="text-sm text-muted-foreground sm:hidden">
                                    {entry.role}
                                </p>

                                {/* Responsibilities grid */}
                                <div className="grid gap-4 sm:grid-cols-2">
                                    {/* Does */}
                                    <div className="space-y-2">
                                        <span className="text-xs font-medium uppercase tracking-wider text-success">
                                            Responsibilities
                                        </span>
                                        <ul className="space-y-1.5">
                                            {entry.responsibilities.map((r) => (
                                                <li
                                                    key={r}
                                                    className="flex items-start gap-2 text-sm text-muted-foreground"
                                                >
                                                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" />
                                                    {r}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Does not */}
                                    <div className="space-y-2">
                                        <span className="text-xs font-medium uppercase tracking-wider text-destructive">
                                            Does not
                                        </span>
                                        <ul className="space-y-1.5">
                                            {entry.doesNot.map((d) => (
                                                <li
                                                    key={d}
                                                    className="flex items-start gap-2 text-sm text-muted-foreground"
                                                >
                                                    <X className="mt-0.5 h-3.5 w-3.5 shrink-0 text-destructive" />
                                                    {d}
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
