import * as ContextMenuPrimitive from '@radix-ui/react-context-menu';
import { cn } from '@shared/lib/cn';
import { Check, ChevronRight, Circle } from 'lucide-react';
import type { ComponentPropsWithoutRef } from 'react';

// ---------------------------------------------------------------------------
// Re-exports
// ---------------------------------------------------------------------------

export const ContextMenu = ContextMenuPrimitive.Root;
export const ContextMenuTrigger = ContextMenuPrimitive.Trigger;
export const ContextMenuGroup = ContextMenuPrimitive.Group;
export const ContextMenuPortal = ContextMenuPrimitive.Portal;
export const ContextMenuSub = ContextMenuPrimitive.Sub;
export const ContextMenuRadioGroup = ContextMenuPrimitive.RadioGroup;

// ---------------------------------------------------------------------------
// Content
// ---------------------------------------------------------------------------

type ContextMenuContentProps = ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Content>;

export function ContextMenuContent({ className, ...props }: ContextMenuContentProps) {
    return (
        <ContextMenuPrimitive.Portal>
            <ContextMenuPrimitive.Content
                className={cn(
                    'z-50 min-w-[8rem] overflow-hidden border border-border bg-popover p-1 text-popover-foreground',
                    className,
                )}
                {...props}
            />
        </ContextMenuPrimitive.Portal>
    );
}

// ---------------------------------------------------------------------------
// Item
// ---------------------------------------------------------------------------

type ContextMenuItemProps = ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Item> & {
    inset?: boolean;
};

export function ContextMenuItem({ className, inset, ...props }: ContextMenuItemProps) {
    return (
        <ContextMenuPrimitive.Item
            className={cn(
                'relative flex cursor-default select-none items-center px-2 py-1.5 text-sm outline-none',
                'focus:bg-muted focus:text-foreground',
                'data-disabled:pointer-events-none data-disabled:opacity-50',
                inset && 'pl-8',
                className,
            )}
            {...props}
        />
    );
}

// ---------------------------------------------------------------------------
// CheckboxItem
// ---------------------------------------------------------------------------

type ContextMenuCheckboxItemProps = ComponentPropsWithoutRef<
    typeof ContextMenuPrimitive.CheckboxItem
>;

export function ContextMenuCheckboxItem({
    className,
    children,
    checked,
    ...props
}: ContextMenuCheckboxItemProps) {
    return (
        <ContextMenuPrimitive.CheckboxItem
            className={cn(
                'relative flex cursor-default select-none items-center py-1.5 pr-2 pl-8 text-sm outline-none',
                'focus:bg-muted focus:text-foreground',
                'data-disabled:pointer-events-none data-disabled:opacity-50',
                className,
            )}
            checked={checked}
            {...props}
        >
            <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                <ContextMenuPrimitive.ItemIndicator>
                    <Check className="h-4 w-4" />
                </ContextMenuPrimitive.ItemIndicator>
            </span>
            {children}
        </ContextMenuPrimitive.CheckboxItem>
    );
}

// ---------------------------------------------------------------------------
// RadioItem
// ---------------------------------------------------------------------------

type ContextMenuRadioItemProps = ComponentPropsWithoutRef<typeof ContextMenuPrimitive.RadioItem>;

export function ContextMenuRadioItem({ className, children, ...props }: ContextMenuRadioItemProps) {
    return (
        <ContextMenuPrimitive.RadioItem
            className={cn(
                'relative flex cursor-default select-none items-center py-1.5 pr-2 pl-8 text-sm outline-none',
                'focus:bg-muted focus:text-foreground',
                'data-disabled:pointer-events-none data-disabled:opacity-50',
                className,
            )}
            {...props}
        >
            <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                <ContextMenuPrimitive.ItemIndicator>
                    <Circle className="h-2 w-2 fill-current" />
                </ContextMenuPrimitive.ItemIndicator>
            </span>
            {children}
        </ContextMenuPrimitive.RadioItem>
    );
}

// ---------------------------------------------------------------------------
// Label
// ---------------------------------------------------------------------------

type ContextMenuLabelProps = ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Label> & {
    inset?: boolean;
};

export function ContextMenuLabel({ className, inset, ...props }: ContextMenuLabelProps) {
    return (
        <ContextMenuPrimitive.Label
            className={cn(
                'px-2 py-1.5 text-sm font-semibold text-foreground',
                inset && 'pl-8',
                className,
            )}
            {...props}
        />
    );
}

// ---------------------------------------------------------------------------
// Separator
// ---------------------------------------------------------------------------

type ContextMenuSeparatorProps = ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Separator>;

export function ContextMenuSeparator({ className, ...props }: ContextMenuSeparatorProps) {
    return (
        <ContextMenuPrimitive.Separator
            className={cn('-mx-1 my-1 h-px bg-border', className)}
            {...props}
        />
    );
}

// ---------------------------------------------------------------------------
// Shortcut
// ---------------------------------------------------------------------------

type ContextMenuShortcutProps = ComponentPropsWithoutRef<'span'>;

export function ContextMenuShortcut({ className, ...props }: ContextMenuShortcutProps) {
    return (
        <span
            className={cn('ml-auto text-xs tracking-widest text-muted-foreground', className)}
            {...props}
        />
    );
}

// ---------------------------------------------------------------------------
// SubTrigger
// ---------------------------------------------------------------------------

type ContextMenuSubTriggerProps = ComponentPropsWithoutRef<
    typeof ContextMenuPrimitive.SubTrigger
> & {
    inset?: boolean;
};

export function ContextMenuSubTrigger({
    className,
    inset,
    children,
    ...props
}: ContextMenuSubTriggerProps) {
    return (
        <ContextMenuPrimitive.SubTrigger
            className={cn(
                'flex cursor-default select-none items-center px-2 py-1.5 text-sm outline-none',
                'focus:bg-muted focus:text-foreground',
                'data-[state=open]:bg-muted data-[state=open]:text-foreground',
                inset && 'pl-8',
                className,
            )}
            {...props}
        >
            {children}
            <ChevronRight className="ml-auto h-4 w-4" />
        </ContextMenuPrimitive.SubTrigger>
    );
}

// ---------------------------------------------------------------------------
// SubContent
// ---------------------------------------------------------------------------

type ContextMenuSubContentProps = ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubContent>;

export function ContextMenuSubContent({ className, ...props }: ContextMenuSubContentProps) {
    return (
        <ContextMenuPrimitive.SubContent
            className={cn(
                'z-50 min-w-[8rem] overflow-hidden border border-border bg-popover p-1 text-popover-foreground',
                className,
            )}
            {...props}
        />
    );
}
