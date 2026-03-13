import { useState } from 'react';
import {
    AspectRatio,
    Card,
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
    Container,
    Grid,
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
    ScrollArea,
    Stack,
    Button,
} from '@shared/ui';
import { ChevronsUpDown } from 'lucide-react';

export function LayoutSection() {
    const [collapsibleOpen, setCollapsibleOpen] = useState(false);

    return (
        <div className="space-y-12">
            {/* Card */}
            <div>
                <h3 className="mb-4 text-lg font-semibold text-foreground">Card</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <Card>
                        <h4 className="font-medium">Default Card</h4>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Transparent background with border.
                        </p>
                    </Card>
                    <Card variant="filled">
                        <h4 className="font-medium">Filled Card</h4>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Filled background with card colour.
                        </p>
                    </Card>
                    <Card interactive>
                        <h4 className="font-medium">Interactive Card</h4>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Hover to see the lift effect.
                        </p>
                    </Card>
                    <Card padding="sm">
                        <h4 className="font-medium">Small Padding</h4>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Card with compact padding.
                        </p>
                    </Card>
                    <Card padding="none" className="overflow-hidden">
                        <div className="bg-muted p-4">
                            <h4 className="font-medium">No Padding</h4>
                        </div>
                        <div className="p-4">
                            <p className="text-sm text-muted-foreground">
                                Custom padding per section.
                            </p>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Collapsible */}
            <div>
                <h3 className="mb-4 text-lg font-semibold text-foreground">Collapsible</h3>
                <div className="max-w-sm">
                    <Collapsible open={collapsibleOpen} onOpenChange={setCollapsibleOpen}>
                        <div className="flex items-center justify-between">
                            <h4 className="text-sm font-semibold">3 items hidden</h4>
                            <CollapsibleTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <ChevronsUpDown className="h-4 w-4" />
                                    <span className="sr-only">Toggle</span>
                                </Button>
                            </CollapsibleTrigger>
                        </div>
                        <div className="mt-2 rounded-md border border-border px-4 py-3 text-sm">
                            Always visible item
                        </div>
                        <CollapsibleContent className="mt-1.5 space-y-1.5">
                            <div className="rounded-md border border-border px-4 py-3 text-sm">
                                Hidden item 1
                            </div>
                            <div className="rounded-md border border-border px-4 py-3 text-sm">
                                Hidden item 2
                            </div>
                            <div className="rounded-md border border-border px-4 py-3 text-sm">
                                Hidden item 3
                            </div>
                        </CollapsibleContent>
                    </Collapsible>
                </div>
            </div>

            {/* ScrollArea */}
            <div>
                <h3 className="mb-4 text-lg font-semibold text-foreground">ScrollArea</h3>
                <ScrollArea className="h-48 w-full max-w-sm rounded-md border border-border">
                    <div className="p-4">
                        {Array.from({ length: 20 }, (_, i) => (
                            <div key={i} className="border-b border-border py-2 text-sm">
                                Item {i + 1}
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </div>

            {/* ResizablePanels */}
            <div>
                <h3 className="mb-4 text-lg font-semibold text-foreground">ResizablePanels</h3>
                <div className="max-w-lg rounded-md border border-border">
                    <ResizablePanelGroup orientation="horizontal" className="h-40">
                        <ResizablePanel defaultSize={50}>
                            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                                Panel A
                            </div>
                        </ResizablePanel>
                        <ResizableHandle withHandle />
                        <ResizablePanel defaultSize={50}>
                            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                                Panel B
                            </div>
                        </ResizablePanel>
                    </ResizablePanelGroup>
                </div>
            </div>

            {/* Grid */}
            <div>
                <h3 className="mb-4 text-lg font-semibold text-foreground">Grid</h3>
                <div className="space-y-6">
                    <div>
                        <p className="mb-2 text-xs font-medium text-muted-foreground uppercase">
                            3 columns, medium gap
                        </p>
                        <Grid cols={3} gap="md">
                            {Array.from({ length: 6 }, (_, i) => (
                                <div
                                    key={i}
                                    className="rounded-md border border-border bg-muted p-4 text-center text-sm"
                                >
                                    {i + 1}
                                </div>
                            ))}
                        </Grid>
                    </div>
                    <div>
                        <p className="mb-2 text-xs font-medium text-muted-foreground uppercase">
                            4 columns, small gap
                        </p>
                        <Grid cols={4} gap="sm">
                            {Array.from({ length: 8 }, (_, i) => (
                                <div
                                    key={i}
                                    className="rounded-md border border-border bg-muted p-3 text-center text-sm"
                                >
                                    {i + 1}
                                </div>
                            ))}
                        </Grid>
                    </div>
                </div>
            </div>

            {/* Stack */}
            <div>
                <h3 className="mb-4 text-lg font-semibold text-foreground">Stack</h3>
                <div className="space-y-6">
                    <div>
                        <p className="mb-2 text-xs font-medium text-muted-foreground uppercase">
                            Vertical stack (default)
                        </p>
                        <Stack gap="sm" className="max-w-xs">
                            <div className="rounded-md border border-border bg-muted p-3 text-sm">
                                Item 1
                            </div>
                            <div className="rounded-md border border-border bg-muted p-3 text-sm">
                                Item 2
                            </div>
                            <div className="rounded-md border border-border bg-muted p-3 text-sm">
                                Item 3
                            </div>
                        </Stack>
                    </div>
                    <div>
                        <p className="mb-2 text-xs font-medium text-muted-foreground uppercase">
                            Horizontal stack with center alignment
                        </p>
                        <Stack direction="row" gap="md" align="center">
                            <div className="rounded-md border border-border bg-muted p-3 text-sm">
                                Left
                            </div>
                            <div className="rounded-md border border-border bg-muted p-6 text-sm">
                                Center (taller)
                            </div>
                            <div className="rounded-md border border-border bg-muted p-3 text-sm">
                                Right
                            </div>
                        </Stack>
                    </div>
                    <div>
                        <p className="mb-2 text-xs font-medium text-muted-foreground uppercase">
                            Horizontal stack with space-between
                        </p>
                        <Stack direction="row" justify="between" className="max-w-md">
                            <div className="rounded-md border border-border bg-muted p-3 text-sm">
                                Start
                            </div>
                            <div className="rounded-md border border-border bg-muted p-3 text-sm">
                                End
                            </div>
                        </Stack>
                    </div>
                </div>
            </div>

            {/* Container */}
            <div>
                <h3 className="mb-4 text-lg font-semibold text-foreground">Container</h3>
                <div className="space-y-3">
                    {(['sm', 'md', 'lg'] as const).map((size) => (
                        <Container
                            key={size}
                            maxWidth={size}
                            className="rounded-md border border-dashed border-border bg-muted/30 py-3 text-center text-sm text-muted-foreground"
                        >
                            Container maxWidth=&quot;{size}&quot;
                        </Container>
                    ))}
                </div>
            </div>

            {/* Affix */}
            <div>
                <h3 className="mb-4 text-lg font-semibold text-foreground">Affix</h3>
                <p className="text-sm text-muted-foreground">
                    Affix uses CSS <code className="text-xs">position: sticky</code> to pin content
                    when scrolled past. It gains a shadow when stuck. This component works best
                    observed in a full page scroll context.
                </p>
            </div>

            {/* AspectRatio */}
            <div>
                <h3 className="mb-4 text-lg font-semibold text-foreground">AspectRatio</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div>
                        <p className="mb-2 text-xs font-medium text-muted-foreground uppercase">
                            16:9
                        </p>
                        <AspectRatio ratio={16 / 9}>
                            <div className="flex h-full w-full items-center justify-center rounded-md bg-muted text-sm text-muted-foreground">
                                16:9
                            </div>
                        </AspectRatio>
                    </div>
                    <div>
                        <p className="mb-2 text-xs font-medium text-muted-foreground uppercase">
                            4:3
                        </p>
                        <AspectRatio ratio={4 / 3}>
                            <div className="flex h-full w-full items-center justify-center rounded-md bg-muted text-sm text-muted-foreground">
                                4:3
                            </div>
                        </AspectRatio>
                    </div>
                    <div>
                        <p className="mb-2 text-xs font-medium text-muted-foreground uppercase">
                            1:1
                        </p>
                        <AspectRatio ratio={1}>
                            <div className="flex h-full w-full items-center justify-center rounded-md bg-muted text-sm text-muted-foreground">
                                1:1
                            </div>
                        </AspectRatio>
                    </div>
                </div>
            </div>
        </div>
    );
}
