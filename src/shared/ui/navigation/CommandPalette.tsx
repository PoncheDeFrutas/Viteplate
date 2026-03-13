import { Command } from 'cmdk';
import { motion, AnimatePresence } from 'motion/react';
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
    return (
        <AnimatePresence>
            {open && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        key="backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="fixed inset-0 z-50 bg-black/60"
                        onClick={() => onOpenChange(false)}
                        aria-hidden
                    />

                    {/* Panel */}
                    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]">
                        <motion.div
                            key="panel"
                            initial={{ opacity: 0, scale: 0.96, y: -8 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.96, y: -8 }}
                            transition={{ duration: 0.15 }}
                        >
                            <Command
                                className={cn(
                                    'w-full max-w-lg overflow-hidden rounded-lg border border-border bg-popover shadow-2xl',
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
                                        className="flex h-11 w-full bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => onOpenChange(false)}
                                        className="shrink-0 rounded-sm p-1 text-muted-foreground opacity-70 transition-opacity hover:opacity-100 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                                        aria-label="Close"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                                <Command.List className="max-h-80 overflow-y-auto p-2">
                                    {children}
                                </Command.List>
                            </Command>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
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
                '[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground',
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
                'data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground',
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
