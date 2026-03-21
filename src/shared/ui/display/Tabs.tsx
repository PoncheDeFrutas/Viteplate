import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cn } from '@shared/lib/cn';
import type { ComponentPropsWithoutRef } from 'react';

// ---------------------------------------------------------------------------
// Tabs (root)
// ---------------------------------------------------------------------------

type RadixTabsProps = ComponentPropsWithoutRef<typeof TabsPrimitive.Root>;

interface TabsProps extends RadixTabsProps {
    animated?: boolean;
}

/**
 * Tabs root. Pass `animated` to enable a SegmentedControl-style sliding indicator.
 *
 * When `animated` is set the component tracks the active value internally so it
 * can feed it to every `TabsTrigger` via context.
 */
export function Tabs({ animated, defaultValue, value, onValueChange, ...props }: TabsProps) {
    void animated;
    return (
        <TabsPrimitive.Root
            defaultValue={defaultValue}
            value={value}
            onValueChange={onValueChange}
            {...props}
        />
    );
}

// ---------------------------------------------------------------------------
// TabsList
// ---------------------------------------------------------------------------

type TabsListProps = ComponentPropsWithoutRef<typeof TabsPrimitive.List>;

/**
 * Horizontal tab bar container.
 */
export function TabsList({ className, ...props }: TabsListProps) {
    return (
        <TabsPrimitive.List
            className={cn(
                'inline-flex h-10 items-center justify-center border border-border bg-muted p-1 text-muted-foreground',
                className,
            )}
            {...props}
        />
    );
}

// ---------------------------------------------------------------------------
// TabsTrigger
// ---------------------------------------------------------------------------

type TabsTriggerProps = ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>;

/**
 * Individual tab trigger button.
 * When inside an `animated` `Tabs`, renders a sliding indicator behind the active tab.
 */
export function TabsTrigger({ className, children, value, ...props }: TabsTriggerProps) {
    return (
        <TabsPrimitive.Trigger
            value={value}
            className={cn(
                'inline-flex items-center justify-center whitespace-nowrap rounded px-3 py-1.5 text-sm font-medium',
                'focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none',
                'disabled:pointer-events-none disabled:opacity-50',
                'data-[state=active]:bg-background data-[state=active]:text-foreground',
                className,
            )}
            {...props}
        >
            {children}
        </TabsPrimitive.Trigger>
    );
}

// ---------------------------------------------------------------------------
// TabsContent
// ---------------------------------------------------------------------------

type TabsContentProps = ComponentPropsWithoutRef<typeof TabsPrimitive.Content>;

/**
 * Tab content panel. Shown when the corresponding trigger is active.
 */
export function TabsContent({ className, ...props }: TabsContentProps) {
    return (
        <TabsPrimitive.Content
            data-tab-content
            className={cn(
                'mt-2 ring-offset-background',
                'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none',
                className,
            )}
            {...props}
        />
    );
}
