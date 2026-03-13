import * as TabsPrimitive from '@radix-ui/react-tabs';
import { motion } from 'motion/react';
import { createContext, useContext, useState } from 'react';
import { cn } from '@shared/lib/cn';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

// ---------------------------------------------------------------------------
// Internal context — tracks active value for the sliding indicator
// ---------------------------------------------------------------------------

interface TabsIndicatorCtx {
    activeValue: string;
    layoutId: string;
}

const TabsIndicatorContext = createContext<TabsIndicatorCtx | null>(null);

// ---------------------------------------------------------------------------
// Tabs (root)
// ---------------------------------------------------------------------------

type RadixTabsProps = ComponentPropsWithoutRef<typeof TabsPrimitive.Root>;

interface TabsProps extends RadixTabsProps {
    /** Enable a sliding indicator behind the active trigger (like SegmentedControl). */
    animated?: boolean;
}

/**
 * Tabs root. Pass `animated` to enable a SegmentedControl-style sliding indicator.
 *
 * When `animated` is set the component tracks the active value internally so it
 * can feed it to every `TabsTrigger` via context.
 */
export function Tabs({ animated, defaultValue, value, onValueChange, ...props }: TabsProps) {
    // We need internal state only when `animated` is true so we can feed the
    // indicator context.  For the non-animated path we stay zero-overhead.
    const [internalValue, setInternalValue] = useState(value ?? defaultValue ?? '');

    const handleChange = (v: string) => {
        setInternalValue(v);
        onValueChange?.(v);
    };

    // Controlled or uncontrolled — always forward the resolved value.
    const activeValue = value ?? internalValue;

    if (!animated) {
        return (
            <TabsPrimitive.Root
                defaultValue={defaultValue}
                value={value}
                onValueChange={onValueChange}
                {...props}
            />
        );
    }

    return (
        <TabsIndicatorContext.Provider value={{ activeValue, layoutId: 'tabs-indicator' }}>
            <TabsPrimitive.Root value={activeValue} onValueChange={handleChange} {...props} />
        </TabsIndicatorContext.Provider>
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

interface TabsTriggerProps extends ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> {
    /** Provide explicit children so we can wrap them relative to the indicator. */
    children?: ReactNode;
}

/**
 * Individual tab trigger button.
 * When inside an `animated` `Tabs`, renders a sliding indicator behind the active tab.
 */
export function TabsTrigger({ className, children, value, ...props }: TabsTriggerProps) {
    const indicatorCtx = useContext(TabsIndicatorContext);
    const isActive = indicatorCtx ? indicatorCtx.activeValue === value : false;

    return (
        <TabsPrimitive.Trigger
            value={value}
            className={cn(
                'relative inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium',
                'ring-offset-background transition-colors',
                'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none',
                'disabled:pointer-events-none disabled:opacity-50',
                // When the indicator context is present the sliding span handles
                // the active background — otherwise fall back to data-state styling.
                indicatorCtx
                    ? isActive
                        ? 'text-foreground'
                        : 'text-muted-foreground'
                    : 'data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm',
                className,
            )}
            {...props}
        >
            {indicatorCtx && isActive && (
                <motion.span
                    layoutId={indicatorCtx.layoutId}
                    className="absolute inset-0 rounded-sm bg-background shadow-sm"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
            )}
            <span className="relative z-10">{children}</span>
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
