import { motion } from 'motion/react';
import {
    Activity,
    AlertTriangle,
    Clock3,
    RefreshCw,
    ShieldAlert,
    Users,
    Wrench,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { useMotionPresets } from '@shared/lib/motion';
import {
    Badge,
    Banner,
    Button,
    Card,
    EmptyState,
    Input,
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
} from '@shared/ui';
import { WorkspacePageHeader, WorkspaceStatCard } from '@widgets/workspace';

interface AccessRequest {
    id: string;
    user: string;
    email: string;
    requestedRole: 'admin' | 'user' | 'viewer';
    scope: string;
    requestedAt: string;
}

const ACCESS_REQUESTS: AccessRequest[] = [
    {
        id: 'rq-001',
        user: 'Lina Harper',
        email: 'lina.harper@team.dev',
        requestedRole: 'admin',
        scope: 'production + security settings',
        requestedAt: '11:02',
    },
    {
        id: 'rq-002',
        user: 'Nico Ellis',
        email: 'nico.ellis@team.dev',
        requestedRole: 'viewer',
        scope: 'incident dashboard',
        requestedAt: '09:41',
    },
    {
        id: 'rq-003',
        user: 'Rae Chang',
        email: 'rae.chang@team.dev',
        requestedRole: 'user',
        scope: 'template workspace',
        requestedAt: 'Yesterday',
    },
];

const AUDIT_LOG = [
    {
        event: 'Policy updated',
        actor: 'Admin · Marta',
        area: 'Refresh retry settings',
        time: '08:11',
    },
    {
        event: 'Role reassigned',
        actor: 'Admin · Theo',
        area: 'viewer -> user',
        time: '07:54',
    },
    {
        event: 'Emergency revoke',
        actor: 'System',
        area: 'stale session token',
        time: '06:03',
    },
] as const;

const JOB_QUEUE = [
    { name: 'Nightly integration matrix', status: 'running', progress: '62%' },
    { name: 'Schema compatibility scan', status: 'queued', progress: '0%' },
    { name: 'Release branch smoke run', status: 'success', progress: '100%' },
] as const;

function getRoleBadge(
    role: AccessRequest['requestedRole'],
): 'destructive' | 'outline' | 'secondary' {
    if (role === 'admin') {
        return 'destructive';
    }
    if (role === 'viewer') {
        return 'secondary';
    }
    return 'outline';
}

export function AdminDashboardPage() {
    const motionFx = useMotionPresets();
    const [search, setSearch] = useState('');

    const visibleRequests = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) {
            return ACCESS_REQUESTS;
        }

        return ACCESS_REQUESTS.filter((request) => {
            return (
                request.user.toLowerCase().includes(q) ||
                request.email.toLowerCase().includes(q) ||
                request.scope.toLowerCase().includes(q)
            );
        });
    }, [search]);

    return (
        <div className="workspace-shell space-y-7">
            <WorkspacePageHeader
                label="Admin Control Plane"
                title="Operations and policy dashboard"
                description="A production-style admin surface showing health, access governance, and execution telemetry for the template platform."
                actions={
                    <>
                        <Button variant="outline" size="sm">
                            Export audit report
                        </Button>
                        <Button size="sm">Open incident protocol</Button>
                    </>
                }
            />

            <section className="workspace-grid">
                <div className="col-span-12 md:col-span-6 xl:col-span-3">
                    <WorkspaceStatCard
                        index={0}
                        label="Active users"
                        value="248"
                        detail="Across admin, user, and viewer roles"
                        icon={Users}
                    />
                </div>
                <div className="col-span-12 md:col-span-6 xl:col-span-3">
                    <WorkspaceStatCard
                        index={1}
                        label="Open incidents"
                        value="2"
                        detail="One auth retry anomaly, one schema mismatch"
                        icon={AlertTriangle}
                    />
                </div>
                <div className="col-span-12 md:col-span-6 xl:col-span-3">
                    <WorkspaceStatCard
                        index={2}
                        label="Policy updates"
                        value="7"
                        detail="Applied this week through reviewed changes"
                        icon={ShieldAlert}
                    />
                </div>
                <div className="col-span-12 md:col-span-6 xl:col-span-3">
                    <WorkspaceStatCard
                        index={3}
                        label="Runtime health"
                        value="99.3%"
                        detail="Preview + staging uptime in last 24h"
                        icon={Activity}
                    />
                </div>
            </section>

            <motion.section {...motionFx.reveal({ delay: 0.08 })}>
                <Banner variant="warning" className="workspace-panel rounded-sm">
                    <p>
                        Two safeguards triggered in the last cycle. Review access requests and audit
                        events before promoting the next release.
                    </p>
                </Banner>
            </motion.section>

            <section className="workspace-grid">
                <motion.div
                    {...motionFx.reveal({ delay: 0.1 })}
                    className="col-span-12 xl:col-span-8"
                >
                    <Card className="workspace-panel rounded-sm p-5">
                        <Tabs defaultValue="requests" animated>
                            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                                <div>
                                    <p className="workspace-label">Governance workspace</p>
                                    <h2 className="mt-1 text-xl font-semibold text-foreground">
                                        Access and audit flows
                                    </h2>
                                </div>
                                <TabsList>
                                    <TabsTrigger value="requests">Requests</TabsTrigger>
                                    <TabsTrigger value="audit">Audit log</TabsTrigger>
                                    <TabsTrigger value="jobs">Jobs</TabsTrigger>
                                </TabsList>
                            </div>

                            <TabsContent value="requests" className="mt-1 space-y-3">
                                <Input
                                    value={search}
                                    onChange={(event) => {
                                        setSearch(event.target.value);
                                    }}
                                    placeholder="Search by user, email, or scope"
                                    aria-label="Search access requests"
                                />

                                {visibleRequests.length === 0 ? (
                                    <EmptyState
                                        title="No access requests found"
                                        description="Change your query to inspect another request set."
                                    />
                                ) : (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>User</TableHead>
                                                <TableHead>Role</TableHead>
                                                <TableHead>Scope</TableHead>
                                                <TableHead>Requested</TableHead>
                                                <TableHead className="text-right">Action</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {visibleRequests.map((request) => (
                                                <TableRow key={request.id}>
                                                    <TableCell>
                                                        <p className="font-medium text-foreground">
                                                            {request.user}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {request.email}
                                                        </p>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge
                                                            variant={getRoleBadge(
                                                                request.requestedRole,
                                                            )}
                                                        >
                                                            {request.requestedRole}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-muted-foreground">
                                                        {request.scope}
                                                    </TableCell>
                                                    <TableCell className="text-muted-foreground">
                                                        {request.requestedAt}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <Button variant="outline" size="sm">
                                                            Review
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                )}
                            </TabsContent>

                            <TabsContent value="audit" className="mt-1">
                                <div className="space-y-2">
                                    {AUDIT_LOG.map((event, index) => (
                                        <motion.div
                                            key={`${event.event}-${event.time}`}
                                            {...motionFx.sequence(index, 0.04, 0.05)}
                                            className="rounded-sm border border-border p-4"
                                        >
                                            <div className="flex items-center justify-between gap-2">
                                                <p className="font-medium text-foreground">
                                                    {event.event}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {event.time}
                                                </p>
                                            </div>
                                            <p className="mt-1 text-sm text-muted-foreground">
                                                {event.actor} · {event.area}
                                            </p>
                                        </motion.div>
                                    ))}
                                </div>
                            </TabsContent>

                            <TabsContent value="jobs" className="mt-1">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Job</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Progress</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {JOB_QUEUE.map((job) => (
                                            <TableRow key={job.name}>
                                                <TableCell className="font-medium text-foreground">
                                                    {job.name}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={
                                                            job.status === 'success'
                                                                ? 'success'
                                                                : job.status === 'running'
                                                                  ? 'info'
                                                                  : 'secondary'
                                                        }
                                                    >
                                                        {job.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right text-muted-foreground">
                                                    {job.progress}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TabsContent>
                        </Tabs>
                    </Card>
                </motion.div>

                <motion.aside
                    {...motionFx.reveal({ delay: 0.12 })}
                    className="col-span-12 space-y-4 xl:col-span-4"
                >
                    <Card className="workspace-panel rounded-sm p-5">
                        <p className="workspace-label">Runtime notes</p>
                        <h3 className="mt-1 text-lg font-semibold text-foreground">
                            Incident timeline
                        </h3>
                        <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                            <li className="flex items-start gap-2">
                                <Clock3 className="mt-0.5 h-4 w-4 shrink-0" />
                                Refresh retry spike detected at 09:22.
                            </li>
                            <li className="flex items-start gap-2">
                                <RefreshCw className="mt-0.5 h-4 w-4 shrink-0" />
                                Auto-recovery completed after token refresh cycle.
                            </li>
                            <li className="flex items-start gap-2">
                                <Wrench className="mt-0.5 h-4 w-4 shrink-0" />
                                Follow-up patch queued for next preview release.
                            </li>
                        </ul>
                    </Card>

                    <Card className="workspace-panel rounded-sm p-5">
                        <p className="workspace-label">Policy state</p>
                        <h3 className="mt-1 text-lg font-semibold text-foreground">
                            Current controls
                        </h3>
                        <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                            <li className="flex items-center justify-between gap-3">
                                <span>Role guard enforcement</span>
                                <Badge variant="success">active</Badge>
                            </li>
                            <li className="flex items-center justify-between gap-3">
                                <span>Single-flight refresh</span>
                                <Badge variant="success">active</Badge>
                            </li>
                            <li className="flex items-center justify-between gap-3">
                                <span>Retry budget</span>
                                <Badge variant="warning">watch</Badge>
                            </li>
                        </ul>
                    </Card>
                </motion.aside>
            </section>
        </div>
    );
}
