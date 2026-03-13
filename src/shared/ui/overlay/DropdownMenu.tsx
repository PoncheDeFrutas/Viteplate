import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { cn } from '@shared/lib/cn';
import { Check, ChevronRight, Circle } from 'lucide-react';
import type { ComponentPropsWithoutRef } from 'react';

// ---------------------------------------------------------------------------
// Re-exports
// ---------------------------------------------------------------------------

export const DropdownMenu = DropdownMenuPrimitive.Root;
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
export const DropdownMenuGroup = DropdownMenuPrimitive.Group;
export const DropdownMenuPortal = DropdownMenuPrimitive.Portal;
export const DropdownMenuSub = DropdownMenuPrimitive.Sub;
export const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

// ---------------------------------------------------------------------------
// SubTrigger
// ---------------------------------------------------------------------------

interface DropdownMenuSubTriggerProps extends ComponentPropsWithoutRef<
    typeof DropdownMenuPrimitive.SubTrigger
> {
    inset?: boolean;
}

export function DropdownMenuSubTrigger({
    className,
    inset,
    children,
    ...props
}: DropdownMenuSubTriggerProps) {
    return (
        <DropdownMenuPrimitive.SubTrigger
            className={cn(
                'flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none select-none',
                'focus:bg-accent data-[state=open]:bg-accent',
                inset && 'pl-8',
                className,
            )}
            {...props}
        >
            {children}
            <ChevronRight className="ml-auto h-4 w-4" />
        </DropdownMenuPrimitive.SubTrigger>
    );
}

// ---------------------------------------------------------------------------
// SubContent
// ---------------------------------------------------------------------------

type DropdownMenuSubContentProps = ComponentPropsWithoutRef<
    typeof DropdownMenuPrimitive.SubContent
>;

export function DropdownMenuSubContent({ className, ...props }: DropdownMenuSubContentProps) {
    return (
        <DropdownMenuPrimitive.SubContent
            data-floating-animate
            className={cn(
                'z-50 min-w-8rem overflow-hidden rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-lg',
                className,
            )}
            {...props}
        />
    );
}

// ---------------------------------------------------------------------------
// Content
// ---------------------------------------------------------------------------

type DropdownMenuContentProps = ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>;

export function DropdownMenuContent({
    className,
    sideOffset = 4,
    ...props
}: DropdownMenuContentProps) {
    return (
        <DropdownMenuPrimitive.Portal>
            <DropdownMenuPrimitive.Content
                sideOffset={sideOffset}
                data-floating-animate
                className={cn(
                    'z-50 min-w-8rem overflow-hidden rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md',
                    className,
                )}
                {...props}
            />
        </DropdownMenuPrimitive.Portal>
    );
}

// ---------------------------------------------------------------------------
// Item
// ---------------------------------------------------------------------------

interface DropdownMenuItemProps extends ComponentPropsWithoutRef<
    typeof DropdownMenuPrimitive.Item
> {
    inset?: boolean;
}

export function DropdownMenuItem({ className, inset, ...props }: DropdownMenuItemProps) {
    return (
        <DropdownMenuPrimitive.Item
            className={cn(
                'relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors select-none',
                'focus:bg-accent focus:text-accent-foreground',
                'data-disabled:pointer-events-none data-disabled:opacity-50',
                '[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
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

type DropdownMenuCheckboxItemProps = ComponentPropsWithoutRef<
    typeof DropdownMenuPrimitive.CheckboxItem
>;

export function DropdownMenuCheckboxItem({
    className,
    children,
    checked,
    ...props
}: DropdownMenuCheckboxItemProps) {
    return (
        <DropdownMenuPrimitive.CheckboxItem
            className={cn(
                'relative flex cursor-default items-center rounded-sm py-1.5 pr-2 pl-8 text-sm outline-none transition-colors select-none',
                'focus:bg-accent focus:text-accent-foreground',
                'data-disabled:pointer-events-none data-disabled:opacity-50',
                className,
            )}
            checked={checked}
            {...props}
        >
            <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                <DropdownMenuPrimitive.ItemIndicator>
                    <Check className="h-4 w-4" />
                </DropdownMenuPrimitive.ItemIndicator>
            </span>
            {children}
        </DropdownMenuPrimitive.CheckboxItem>
    );
}

// ---------------------------------------------------------------------------
// RadioItem
// ---------------------------------------------------------------------------

type DropdownMenuRadioItemProps = ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>;

export function DropdownMenuRadioItem({
    className,
    children,
    ...props
}: DropdownMenuRadioItemProps) {
    return (
        <DropdownMenuPrimitive.RadioItem
            className={cn(
                'relative flex cursor-default items-center rounded-sm py-1.5 pr-2 pl-8 text-sm outline-none transition-colors select-none',
                'focus:bg-accent focus:text-accent-foreground',
                'data-disabled:pointer-events-none data-disabled:opacity-50',
                className,
            )}
            {...props}
        >
            <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                <DropdownMenuPrimitive.ItemIndicator>
                    <Circle className="h-2 w-2 fill-current" />
                </DropdownMenuPrimitive.ItemIndicator>
            </span>
            {children}
        </DropdownMenuPrimitive.RadioItem>
    );
}

// ---------------------------------------------------------------------------
// Label
// ---------------------------------------------------------------------------

interface DropdownMenuLabelProps extends ComponentPropsWithoutRef<
    typeof DropdownMenuPrimitive.Label
> {
    inset?: boolean;
}

export function DropdownMenuLabel({ className, inset, ...props }: DropdownMenuLabelProps) {
    return (
        <DropdownMenuPrimitive.Label
            className={cn('px-2 py-1.5 text-sm font-semibold', inset && 'pl-8', className)}
            {...props}
        />
    );
}

// ---------------------------------------------------------------------------
// Separator
// ---------------------------------------------------------------------------

type DropdownMenuSeparatorProps = ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>;

export function DropdownMenuSeparator({ className, ...props }: DropdownMenuSeparatorProps) {
    return (
        <DropdownMenuPrimitive.Separator
            className={cn('-mx-1 my-1 h-px bg-muted', className)}
            {...props}
        />
    );
}

// ---------------------------------------------------------------------------
// Shortcut
// ---------------------------------------------------------------------------

type DropdownMenuShortcutProps = ComponentPropsWithoutRef<'span'>;

export function DropdownMenuShortcut({ className, ...props }: DropdownMenuShortcutProps) {
    return (
        <span className={cn('ml-auto text-xs tracking-widest opacity-60', className)} {...props} />
    );
}
