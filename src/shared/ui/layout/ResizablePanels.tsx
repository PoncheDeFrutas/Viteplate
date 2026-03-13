import { Group as PanelGroup, Panel, Separator as PanelResizeHandle } from 'react-resizable-panels';
import { cn } from '@shared/lib/cn';
import type { ComponentPropsWithoutRef, HTMLAttributes } from 'react';

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

type ResizablePanelGroupProps = ComponentPropsWithoutRef<typeof PanelGroup>;

/**
 * Resizable panel layout built on `react-resizable-panels`.
 */
export function ResizablePanelGroup({ className, ...props }: ResizablePanelGroupProps) {
    return (
        <PanelGroup
            className={cn(
                'flex h-full w-full data-[panel-group-direction=vertical]:flex-col',
                className,
            )}
            {...props}
        />
    );
}

// ---------------------------------------------------------------------------
// Panel
// ---------------------------------------------------------------------------

type ResizablePanelProps = ComponentPropsWithoutRef<typeof Panel>;

export function ResizablePanel({ ...props }: ResizablePanelProps) {
    return <Panel {...props} />;
}

// ---------------------------------------------------------------------------
// Handle
// ---------------------------------------------------------------------------

interface ResizableHandleProps extends HTMLAttributes<HTMLDivElement> {
    /** Show a visible drag indicator. */
    withHandle?: boolean;
}

export function ResizableHandle({ className, withHandle, ...props }: ResizableHandleProps) {
    return (
        <PanelResizeHandle
            className={cn(
                'relative flex w-px items-center justify-center bg-border after:absolute after:inset-y-0 after:-left-1 after:-right-1',
                'focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:outline-none',
                'data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:after:inset-x-0 data-[panel-group-direction=vertical]:after:-top-1 data-[panel-group-direction=vertical]:after:-bottom-1 data-[panel-group-direction=vertical]:after:left-auto data-[panel-group-direction=vertical]:after:right-auto',
                className,
            )}
            {...props}
        >
            {withHandle && (
                <div className="z-10 flex h-4 w-3 items-center justify-center rounded-sm border border-border bg-border">
                    <svg className="h-2.5 w-2.5" viewBox="0 0 6 10" fill="none" aria-hidden>
                        <circle cx="1" cy="1" r="0.7" fill="currentColor" />
                        <circle cx="1" cy="5" r="0.7" fill="currentColor" />
                        <circle cx="1" cy="9" r="0.7" fill="currentColor" />
                        <circle cx="5" cy="1" r="0.7" fill="currentColor" />
                        <circle cx="5" cy="5" r="0.7" fill="currentColor" />
                        <circle cx="5" cy="9" r="0.7" fill="currentColor" />
                    </svg>
                </div>
            )}
        </PanelResizeHandle>
    );
}
