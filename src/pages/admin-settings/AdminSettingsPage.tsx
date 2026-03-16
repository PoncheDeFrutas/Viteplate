import { motion } from 'motion/react';
import { useState } from 'react';
import { AlertTriangle, CheckCircle2, LockKeyhole, Settings2, Shield, Sliders } from 'lucide-react';
import { useMotionPresets } from '@shared/lib/motion';
import {
    Badge,
    Banner,
    Button,
    Card,
    Checkbox,
    Input,
    Label,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Switch,
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
    Textarea,
} from '@shared/ui';
import { WorkspacePageHeader } from '@widgets/workspace';

interface SecuritySettings {
    requireMfa: boolean;
    sessionLockMinutes: string;
    strictRoleReview: boolean;
}

interface WorkspaceSettings {
    workspaceName: string;
    releaseChannel: string;
    notes: string;
    allowPreviewLinks: boolean;
}

interface SystemSettings {
    maintenanceWindow: string;
    telemetryLevel: string;
    notifyOnFailure: boolean;
}

export function AdminSettingsPage() {
    const motionFx = useMotionPresets();

    const [workspace, setWorkspace] = useState<WorkspaceSettings>({
        workspaceName: 'Viteplate Platform Workspace',
        releaseChannel: 'stable',
        notes: 'Primary environment for template generation and architecture validation.',
        allowPreviewLinks: true,
    });

    const [security, setSecurity] = useState<SecuritySettings>({
        requireMfa: true,
        sessionLockMinutes: '20',
        strictRoleReview: true,
    });

    const [system, setSystem] = useState<SystemSettings>({
        maintenanceWindow: '02:00-03:00 UTC',
        telemetryLevel: 'balanced',
        notifyOnFailure: true,
    });

    const [savedAt, setSavedAt] = useState('09:48');
    const [hasDraftChanges, setHasDraftChanges] = useState(false);

    function markChanged() {
        setHasDraftChanges(true);
    }

    function saveChanges() {
        const now = new Date();
        const hour = String(now.getHours()).padStart(2, '0');
        const minute = String(now.getMinutes()).padStart(2, '0');
        setSavedAt(`${hour}:${minute}`);
        setHasDraftChanges(false);
    }

    return (
        <div className="workspace-shell space-y-7">
            <WorkspacePageHeader
                label="Admin Settings"
                title="Configuration and policy controls"
                description="A complete settings surface example with grouped sections, meaningful defaults, and draft/save state handling."
                actions={
                    <>
                        <Button variant="outline" size="sm">
                            Discard
                        </Button>
                        <Button size="sm" onClick={saveChanges}>
                            Save changes
                        </Button>
                    </>
                }
            />

            <motion.section {...motionFx.reveal({ delay: 0.05 })}>
                {hasDraftChanges ? (
                    <Banner variant="warning" className="workspace-panel rounded-sm">
                        <p>
                            You have unsaved configuration changes. Save to apply policy updates to
                            this workspace.
                        </p>
                    </Banner>
                ) : (
                    <Banner variant="success" className="workspace-panel rounded-sm">
                        <p>All changes are synced. Last saved at {savedAt}.</p>
                    </Banner>
                )}
            </motion.section>

            <section className="workspace-grid">
                <motion.aside
                    {...motionFx.reveal({ delay: 0.08 })}
                    className="col-span-12 space-y-3 xl:col-span-3"
                >
                    <Card className="workspace-panel rounded-sm p-4">
                        <p className="workspace-label">Sections</p>
                        <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                            <li className="flex items-center gap-2">
                                <Settings2 className="h-4 w-4" /> Workspace
                            </li>
                            <li className="flex items-center gap-2">
                                <Shield className="h-4 w-4" /> Security
                            </li>
                            <li className="flex items-center gap-2">
                                <Sliders className="h-4 w-4" /> System
                            </li>
                        </ul>
                    </Card>

                    <Card className="workspace-panel rounded-sm p-4">
                        <p className="workspace-label">Policy state</p>
                        <ul className="mt-3 space-y-2 text-sm">
                            <li className="flex items-center justify-between gap-2">
                                <span className="text-muted-foreground">MFA enforcement</span>
                                <Badge variant={security.requireMfa ? 'success' : 'warning'}>
                                    {security.requireMfa ? 'active' : 'off'}
                                </Badge>
                            </li>
                            <li className="flex items-center justify-between gap-2">
                                <span className="text-muted-foreground">Role review</span>
                                <Badge variant={security.strictRoleReview ? 'success' : 'warning'}>
                                    {security.strictRoleReview ? 'strict' : 'relaxed'}
                                </Badge>
                            </li>
                            <li className="flex items-center justify-between gap-2">
                                <span className="text-muted-foreground">Failure alerts</span>
                                <Badge variant={system.notifyOnFailure ? 'success' : 'muted'}>
                                    {system.notifyOnFailure ? 'enabled' : 'disabled'}
                                </Badge>
                            </li>
                        </ul>
                    </Card>
                </motion.aside>

                <motion.div
                    {...motionFx.reveal({ delay: 0.1 })}
                    className="col-span-12 xl:col-span-9"
                >
                    <Card className="workspace-panel rounded-sm p-5">
                        <Tabs defaultValue="workspace" animated>
                            <TabsList>
                                <TabsTrigger value="workspace">Workspace</TabsTrigger>
                                <TabsTrigger value="security">Security</TabsTrigger>
                                <TabsTrigger value="system">System</TabsTrigger>
                            </TabsList>

                            <TabsContent value="workspace" className="mt-4 space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="workspace-name">Workspace name</Label>
                                        <Input
                                            id="workspace-name"
                                            value={workspace.workspaceName}
                                            onChange={(event) => {
                                                markChanged();
                                                setWorkspace((prev) => ({
                                                    ...prev,
                                                    workspaceName: event.target.value,
                                                }));
                                            }}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Release channel</Label>
                                        <Select
                                            value={workspace.releaseChannel}
                                            onValueChange={(value) => {
                                                markChanged();
                                                setWorkspace((prev) => ({
                                                    ...prev,
                                                    releaseChannel: value,
                                                }));
                                            }}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Choose channel" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="stable">Stable</SelectItem>
                                                <SelectItem value="candidate">
                                                    Release candidate
                                                </SelectItem>
                                                <SelectItem value="experimental">
                                                    Experimental
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="workspace-notes">Workspace notes</Label>
                                    <Textarea
                                        id="workspace-notes"
                                        value={workspace.notes}
                                        resize="vertical"
                                        onChange={(event) => {
                                            markChanged();
                                            setWorkspace((prev) => ({
                                                ...prev,
                                                notes: event.target.value,
                                            }));
                                        }}
                                    />
                                </div>

                                <div className="flex items-center justify-between rounded-sm border border-border p-3">
                                    <div>
                                        <p className="text-sm font-medium text-foreground">
                                            Preview links
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Allow generation of temporary shareable links.
                                        </p>
                                    </div>
                                    <Switch
                                        checked={workspace.allowPreviewLinks}
                                        onCheckedChange={(checked) => {
                                            markChanged();
                                            setWorkspace((prev) => ({
                                                ...prev,
                                                allowPreviewLinks: checked,
                                            }));
                                        }}
                                    />
                                </div>
                            </TabsContent>

                            <TabsContent value="security" className="mt-4 space-y-4">
                                <div className="flex items-center justify-between rounded-sm border border-border p-3">
                                    <div>
                                        <p className="text-sm font-medium text-foreground">
                                            Require MFA for admins
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Enforce second-factor authentication for admin sessions.
                                        </p>
                                    </div>
                                    <Switch
                                        checked={security.requireMfa}
                                        onCheckedChange={(checked) => {
                                            markChanged();
                                            setSecurity((prev) => ({
                                                ...prev,
                                                requireMfa: checked,
                                            }));
                                        }}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="session-lock">
                                        Session lock timeout (minutes)
                                    </Label>
                                    <Input
                                        id="session-lock"
                                        value={security.sessionLockMinutes}
                                        onChange={(event) => {
                                            markChanged();
                                            setSecurity((prev) => ({
                                                ...prev,
                                                sessionLockMinutes: event.target.value,
                                            }));
                                        }}
                                    />
                                </div>

                                <label className="flex items-start gap-3 rounded-sm border border-border p-3">
                                    <Checkbox
                                        checked={security.strictRoleReview}
                                        onCheckedChange={(checked) => {
                                            markChanged();
                                            setSecurity((prev) => ({
                                                ...prev,
                                                strictRoleReview: checked === true,
                                            }));
                                        }}
                                    />
                                    <span>
                                        <span className="text-sm font-medium text-foreground">
                                            Strict role review
                                        </span>
                                        <span className="mt-1 block text-xs text-muted-foreground">
                                            Require explicit admin approval for every role
                                            escalation.
                                        </span>
                                    </span>
                                </label>

                                <div className="rounded-sm border border-border p-3">
                                    <p className="flex items-center gap-2 text-sm font-medium text-foreground">
                                        <LockKeyhole className="h-4 w-4" />
                                        Security recommendation
                                    </p>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        Keep session timeout under 30 minutes when strict role
                                        review is enabled.
                                    </p>
                                </div>
                            </TabsContent>

                            <TabsContent value="system" className="mt-4 space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="maintenance-window">Maintenance window</Label>
                                    <Input
                                        id="maintenance-window"
                                        value={system.maintenanceWindow}
                                        onChange={(event) => {
                                            markChanged();
                                            setSystem((prev) => ({
                                                ...prev,
                                                maintenanceWindow: event.target.value,
                                            }));
                                        }}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Telemetry level</Label>
                                    <Select
                                        value={system.telemetryLevel}
                                        onValueChange={(value) => {
                                            markChanged();
                                            setSystem((prev) => ({
                                                ...prev,
                                                telemetryLevel: value,
                                            }));
                                        }}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select telemetry level" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="minimal">Minimal</SelectItem>
                                            <SelectItem value="balanced">Balanced</SelectItem>
                                            <SelectItem value="verbose">Verbose</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex items-center justify-between rounded-sm border border-border p-3">
                                    <div>
                                        <p className="text-sm font-medium text-foreground">
                                            Failure notifications
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Alert admins when lint/type/build gates fail.
                                        </p>
                                    </div>
                                    <Switch
                                        checked={system.notifyOnFailure}
                                        onCheckedChange={(checked) => {
                                            markChanged();
                                            setSystem((prev) => ({
                                                ...prev,
                                                notifyOnFailure: checked,
                                            }));
                                        }}
                                    />
                                </div>

                                <div className="rounded-sm border border-border p-3">
                                    <p className="flex items-center gap-2 text-sm font-medium text-foreground">
                                        <AlertTriangle className="h-4 w-4" />
                                        Deployment caution
                                    </p>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        Experimental telemetry can increase CI log volume in large
                                        pipelines.
                                    </p>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </Card>
                </motion.div>
            </section>

            <motion.section {...motionFx.reveal({ delay: 0.12 })}>
                <Card className="workspace-panel rounded-sm p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <p className="text-sm text-muted-foreground">
                            Settings are versioned as part of your workspace policy baseline.
                        </p>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4" />
                            <span className="text-sm font-medium text-foreground">
                                Last applied snapshot: {savedAt}
                            </span>
                        </div>
                    </div>
                </Card>
            </motion.section>
        </div>
    );
}
