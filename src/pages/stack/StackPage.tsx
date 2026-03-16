import { Link } from '@tanstack/react-router';
import { motion } from 'motion/react';
import {
    ArrowLeft,
    ArrowRight,
    Braces,
    Check,
    FlaskConical,
    GitBranch,
    Shield,
} from 'lucide-react';
import { ROUTE_PATHS } from '@shared/config';
import { useMotionPresets } from '@shared/lib/motion';
import { Button } from '@shared/ui';

const STACK_GROUPS = [
    {
        title: 'Core Runtime',
        tools: 'React 19, TypeScript 5.9, Vite 7, Tailwind CSS v4',
    },
    {
        title: 'Data + Navigation',
        tools: 'TanStack Query, TanStack Router, TanStack Form, Axios',
    },
    {
        title: 'State + Validation',
        tools: 'Zustand for session and UI globals, Zod for runtime validation',
    },
    {
        title: 'Quality + Tooling',
        tools: 'Vitest, MSW, ESLint 9, Prettier 3, Husky, lint-staged',
    },
] as const;

const DEPENDENCY_RULES = [
    'Dependency direction is fixed: app -> pages -> widgets -> features -> entities -> shared',
    'Cross-slice access must pass through public APIs (index.ts)',
    'No deep imports into another slice internals',
    'Shared UI stays domain-agnostic and free of business logic',
] as const;

const BUILD_GATES = ['pnpm lint', 'pnpm check-types', 'pnpm build', 'pnpm test -- --run'] as const;

const AUTH_GUARDRAILS = [
    'JWT attach/refresh/retry/logout remains centralized in shared HTTP auth modules',
    'Refresh flow must preserve single-flight behavior and bounded retries',
    'Unrecoverable refresh failure clears session safely',
    'Role-based route protection is enforced by route guards',
] as const;

export function StackPage() {
    const motionFx = useMotionPresets();

    return (
        <div className="public-shell">
            <section className="public-frame py-10 sm:py-14 lg:py-16">
                <div className="public-grid">
                    <div className="col-span-12 space-y-5 lg:col-span-8">
                        <motion.p {...motionFx.reveal()} className="public-kicker">
                            Stack Architecture
                        </motion.p>
                        <motion.h1
                            {...motionFx.reveal({ delay: 0.05 })}
                            className="public-heading max-w-5xl text-4xl font-semibold text-foreground sm:text-6xl"
                        >
                            A strict technical stack designed for predictable template generation.
                        </motion.h1>
                        <motion.p
                            {...motionFx.reveal({ delay: 0.1 })}
                            className="max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-xl"
                        >
                            The stack is intentionally opinionated. Each tool has explicit
                            responsibilities so teams can ship quickly without cross-layer entropy.
                        </motion.p>
                    </div>

                    <div className="col-span-12 self-end lg:col-span-4">
                        <motion.div
                            {...motionFx.reveal({ delay: 0.12 })}
                            className="retro-panel rounded-sm p-5"
                        >
                            <p className="public-kicker">Package Manager</p>
                            <p className="mt-2 text-xl font-semibold text-foreground">pnpm</p>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Keep dependency workflows consistent across local development and
                                CI.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            <section className="public-band py-12 sm:py-14 lg:py-16">
                <div className="public-frame public-grid">
                    <div className="col-span-12 lg:col-span-4">
                        <motion.p {...motionFx.reveal()} className="public-kicker">
                            Stack Snapshot
                        </motion.p>
                        <motion.h2
                            {...motionFx.reveal({ delay: 0.05 })}
                            className="public-heading mt-3 max-w-xl text-3xl font-semibold text-foreground sm:text-4xl"
                        >
                            Tooling selected for role clarity and maintainability
                        </motion.h2>
                    </div>

                    <div className="col-span-12 grid gap-3 sm:grid-cols-2 lg:col-span-8">
                        {STACK_GROUPS.map((group, index) => (
                            <motion.article
                                key={group.title}
                                {...motionFx.sequence(index, 0.08, 0.06)}
                                className="retro-panel rounded-sm p-5"
                            >
                                <h3 className="text-base font-semibold text-foreground">
                                    {group.title}
                                </h3>
                                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                    {group.tools}
                                </p>
                            </motion.article>
                        ))}
                    </div>
                </div>
            </section>

            <section className="public-band bg-card/40 py-12 sm:py-14 lg:py-16">
                <div className="public-frame public-grid">
                    <div className="col-span-12 lg:col-span-4">
                        <motion.p {...motionFx.reveal()} className="public-kicker">
                            FSD Rules
                        </motion.p>
                        <motion.h2
                            {...motionFx.reveal({ delay: 0.05 })}
                            className="public-heading mt-3 max-w-xl text-3xl font-semibold text-foreground sm:text-4xl"
                        >
                            Structural constraints that keep large codebases coherent
                        </motion.h2>
                    </div>

                    <div className="col-span-12 grid gap-3 lg:col-span-8">
                        {DEPENDENCY_RULES.map((rule, index) => (
                            <motion.div
                                key={rule}
                                {...motionFx.sequence(index, 0.08, 0.06)}
                                className="retro-panel flex items-start gap-3 rounded-sm p-4"
                            >
                                <GitBranch className="mt-0.5 h-4 w-4 shrink-0" />
                                <p className="text-sm leading-relaxed text-foreground">{rule}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="public-band py-12 sm:py-14 lg:py-16">
                <div className="public-frame public-grid">
                    <div className="col-span-12 grid gap-4 lg:col-span-7">
                        <motion.article
                            {...motionFx.reveal()}
                            className="retro-panel rounded-sm p-5"
                        >
                            <div className="mb-3 flex items-center gap-2">
                                <Shield className="h-4 w-4" />
                                <p className="text-sm font-semibold text-foreground">
                                    Auth Guardrails
                                </p>
                            </div>
                            <div className="grid gap-2">
                                {AUTH_GUARDRAILS.map((item, index) => (
                                    <motion.div
                                        key={item}
                                        {...motionFx.sequence(index, 0.1, 0.05)}
                                        className="flex items-start gap-2"
                                    >
                                        <Check className="mt-0.5 h-4 w-4 shrink-0" />
                                        <p className="text-sm text-muted-foreground">{item}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.article>
                    </div>

                    <div className="col-span-12 grid gap-3 lg:col-span-5">
                        <motion.article
                            {...motionFx.reveal({ delay: 0.05 })}
                            className="retro-panel rounded-sm p-5"
                        >
                            <div className="mb-3 flex items-center gap-2">
                                <Braces className="h-4 w-4" />
                                <p className="text-sm font-semibold text-foreground">
                                    Validation Gates
                                </p>
                            </div>
                            <p className="mb-3 text-sm text-muted-foreground">
                                Every phase is expected to pass these checks before handoff.
                            </p>
                            <div className="grid gap-2">
                                {BUILD_GATES.map((cmd, index) => (
                                    <motion.div
                                        key={cmd}
                                        {...motionFx.sequence(index, 0.12, 0.05)}
                                        className="rounded-sm border border-border px-3 py-2"
                                    >
                                        <code className="text-xs text-foreground">{cmd}</code>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.article>

                        <motion.article
                            {...motionFx.reveal({ delay: 0.1 })}
                            className="retro-panel rounded-sm p-5"
                        >
                            <div className="mb-2 flex items-center gap-2">
                                <FlaskConical className="h-4 w-4" />
                                <p className="text-sm font-semibold text-foreground">
                                    Testing Policy
                                </p>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Tests mirror src structure under test/. MSW is required for API
                                mocking and unhandled requests should fail fast.
                            </p>
                        </motion.article>
                    </div>
                </div>
            </section>

            <section className="public-band border-b border-border py-10 sm:py-12">
                <div className="public-frame flex flex-wrap items-center justify-between gap-3">
                    <motion.p {...motionFx.reveal()} className="text-sm text-muted-foreground">
                        Continue with implementation guidance in About or return to the Home
                        overview.
                    </motion.p>
                    <motion.div {...motionFx.reveal({ delay: 0.05 })} className="flex gap-2">
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
                </div>
            </section>
        </div>
    );
}
