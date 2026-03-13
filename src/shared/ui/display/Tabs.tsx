import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cn } from '@shared/lib/cn';
import type { ComponentPropsWithoutRef } from 'react';

// ---------------------------------------------------------------------------
// Tabs (root — re-export for convenience)
// ---------------------------------------------------------------------------

export const Tabs = TabsPrimitive.Root;

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
                'inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground',
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
 */
export function TabsTrigger({ className, ...props }: TabsTriggerProps) {
    return (
        <TabsPrimitive.Trigger
            className={cn(
                'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium',
                'ring-offset-background transition-all',
                'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none',
                'disabled:pointer-events-none disabled:opacity-50',
                'data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm',
                className,
            )}
            {...props}
        />
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
            className={cn(
                'mt-2 ring-offset-background',
                'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none',
                className,
            )}
            {...props}
        />
    );
}
