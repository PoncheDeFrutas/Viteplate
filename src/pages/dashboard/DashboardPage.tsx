import { motion } from 'motion/react';
import { Search, ShieldCheck, Sparkles, Workflow, Wrench } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useSession } from '@entities/session';
import { useMotionPresets } from '@shared/lib/motion';
import {
    Badge,
    Banner,
    Button,
    Card,
    EmptyState,
    Input,
    SegmentedControl,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
    Timeline,
} from '@shared/ui';
import { WorkspacePageHeader, WorkspaceStatCard } from '@widgets/workspace';

type ProjectStatus = 'healthy' | 'risk' | 'paused';

interface ProjectRow {
    name: string;
    module: string;
    health: ProjectStatus;
    updatedAt: string;
    owner: string;
}

const PROJECTS: ProjectRow[] = [
    {
        name: 'Template Generator Portal',
        module: 'features/template-builder',
        health: 'healthy',
        updatedAt: '2h ago',
        owner: 'Frontend Platform',
    },
    {
        name: 'Auth Boundary Kit',
        module: 'features/auth',
        health: 'healthy',
        updatedAt: '5h ago',
        owner: 'Security Team',
    },
    {
        name: 'Route Guard Console',
        module: 'app/router',
        health: 'risk',
        updatedAt: '8h ago',
        owner: 'Platform Team',
    },
    {
        name: 'Design Tokens Bridge',
        module: 'shared/ui',
        health: 'paused',
        updatedAt: '1d ago',
        owner: 'Design Systems',
    },
    {
        name: 'MSW Integration Matrix',
        module: 'test/integration',
        health: 'healthy',
        updatedAt: '2d ago',
        owner: 'Quality Team',
    },
];

const DEPLOYMENTS = [
    { env: 'staging', commit: '3c2f1d8', status: 'success', duration: '3m 14s' },
    { env: 'preview', commit: '4fbe22a', status: 'success', duration: '2m 02s' },
    { env: 'staging', commit: 'a27a8e4', status: 'failed', duration: '4m 49s' },
] as const;

const ALERTS = [
    {
        title: 'Retry budget near limit',
        description: 'Refresh flow hit 2 retries on a staging session, verify token TTL config.',
        date: 'Today, 10:28',
    },
    {
        title: 'Schema mismatch captured',
        description: 'Zod parser rejected optional profile field in preview response.',
        date: 'Today, 08:09',
    },
    {
        title: 'Lint gate recovered',
        description: 'CI run restored after import-order fix in widgets layer.',
        date: 'Yesterday, 17:51',
    },
] as const;

function getStatusBadgeVariant(status: ProjectStatus): 'success' | 'warning' | 'muted' {
    if (status === 'healthy') {
        return 'success';
    }
    if (status === 'risk') {
        return 'warning';
    }
    return 'muted';
}

export function DashboardPage() {
    const user = useSession((s) => s.user);
    const motionFx = useMotionPresets();

    const [activeHealth, setActiveHealth] = useState<'all' | ProjectStatus>('all');
    const [query, setQuery] = useState('');

    const filteredProjects = useMemo(() => {
        const normalized = query.trim().toLowerCase();

        return PROJECTS.filter((project) => {
            const healthMatch = activeHealth === 'all' || project.health === activeHealth;
            const textMatch =
                normalized.length === 0 ||
                project.name.toLowerCase().includes(normalized) ||
                project.module.toLowerCase().includes(normalized) ||
                project.owner.toLowerCase().includes(normalized);
            return healthMatch && textMatch;
        });
    }, [activeHealth, query]);

    return (
        <div className="workspace-shell space-y-7">
            <WorkspacePageHeader
                label="User Workspace"
                title="Project dashboard"
                description="A production-style workspace example: status visibility, recent activity, deployment context, and fast filtering of active modules."
                actions={
                    <>
                        <Button variant="outline" size="sm">
                            Generate template snapshot
                        </Button>
                        <Button size="sm">Create module brief</Button>
                    </>
                }
            />

            <section className="workspace-grid">
                <div className="col-span-12 md:col-span-6 xl:col-span-3">
                    <WorkspaceStatCard
                        index={0}
                        label="Active modules"
                        value="12"
                        detail="Across app, features, entities, and shared layers"
                        icon={Workflow}
                    />
                </div>
                <div className="col-span-12 md:col-span-6 xl:col-span-3">
                    <WorkspaceStatCard
                        index={1}
                        label="Quality gates"
                        value="4 / 4"
                        detail="Lint, type checks, build, and run-once tests"
                        icon={ShieldCheck}
                    />
                </div>
                <div className="col-span-12 md:col-span-6 xl:col-span-3">
                    <WorkspaceStatCard
                        index={2}
                        label="Deploy cadence"
                        value="3 today"
                        detail="Preview and staging executions"
                        icon={Wrench}
                    />
                </div>
                <div className="col-span-12 md:col-span-6 xl:col-span-3">
                    <WorkspaceStatCard
                        index={3}
                        label="Template confidence"
                        value="93%"
                        detail="Based on validation and integration coverage"
                        icon={Sparkles}
                    />
                </div>
            </section>

            <motion.section {...motionFx.reveal({ delay: 0.08 })}>
                <Banner variant="info" className="workspace-panel rounded-sm">
                    <p>
                        Signed in as{' '}
                        <span className="font-medium text-foreground">{user?.name}</span> (
                        {user?.role}). Workspace telemetry below is example data showing how a real
                        product view can be composed on this starter.
                    </p>
                </Banner>
            </motion.section>

            <section className="workspace-grid">
                <motion.div
                    {...motionFx.reveal({ delay: 0.1 })}
                    className="col-span-12 xl:col-span-8"
                >
                    <Card className="workspace-panel rounded-sm p-5">
                        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <p className="workspace-label">Operations board</p>
                                <h2 className="mt-1 text-xl font-semibold text-foreground">
                                    Module activity
                                </h2>
                            </div>
                            <div className="flex items-center gap-2">
                                <SegmentedControl
                                    value={activeHealth}
                                    onValueChange={(value) => {
                                        setActiveHealth(value as 'all' | ProjectStatus);
                                    }}
                                    options={[
                                        { value: 'all', label: 'All' },
                                        { value: 'healthy', label: 'Healthy' },
                                        { value: 'risk', label: 'Risk' },
                                        { value: 'paused', label: 'Paused' },
                                    ]}
                                />
                                <div className="relative w-56">
                                    <Search className="pointer-events-none absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        value={query}
                                        onChange={(event) => {
                                            setQuery(event.target.value);
                                        }}
                                        placeholder="Search modules"
                                        className="pl-8"
                                        aria-label="Search modules"
                                    />
                                </div>
                            </div>
                        </div>

                        <Tabs defaultValue="projects" animated>
                            <TabsList>
                                <TabsTrigger value="projects">Projects</TabsTrigger>
                                <TabsTrigger value="deployments">Deployments</TabsTrigger>
                                <TabsTrigger value="alerts">Alerts</TabsTrigger>
                            </TabsList>

                            <TabsContent value="projects" className="mt-4">
                                {filteredProjects.length === 0 ? (
                                    <EmptyState
                                        title="No modules match the current filters"
                                        description="Try changing health status or search query to broaden the results."
                                        action={
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    setActiveHealth('all');
                                                    setQuery('');
                                                }}
                                            >
                                                Reset filters
                                            </Button>
                                        }
                                    />
                                ) : (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Project</TableHead>
                                                <TableHead>Module</TableHead>
                                                <TableHead>Owner</TableHead>
                                                <TableHead>Health</TableHead>
                                                <TableHead className="text-right">
                                                    Updated
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredProjects.map((project) => (
                                                <TableRow key={project.name}>
                                                    <TableCell className="font-medium text-foreground">
                                                        {project.name}
                                                    </TableCell>
                                                    <TableCell>
                                                        <code className="text-xs text-muted-foreground">
                                                            {project.module}
                                                        </code>
                                                    </TableCell>
                                                    <TableCell>{project.owner}</TableCell>
                                                    <TableCell>
                                                        <Badge
                                                            variant={getStatusBadgeVariant(
                                                                project.health,
                                                            )}
                                                        >
                                                            {project.health}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right text-muted-foreground">
                                                        {project.updatedAt}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                )}
                            </TabsContent>

                            <TabsContent value="deployments" className="mt-4">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Environment</TableHead>
                                            <TableHead>Commit</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Duration</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {DEPLOYMENTS.map((deployment) => (
                                            <TableRow
                                                key={`${deployment.env}-${deployment.commit}`}
                                            >
                                                <TableCell className="font-medium text-foreground uppercase">
                                                    {deployment.env}
                                                </TableCell>
                                                <TableCell>
                                                    <code className="text-xs">
                                                        {deployment.commit}
                                                    </code>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={
                                                            deployment.status === 'success'
                                                                ? 'success'
                                                                : 'destructive'
                                                        }
                                                    >
                                                        {deployment.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right text-muted-foreground">
                                                    {deployment.duration}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TabsContent>

                            <TabsContent value="alerts" className="mt-4">
                                <Timeline
                                    items={ALERTS.map((alert) => ({
                                        title: alert.title,
                                        description: alert.description,
                                        date: alert.date,
                                    }))}
                                />
                            </TabsContent>
                        </Tabs>
                    </Card>
                </motion.div>

                <motion.aside
                    {...motionFx.reveal({ delay: 0.12 })}
                    className="col-span-12 space-y-4 xl:col-span-4"
                >
                    <Card className="workspace-panel rounded-sm p-5">
                        <p className="workspace-label">Readiness</p>
                        <h3 className="mt-1 text-lg font-semibold text-foreground">
                            Release checklist
                        </h3>
                        <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                            <li className="flex items-start gap-2">
                                <Badge variant="success">Done</Badge>
                                Update route guard docs for role flow
                            </li>
                            <li className="flex items-start gap-2">
                                <Badge variant="warning">Pending</Badge>
                                Backfill integration tests for refresh retry branch
                            </li>
                            <li className="flex items-start gap-2">
                                <Badge variant="muted">Planned</Badge>
                                Ship settings presets for multi-workspace mode
                            </li>
                        </ul>
                    </Card>

                    <Card className="workspace-panel rounded-sm p-5">
                        <p className="workspace-label">Account</p>
                        <h3 className="mt-1 text-lg font-semibold text-foreground">
                            Current identity
                        </h3>
                        {user ? (
                            <dl className="mt-4 space-y-2 text-sm">
                                <div className="flex items-center justify-between gap-3">
                                    <dt className="text-muted-foreground">Name</dt>
                                    <dd className="font-medium text-foreground">{user.name}</dd>
                                </div>
                                <div className="flex items-center justify-between gap-3">
                                    <dt className="text-muted-foreground">Email</dt>
                                    <dd className="font-medium text-foreground">{user.email}</dd>
                                </div>
                                <div className="flex items-center justify-between gap-3">
                                    <dt className="text-muted-foreground">Role</dt>
                                    <dd>
                                        <Badge variant="outline" className="uppercase">
                                            {user.role}
                                        </Badge>
                                    </dd>
                                </div>
                            </dl>
                        ) : (
                            <EmptyState
                                title="No profile loaded"
                                description="Session exists but user data has not been resolved yet."
                            />
                        )}
                    </Card>
                </motion.aside>
            </section>
        </div>
    );
}
