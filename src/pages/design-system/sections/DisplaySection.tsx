import { useState } from 'react';
import {
    Avatar,
    Badge,
    Blockquote,
    Carousel,
    CarouselSlide,
    CodeBlock,
    DataList,
    DataListItem,
    Indicator,
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
    Tag,
    TagGroup,
    Timeline,
    SimpleTooltip,
    TooltipProvider,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    Tree,
    Button,
} from '@shared/ui';

const TREE_DATA = [
    {
        id: 'src',
        label: 'src',
        children: [
            {
                id: 'app',
                label: 'app',
                children: [
                    { id: 'main', label: 'main.tsx' },
                    { id: 'router', label: 'router.ts' },
                ],
            },
            {
                id: 'shared',
                label: 'shared',
                children: [
                    { id: 'ui', label: 'ui', children: [{ id: 'button', label: 'Button.tsx' }] },
                    { id: 'lib', label: 'lib', children: [{ id: 'cn', label: 'cn.ts' }] },
                ],
            },
        ],
    },
    { id: 'pkg', label: 'package.json' },
    { id: 'ts', label: 'tsconfig.json' },
];

const TIMELINE_ITEMS = [
    { title: 'Project created', description: 'Initial repository setup.', date: 'Jan 2026' },
    { title: 'Auth system', description: 'JWT auth with refresh flow.', date: 'Feb 2026' },
    { title: 'UI library', description: '50+ shared components.', date: 'Mar 2026' },
];

export function DisplaySection() {
    const [progress, setProgress] = useState(65);
    const [tags, setTags] = useState(['React', 'TypeScript', 'Tailwind', 'Vite']);

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

                {/* Tag */}
                <div>
                    <h3 className="mb-4 text-lg font-semibold text-foreground">Tag</h3>
                    <p className="mb-4 text-sm text-muted-foreground">
                        Compact labels with animated removal. Click X to remove.
                    </p>
                    <div className="flex flex-wrap gap-2">
                        <TagGroup>
                            {tags.map((tag) => (
                                <Tag
                                    key={tag}
                                    variant="default"
                                    onRemove={() =>
                                        setTags((prev) => prev.filter((t) => t !== tag))
                                    }
                                >
                                    {tag}
                                </Tag>
                            ))}
                        </TagGroup>
                        {tags.length < 4 && (
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setTags(['React', 'TypeScript', 'Tailwind', 'Vite'])}
                            >
                                Reset
                            </Button>
                        )}
                    </div>
                </div>

                {/* Indicator */}
                <div>
                    <h3 className="mb-4 text-lg font-semibold text-foreground">Indicator</h3>
                    <div className="flex items-center gap-6">
                        <span className="flex items-center gap-2 text-sm">
                            <Indicator variant="success" /> Online
                        </span>
                        <span className="flex items-center gap-2 text-sm">
                            <Indicator variant="warning" pulse /> Away
                        </span>
                        <span className="flex items-center gap-2 text-sm">
                            <Indicator variant="destructive" /> Offline
                        </span>
                        <span className="flex items-center gap-2 text-sm">
                            <Indicator variant="muted" /> Unknown
                        </span>
                    </div>
                </div>

                {/* Timeline */}
                <div>
                    <h3 className="mb-4 text-lg font-semibold text-foreground">Timeline</h3>
                    <div className="max-w-md">
                        <Timeline items={TIMELINE_ITEMS} />
                    </div>
                </div>

                {/* DataList */}
                <div>
                    <h3 className="mb-4 text-lg font-semibold text-foreground">DataList</h3>
                    <div className="max-w-md">
                        <DataList>
                            <DataListItem label="Name">John Doe</DataListItem>
                            <DataListItem label="Email">john@example.com</DataListItem>
                            <DataListItem label="Role">
                                <Badge variant="info">Admin</Badge>
                            </DataListItem>
                            <DataListItem label="Status">
                                <span className="flex items-center gap-2">
                                    <Indicator variant="success" size="sm" /> Active
                                </span>
                            </DataListItem>
                        </DataList>
                    </div>
                </div>

                {/* Blockquote */}
                <div>
                    <h3 className="mb-4 text-lg font-semibold text-foreground">Blockquote</h3>
                    <div className="max-w-lg">
                        <Blockquote footer="Rich Harris, creator of Svelte">
                            Frameworks are not tools for organising your code, they are tools for
                            organising your mind.
                        </Blockquote>
                    </div>
                </div>

                {/* Carousel */}
                <div>
                    <h3 className="mb-4 text-lg font-semibold text-foreground">Carousel</h3>
                    <div className="max-w-md">
                        <Carousel>
                            {[1, 2, 3, 4].map((i) => (
                                <CarouselSlide key={i}>
                                    <div className="flex h-40 items-center justify-center rounded-lg bg-muted text-lg font-medium text-muted-foreground">
                                        Slide {i}
                                    </div>
                                </CarouselSlide>
                            ))}
                        </Carousel>
                    </div>
                </div>

                {/* Tree */}
                <div>
                    <h3 className="mb-4 text-lg font-semibold text-foreground">Tree</h3>
                    <div className="max-w-xs rounded-md border border-border p-2">
                        <Tree data={TREE_DATA} defaultExpanded={['src']} />
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
