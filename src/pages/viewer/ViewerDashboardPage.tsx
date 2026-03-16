import { motion } from 'motion/react';
import { Eye, FileText, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useSession } from '@entities/session';
import { useMotionPresets } from '@shared/lib/motion';
import {
    Badge,
    Banner,
    Card,
    EmptyState,
    Input,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    Timeline,
} from '@shared/ui';
import { WorkspacePageHeader, WorkspaceStatCard } from '@widgets/workspace';

interface ReadOnlyAsset {
    title: string;
    owner: string;
    area: string;
    lastUpdate: string;
}

const READ_ONLY_ASSETS: ReadOnlyAsset[] = [
    {
        title: 'Platform architecture map',
        owner: 'Frontend Platform',
        area: 'app + shared',
        lastUpdate: 'Today',
    },
    {
        title: 'Auth flow sequence',
        owner: 'Security Team',
        area: 'features/auth',
        lastUpdate: 'Yesterday',
    },
    {
        title: 'Template generation rubric',
        owner: 'Product Ops',
        area: 'docs/process',
        lastUpdate: '2d ago',
    },
    {
        title: 'Testing strategy matrix',
        owner: 'Quality Team',
        area: 'test/',
        lastUpdate: '3d ago',
    },
] as const;

const READ_ONLY_TIMELINE = [
    {
        title: 'Read-only policy reaffirmed',
        description: 'Viewer role remains observation-only for all protected resources.',
        date: 'Today, 10:12',
    },
    {
        title: 'Architecture report published',
        description: 'Weekly FSD compliance report is available for review.',
        date: 'Yesterday, 18:04',
    },
    {
        title: 'Integration tests completed',
        description: 'MSW-backed route/auth scenarios passed in CI.',
        date: 'Yesterday, 15:39',
    },
] as const;

export function ViewerDashboardPage() {
    const user = useSession((s) => s.user);
    const motionFx = useMotionPresets();
    const [query, setQuery] = useState('');

    const visibleAssets = useMemo(() => {
        const normalized = query.trim().toLowerCase();
        if (!normalized) {
            return READ_ONLY_ASSETS;
        }

        return READ_ONLY_ASSETS.filter((asset) => {
            return (
                asset.title.toLowerCase().includes(normalized) ||
                asset.owner.toLowerCase().includes(normalized) ||
                asset.area.toLowerCase().includes(normalized)
            );
        });
    }, [query]);

    return (
        <div className="workspace-shell space-y-7">
            <WorkspacePageHeader
                label="Viewer Workspace"
                title="Read-only operations overview"
                description="A realistic observer dashboard demonstrating audit visibility, documentation access, and non-destructive exploration patterns."
            />

            <section className="workspace-grid">
                <div className="col-span-12 md:col-span-4">
                    <WorkspaceStatCard
                        index={0}
                        label="Visible assets"
                        value="24"
                        detail="Reports, architecture docs, and release notes"
                        icon={FileText}
                    />
                </div>
                <div className="col-span-12 md:col-span-4">
                    <WorkspaceStatCard
                        index={1}
                        label="Access mode"
                        value="Read-only"
                        detail="No mutation operations available"
                        icon={Eye}
                    />
                </div>
                <div className="col-span-12 md:col-span-4">
                    <WorkspaceStatCard
                        index={2}
                        label="Audit freshness"
                        value="< 5m"
                        detail="Latest events synchronized"
                        icon={Search}
                    />
                </div>
            </section>

            <motion.section {...motionFx.reveal({ delay: 0.08 })}>
                <Banner variant="default" className="workspace-panel rounded-sm">
                    <p>
                        Signed in as{' '}
                        <span className="font-medium text-foreground">{user?.name}</span>. This role
                        demonstrates safe visibility patterns for stakeholders who need context
                        without write permissions.
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
                                <p className="workspace-label">Reference library</p>
                                <h2 className="mt-1 text-xl font-semibold text-foreground">
                                    Accessible project artifacts
                                </h2>
                            </div>
                            <div className="relative w-full sm:w-72">
                                <Search className="pointer-events-none absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    value={query}
                                    onChange={(event) => {
                                        setQuery(event.target.value);
                                    }}
                                    placeholder="Search documents"
                                    aria-label="Search documents"
                                    className="pl-8"
                                />
                            </div>
                        </div>

                        {visibleAssets.length === 0 ? (
                            <EmptyState
                                title="No documents match your search"
                                description="Try searching by team, area, or document title."
                            />
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Artifact</TableHead>
                                        <TableHead>Owner</TableHead>
                                        <TableHead>Area</TableHead>
                                        <TableHead className="text-right">Updated</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {visibleAssets.map((asset) => (
                                        <TableRow key={asset.title}>
                                            <TableCell className="font-medium text-foreground">
                                                {asset.title}
                                            </TableCell>
                                            <TableCell>{asset.owner}</TableCell>
                                            <TableCell>
                                                <code className="text-xs text-muted-foreground">
                                                    {asset.area}
                                                </code>
                                            </TableCell>
                                            <TableCell className="text-right text-muted-foreground">
                                                {asset.lastUpdate}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </Card>
                </motion.div>

                <motion.aside
                    {...motionFx.reveal({ delay: 0.12 })}
                    className="col-span-12 space-y-4 xl:col-span-4"
                >
                    <Card className="workspace-panel rounded-sm p-5">
                        <p className="workspace-label">Recent events</p>
                        <h3 className="mt-1 text-lg font-semibold text-foreground">Audit stream</h3>
                        <Timeline
                            className="mt-4"
                            items={READ_ONLY_TIMELINE.map((item) => ({
                                title: item.title,
                                description: item.description,
                                date: item.date,
                            }))}
                        />
                    </Card>

                    <Card className="workspace-panel rounded-sm p-5">
                        <p className="workspace-label">Role scope</p>
                        <h3 className="mt-1 text-lg font-semibold text-foreground">
                            Allowed operations
                        </h3>
                        <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                            <li className="flex items-center justify-between gap-2">
                                <span>View dashboards</span>
                                <Badge variant="success">allowed</Badge>
                            </li>
                            <li className="flex items-center justify-between gap-2">
                                <span>Modify settings</span>
                                <Badge variant="destructive">blocked</Badge>
                            </li>
                            <li className="flex items-center justify-between gap-2">
                                <span>Approve requests</span>
                                <Badge variant="destructive">blocked</Badge>
                            </li>
                        </ul>
                    </Card>
                </motion.aside>
            </section>
        </div>
    );
}
