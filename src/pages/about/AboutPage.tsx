import { Link } from '@tanstack/react-router';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, Check, ShieldCheck } from 'lucide-react';
import { ROUTE_PATHS } from '@shared/config';
import { useMotionPresets } from '@shared/lib/motion';
import { Badge, Button } from '@shared/ui';

const PURPOSE_POINTS = [
    'Scalable React 19 + TypeScript starter with strict architecture boundaries',
    'Architecture reference for teams adopting Feature-Sliced Design',
    'Operational guide for secure auth, reliable routing, and predictable delivery',
] as const;

const PRINCIPLES = [
    'Respect FSD dependency direction and slice public APIs',
    'Keep pages thin and feature logic out of route-level composition',
    'Avoid explicit any and validate runtime inputs with Zod',
    'Keep auth behavior centralized in shared HTTP and dedicated features',
] as const;

const LIBRARY_RESPONSIBILITIES = [
    {
        library: 'Axios',
        does: 'Base client, auth interceptors, transport error normalization',
        avoids: 'Business retry policy, cache orchestration, domain logic',
    },
    {
        library: 'TanStack Query',
        does: 'Server-state cache, retry/refetch policy, mutation invalidation',
        avoids: 'Token storage, HTTP interceptor concerns',
    },
    {
        library: 'TanStack Router',
        does: 'Route tree, layouts, guards, and access redirection',
        avoids: 'Direct HTTP calls and auth business orchestration',
    },
    {
        library: 'Zustand',
        does: 'Session state and explicit session actions',
        avoids: 'API fetching and server-cache responsibilities',
    },
] as const;

export function AboutPage() {
    const motionFx = useMotionPresets();

    return (
        <div className="public-shell">
            <section className="public-frame py-10 sm:py-14 lg:py-16">
                <div className="public-grid">
                    <div className="col-span-12 space-y-5 lg:col-span-7">
                        <motion.p {...motionFx.reveal()} className="public-kicker">
                            About The Project
                        </motion.p>
                        <motion.h1
                            {...motionFx.reveal({ delay: 0.05 })}
                            className="public-heading max-w-4xl text-4xl font-semibold text-foreground sm:text-6xl"
                        >
                            Viteplate is both a starter and a system for frontend project execution.
                        </motion.h1>
                        <motion.p
                            {...motionFx.reveal({ delay: 0.1 })}
                            className="max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-xl"
                        >
                            The project exists to reduce architecture chaos in early-stage frontend
                            development. It provides a clear technical baseline and a documented
                            path from setup to production-ready delivery.
                        </motion.p>
                    </div>

                    <div className="col-span-12 grid gap-3 self-end sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1">
                        {PURPOSE_POINTS.map((item, index) => (
                            <motion.div
                                key={item}
                                {...motionFx.sequence(index, 0.1, 0.06)}
                                className="retro-panel rounded-sm p-4"
                            >
                                <p className="text-sm leading-relaxed text-foreground">{item}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="public-band py-12 sm:py-14 lg:py-16">
                <div className="public-frame public-grid">
                    <div className="col-span-12 lg:col-span-4">
                        <motion.p {...motionFx.reveal()} className="public-kicker">
                            Non-Negotiable Principles
                        </motion.p>
                        <motion.h2
                            {...motionFx.reveal({ delay: 0.05 })}
                            className="public-heading mt-3 max-w-xl text-3xl font-semibold text-foreground sm:text-4xl"
                        >
                            Quality guardrails, not optional recommendations
                        </motion.h2>
                    </div>

                    <div className="col-span-12 grid gap-3 lg:col-span-8">
                        {PRINCIPLES.map((item, index) => (
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

            <section className="public-band bg-card/40 py-12 sm:py-14 lg:py-16">
                <div className="public-frame public-grid">
                    <div className="col-span-12 lg:col-span-4">
                        <motion.p {...motionFx.reveal()} className="public-kicker">
                            Responsibility Model
                        </motion.p>
                        <motion.h2
                            {...motionFx.reveal({ delay: 0.05 })}
                            className="public-heading mt-3 max-w-xl text-3xl font-semibold text-foreground sm:text-4xl"
                        >
                            Clear ownership per library keeps the system stable
                        </motion.h2>
                    </div>

                    <div className="col-span-12 grid gap-3 lg:col-span-8">
                        {LIBRARY_RESPONSIBILITIES.map((item, index) => (
                            <motion.article
                                key={item.library}
                                {...motionFx.sequence(index, 0.1, 0.07)}
                                className="retro-panel rounded-sm p-5"
                            >
                                <div className="mb-3 flex items-center justify-between gap-2">
                                    <h3 className="text-lg font-semibold text-foreground">
                                        {item.library}
                                    </h3>
                                    <Badge variant="outline">Defined Scope</Badge>
                                </div>
                                <p className="text-sm leading-relaxed text-foreground">
                                    <span className="font-medium">Handles:</span> {item.does}
                                </p>
                                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                    <span className="font-medium text-foreground">Avoids:</span>{' '}
                                    {item.avoids}
                                </p>
                            </motion.article>
                        ))}
                    </div>
                </div>
            </section>

            <section className="public-band border-b border-border py-10 sm:py-12">
                <div className="public-frame flex flex-wrap items-center justify-between gap-3">
                    <motion.div {...motionFx.reveal()} className="flex items-center gap-2 text-sm">
                        <ShieldCheck className="h-4 w-4" />
                        <span className="text-muted-foreground">
                            Build, lint, type-check, and test are mandatory validation gates.
                        </span>
                    </motion.div>

                    <motion.div {...motionFx.reveal({ delay: 0.06 })} className="flex gap-2">
                        <Link to={ROUTE_PATHS.home}>
                            <Button variant="outline">
                                <ArrowLeft className="h-4 w-4" />
                                Home
                            </Button>
                        </Link>
                        <Link to={ROUTE_PATHS.stack}>
                            <Button variant="outline">
                                Stack
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
