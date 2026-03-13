import { useState } from 'react';
import {
    Avatar,
    Badge,
    CodeBlock,
    Kbd,
    ProgressBar,
    Separator,
    Skeleton,
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
    SimpleTooltip,
    TooltipProvider,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    Button,
} from '@shared/ui';

export function DisplaySection() {
    const [progress, setProgress] = useState(65);

    return (
        <TooltipProvider>
            <div className="space-y-12">
                {/* Avatar */}
                <div>
                    <h3 className="mb-4 text-lg font-semibold text-foreground">Avatar</h3>
                    <div className="flex items-center gap-4">
                        <Avatar name="John Doe" size="sm" />
                        <Avatar name="Jane Smith" size="md" />
                        <Avatar name="Alex Wong" size="lg" />
                        <Avatar name="Single" size="md" />
                    </div>
                </div>

                {/* Badge */}
                <div>
                    <h3 className="mb-4 text-lg font-semibold text-foreground">Badge</h3>
                    <div className="flex flex-wrap gap-2">
                        <Badge>Default</Badge>
                        <Badge variant="secondary">Secondary</Badge>
                        <Badge variant="outline">Outline</Badge>
                        <Badge variant="destructive">Destructive</Badge>
                        <Badge variant="success">Success</Badge>
                        <Badge variant="warning">Warning</Badge>
                        <Badge variant="info">Info</Badge>
                        <Badge variant="muted">Muted</Badge>
                    </div>
                </div>

                {/* CodeBlock */}
                <div>
                    <h3 className="mb-4 text-lg font-semibold text-foreground">CodeBlock</h3>
                    <CodeBlock label="install">pnpm add @radix-ui/react-dialog</CodeBlock>
                </div>

                {/* Kbd */}
                <div>
                    <h3 className="mb-4 text-lg font-semibold text-foreground">Kbd</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        Press <Kbd>Ctrl</Kbd> + <Kbd>K</Kbd> to open the command palette
                    </div>
                </div>

                {/* ProgressBar */}
                <div>
                    <h3 className="mb-4 text-lg font-semibold text-foreground">ProgressBar</h3>
                    <div className="max-w-md space-y-4">
                        <ProgressBar value={progress} label="Upload progress" showValue />
                        <ProgressBar value={100} variant="success" size="lg" />
                        <ProgressBar value={30} variant="warning" size="sm" />
                        <ProgressBar value={15} variant="destructive" />
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setProgress((p) => (p >= 100 ? 0 : p + 10))}
                        >
                            +10%
                        </Button>
                    </div>
                </div>

                {/* Separator */}
                <div>
                    <h3 className="mb-4 text-lg font-semibold text-foreground">Separator</h3>
                    <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">Horizontal separator</p>
                        <Separator />
                        <div className="flex h-8 items-center gap-4">
                            <span className="text-sm">Left</span>
                            <Separator orientation="vertical" />
                            <span className="text-sm">Right</span>
                        </div>
                    </div>
                </div>

                {/* Skeleton */}
                <div>
                    <h3 className="mb-4 text-lg font-semibold text-foreground">Skeleton</h3>
                    <div className="flex items-center gap-4">
                        <Skeleton circle className="h-12 w-12" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-48" />
                            <Skeleton className="h-4 w-32" />
                        </div>
                    </div>
                </div>

                {/* Tooltip */}
                <div>
                    <h3 className="mb-4 text-lg font-semibold text-foreground">Tooltip</h3>
                    <div className="flex gap-4">
                        <SimpleTooltip content="Top tooltip" side="top">
                            <Button variant="outline" size="sm">
                                Top
                            </Button>
                        </SimpleTooltip>
                        <SimpleTooltip content="Right tooltip" side="right">
                            <Button variant="outline" size="sm">
                                Right
                            </Button>
                        </SimpleTooltip>
                        <SimpleTooltip content="Bottom tooltip" side="bottom">
                            <Button variant="outline" size="sm">
                                Bottom
                            </Button>
                        </SimpleTooltip>
                        <SimpleTooltip content="Left tooltip" side="left">
                            <Button variant="outline" size="sm">
                                Left
                            </Button>
                        </SimpleTooltip>
                    </div>
                </div>

                {/* Table */}
                <div>
                    <h3 className="mb-4 text-lg font-semibold text-foreground">Table</h3>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell className="font-medium">INV001</TableCell>
                                <TableCell>
                                    <Badge variant="success">Paid</Badge>
                                </TableCell>
                                <TableCell className="text-right">$250.00</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium">INV002</TableCell>
                                <TableCell>
                                    <Badge variant="warning">Pending</Badge>
                                </TableCell>
                                <TableCell className="text-right">$150.00</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium">INV003</TableCell>
                                <TableCell>
                                    <Badge variant="destructive">Overdue</Badge>
                                </TableCell>
                                <TableCell className="text-right">$350.00</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>

                {/* Accordion */}
                <div>
                    <h3 className="mb-4 text-lg font-semibold text-foreground">Accordion</h3>
                    <Accordion type="single" collapsible className="max-w-md">
                        <AccordionItem value="item-1">
                            <AccordionTrigger>Is it accessible?</AccordionTrigger>
                            <AccordionContent>
                                Yes. Built on Radix UI primitives with full ARIA support.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                            <AccordionTrigger>Is it styled?</AccordionTrigger>
                            <AccordionContent>
                                Yes. Styled with Tailwind CSS and supports the project theme tokens.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-3">
                            <AccordionTrigger>Is it animated?</AccordionTrigger>
                            <AccordionContent>
                                Yes. Smooth height animation using CSS keyframes and Radix height
                                variables.
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>

                {/* Tabs */}
                <div>
                    <h3 className="mb-4 text-lg font-semibold text-foreground">Tabs</h3>
                    <Tabs defaultValue="account" className="max-w-md">
                        <TabsList>
                            <TabsTrigger value="account">Account</TabsTrigger>
                            <TabsTrigger value="password">Password</TabsTrigger>
                            <TabsTrigger value="settings">Settings</TabsTrigger>
                        </TabsList>
                        <TabsContent value="account">
                            <p className="text-sm text-muted-foreground">
                                Manage your account details and preferences.
                            </p>
                        </TabsContent>
                        <TabsContent value="password">
                            <p className="text-sm text-muted-foreground">
                                Update your password and security settings.
                            </p>
                        </TabsContent>
                        <TabsContent value="settings">
                            <p className="text-sm text-muted-foreground">
                                Configure application-level settings.
                            </p>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </TooltipProvider>
    );
}
