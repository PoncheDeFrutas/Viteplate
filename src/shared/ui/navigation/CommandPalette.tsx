import { Command } from 'cmdk';
import { Search, X } from 'lucide-react';
import { cn } from '@shared/lib/cn';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

// ---------------------------------------------------------------------------
// Root (overlay variant)
// ---------------------------------------------------------------------------

interface CommandPaletteProps {
    /** Whether the palette is open. */
    open: boolean;
    /** Callback to close the palette. */
    onOpenChange: (open: boolean) => void;
    /** Placeholder text for the search input. */
    placeholder?: string;
    /** Command items and groups. */
    children: ReactNode;
    /** Additional class names for the panel. */
    className?: string;
}

/**
 * Full-screen command palette overlay built on cmdk.
 *
 * Opens with a backdrop and centres a search panel. Compose with
 * `<CommandPaletteGroup>`, `<CommandPaletteItem>`, `<CommandPaletteSeparator>`,
 * and `<CommandPaletteEmpty>`.
 */
export function CommandPalette({
    open,
    onOpenChange,
    placeholder = 'Type a command or search...',
    children,
    className,
}: CommandPaletteProps) {
    if (!open) {
        return null;
    }

    return (
        <>
            <div
                className="fixed inset-0 z-50 bg-black/40"
                onClick={() => onOpenChange(false)}
                aria-hidden
            />
            <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]">
                <Command
                    className={cn(
                        'w-full max-w-lg overflow-hidden border border-border bg-popover',
                        className,
                    )}
                    onKeyDown={(e) => {
                        if (e.key === 'Escape') onOpenChange(false);
                    }}
                >
                    <div className="flex items-center gap-2 border-b border-border px-3">
                        <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
                        <Command.Input
                            placeholder={placeholder}
                            className="flex h-10 w-full bg-transparent py-2 text-sm outline-none placeholder:text-muted-foreground"
                        />
                        <button
                            type="button"
                            onClick={() => onOpenChange(false)}
                            className="shrink-0 p-1 focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
                            aria-label="Close"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                    <Command.List className="max-h-80 overflow-y-auto p-1">{children}</Command.List>
                </Command>
            </div>
        </>
    );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

type CommandPaletteGroupProps = ComponentPropsWithoutRef<typeof Command.Group>;

export function CommandPaletteGroup({ className, ...props }: CommandPaletteGroupProps) {
    return (
        <Command.Group
            className={cn(
                '**:[[cmdk-group-heading]]:px-2 **:[[cmdk-group-heading]]:py-1.5 **:[[cmdk-group-heading]]:text-xs **:[[cmdk-group-heading]]:font-medium **:[[cmdk-group-heading]]:text-muted-foreground',
                className,
            )}
            {...props}
        />
    );
}

type CommandPaletteItemProps = ComponentPropsWithoutRef<typeof Command.Item>;

export function CommandPaletteItem({ className, ...props }: CommandPaletteItemProps) {
    return (
        <Command.Item
            className={cn(
                'relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none',
                'data-[selected=true]:bg-muted data-[selected=true]:text-foreground',
                'data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50',
                className,
            )}
            {...props}
        />
    );
}

type CommandPaletteSeparatorProps = ComponentPropsWithoutRef<typeof Command.Separator>;

export function CommandPaletteSeparator({ className, ...props }: CommandPaletteSeparatorProps) {
    return <Command.Separator className={cn('-mx-1 my-1 h-px bg-border', className)} {...props} />;
}

type CommandPaletteEmptyProps = ComponentPropsWithoutRef<typeof Command.Empty>;

export function CommandPaletteEmpty({ className, ...props }: CommandPaletteEmptyProps) {
    return (
        <Command.Empty
            className={cn('py-6 text-center text-sm text-muted-foreground', className)}
            {...props}
        />
    );
}

// ---------------------------------------------------------------------------
// Shortcut display
// ---------------------------------------------------------------------------

type CommandPaletteShortcutProps = ComponentPropsWithoutRef<'kbd'>;

export function CommandPaletteShortcut({ className, ...props }: CommandPaletteShortcutProps) {
    return (
        <kbd
            className={cn('ml-auto text-xs tracking-widest text-muted-foreground', className)}
            {...props}
        />
    );
}
