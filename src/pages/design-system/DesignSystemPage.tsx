import { lazy, Suspense, useMemo } from 'react';
import { Container, Spinner, Tabs, TabsList, TabsTrigger, TabsContent } from '@shared/ui';

// ---------------------------------------------------------------------------
// Lazy-loaded section components (only the active tab renders)
// ---------------------------------------------------------------------------

const InputSection = lazy(() =>
    import('./sections/InputSection').then((m) => ({ default: m.InputSection })),
);
const DisplaySection = lazy(() =>
    import('./sections/DisplaySection').then((m) => ({ default: m.DisplaySection })),
);
const FeedbackSection = lazy(() =>
    import('./sections/FeedbackSection').then((m) => ({ default: m.FeedbackSection })),
);
const OverlaySection = lazy(() =>
    import('./sections/OverlaySection').then((m) => ({ default: m.OverlaySection })),
);
const NavigationSection = lazy(() =>
    import('./sections/NavigationSection').then((m) => ({ default: m.NavigationSection })),
);
const LayoutSection = lazy(() =>
    import('./sections/LayoutSection').then((m) => ({ default: m.LayoutSection })),
);

// ---------------------------------------------------------------------------
// Tab definitions
// ---------------------------------------------------------------------------

interface TabDef {
    value: string;
    label: string;
    component: React.LazyExoticComponent<React.ComponentType>;
}

const TABS: TabDef[] = [
    { value: 'input', label: 'Input', component: InputSection },
    { value: 'display', label: 'Display', component: DisplaySection },
    { value: 'feedback', label: 'Feedback', component: FeedbackSection },
    { value: 'overlay', label: 'Overlay', component: OverlaySection },
    { value: 'navigation', label: 'Navigation', component: NavigationSection },
    { value: 'layout', label: 'Layout', component: LayoutSection },
];

// ---------------------------------------------------------------------------
// Fallback spinner
// ---------------------------------------------------------------------------

function SectionFallback() {
    return (
        <div className="flex items-center justify-center py-16">
            <Spinner size="lg" label="Loading section" />
        </div>
    );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export function DesignSystemPage() {
    const tabItems = useMemo(() => TABS, []);

    return (
        <Container maxWidth="2xl" className="py-12">
            <header className="mb-10 space-y-2">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Design System</h1>
                <p className="text-sm text-muted-foreground">
                    Interactive showcase of every shared UI component and its variants. Dev-only —
                    this page is tree-shaken from production builds.
                </p>
            </header>

            <Tabs defaultValue="input" animated>
                <TabsList className="mb-8 flex flex-wrap">
                    {tabItems.map((tab) => (
                        <TabsTrigger key={tab.value} value={tab.value}>
                            {tab.label}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {tabItems.map((tab) => {
                    const Section = tab.component;
                    return (
                        <TabsContent key={tab.value} value={tab.value}>
                            <Suspense fallback={<SectionFallback />}>
                                <Section />
                            </Suspense>
                        </TabsContent>
                    );
                })}
            </Tabs>
        </Container>
    );
}
