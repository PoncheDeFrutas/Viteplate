import { Link } from '@tanstack/react-router';
import { motion } from 'motion/react';
import { ArrowRight, Check, Layers, Shield, Workflow, Wrench } from 'lucide-react';
import { ROUTE_PATHS } from '@shared/config';
import { useMotionPresets } from '@shared/lib/motion';
import { Badge, Button } from '@shared/ui';

const NON_NEGOTIABLES = [
    'Feature-Sliced dependency direction: app -> pages -> widgets -> features -> entities -> shared',
    'Axios handles transport and interceptors; TanStack Query handles cache and retry policies',
    'Session and global UI state in Zustand; runtime validation with Zod',
    'Pages stay thin: composition only, no business logic',
] as const;

const READY_FOUNDATION = [
    { label: 'React 19 + TypeScript 5.9', icon: Layers },
    { label: 'TanStack Router, Query, and Form', icon: Workflow },
    { label: 'Axios auth pipeline + error normalization', icon: Shield },
    { label: 'Vitest + MSW integration baseline', icon: Wrench },
] as const;

const ROADMAP = [
    {
        id: 'Phase 1-2',
        title: 'Build shared foundations and domain entities',
        body: 'Set environment parsing, HTTP client, common error model, and session/user domain contracts.',
    },
    {
        id: 'Phase 3-5',
        title: 'Implement authentication features and guarded routing',
        body: 'Deliver login/logout/refresh flow, role guards, and predictable route-level access control.',
    },
    {
        id: 'Phase 6-8',
        title: 'Compose pages, shared UI, and testable delivery loops',
        body: 'Ship thin pages, reusable primitives, and repeatable MSW-backed integration coverage.',
    },
] as const;

export function HomePage() {
    const motionFx = useMotionPresets();

    return (
        <div className="public-shell">
            <section className="public-frame min-h-[72vh] py-10 sm:py-14 lg:py-18">
                <div className="public-grid">
                    <div className="col-span-12 space-y-7 lg:col-span-8">
                        <motion.p {...motionFx.reveal()} className="public-kicker">
                            Viteplate // Scalable Frontend Template System
                        </motion.p>

                        <motion.h1
                            {...motionFx.reveal({ delay: 0.05 })}
                            className="public-heading max-w-4xl text-4xl font-semibold text-foreground sm:text-6xl xl:text-7xl"
                        >
                            Generate serious frontend foundations with architecture, security, and
                            delivery discipline built in.
                        </motion.h1>

                        <motion.p
                            {...motionFx.reveal({ delay: 0.1 })}
                            className="max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-xl"
                        >
                            Viteplate is a React 19 + TypeScript starter and architecture reference.
                            It exists to help teams start faster without sacrificing structure,
                            quality, or long-term maintainability.
                        </motion.p>

                        <motion.div
                            {...motionFx.reveal({ delay: 0.16 })}
                            className="flex flex-wrap items-center gap-3"
                        >
                            <Link to={ROUTE_PATHS.login}>
                                <Button size="lg">
                                    Start With The Platform
                                    <ArrowRight className="h-4 w-4" />
                                </Button>
                            </Link>
                            <Link to={ROUTE_PATHS.stack}>
                                <Button variant="outline" size="lg">
                                    Explore Stack Decisions
                                </Button>
                            </Link>
                        </motion.div>
                    </div>

                    <div className="col-span-12 grid gap-3 self-end sm:grid-cols-2 lg:col-span-4 lg:grid-cols-1">
                        {READY_FOUNDATION.map((item, index) => {
                            const Icon = item.icon;

                            return (
                                <motion.div
                                    key={item.label}
                                    {...motionFx.sequence(index, 0.12, 0.06)}
                                    className="retro-panel rounded-sm p-4"
                                >
                                    <div className="mb-3 inline-flex rounded-sm border border-border p-2">
                                        <Icon className="h-4 w-4" />
                                    </div>
                                    <p className="text-sm font-medium text-foreground">
                                        {item.label}
                                    </p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section className="public-band bg-card/40 py-12 sm:py-14 lg:py-16">
                <div className="public-frame public-grid">
                    <div className="col-span-12 lg:col-span-4">
                        <motion.p {...motionFx.reveal()} className="public-kicker">
                            Non-Negotiables
                        </motion.p>
                        <motion.h2
                            {...motionFx.reveal({ delay: 0.04 })}
                            className="public-heading mt-3 max-w-xl text-3xl font-semibold text-foreground sm:text-4xl"
                        >
                            Rules that prevent template drift from day one
                        </motion.h2>
                    </div>

                    <div className="col-span-12 grid gap-3 lg:col-span-8">
                        {NON_NEGOTIABLES.map((item, index) => (
                            <motion.div
                                key={item}
                                {...motionFx.sequence(index, 0.08, 0.06)}
                                className="retro-panel flex items-start gap-3 rounded-sm p-4"
                            >
                                <Check className="mt-0.5 h-4 w-4 shrink-0" />
                                <p className="text-sm leading-relaxed text-foreground">{item}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="public-band py-12 sm:py-14 lg:py-16">
                <div className="public-frame public-grid">
                    <div className="col-span-12 lg:col-span-5">
                        <motion.p {...motionFx.reveal()} className="public-kicker">
                            Implementation Path
                        </motion.p>
                        <motion.h2
                            {...motionFx.reveal({ delay: 0.05 })}
                            className="public-heading mt-3 max-w-xl text-3xl font-semibold text-foreground sm:text-4xl"
                        >
                            A phase-based route from starter to production-ready baseline
                        </motion.h2>
                        <motion.p
                            {...motionFx.reveal({ delay: 0.08 })}
                            className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base"
                        >
                            The project guide defines a delivery order that minimizes friction and
                            keeps each step verifiable through lint, type checks, build, and tests.
                        </motion.p>
                    </div>

                    <div className="col-span-12 grid gap-3 lg:col-span-7">
                        {ROADMAP.map((phase, index) => (
                            <motion.article
                                key={phase.id}
                                {...motionFx.sequence(index, 0.1, 0.07)}
                                className="retro-panel rounded-sm p-5"
                            >
                                <Badge variant="outline" className="mb-3">
                                    {phase.id}
                                </Badge>
                                <h3 className="text-lg font-semibold text-foreground">
                                    {phase.title}
                                </h3>
                                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                    {phase.body}
                                </p>
                            </motion.article>
                        ))}
                    </div>
                </div>
            </section>

            <section className="public-band border-b border-border py-10 sm:py-12">
                <div className="public-frame flex flex-wrap items-center justify-between gap-4">
                    <motion.p
                        {...motionFx.reveal()}
                        className="max-w-2xl text-sm text-muted-foreground"
                    >
                        Continue to About for project philosophy and to Stack for the exact
                        responsibility model of each library in the system.
                    </motion.p>

                    <motion.div {...motionFx.reveal({ delay: 0.06 })} className="flex gap-2">
                        <Link to={ROUTE_PATHS.about}>
                            <Button variant="outline">About</Button>
                        </Link>
                        <Link to={ROUTE_PATHS.stack}>
                            <Button variant="outline">Stack</Button>
                        </Link>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
