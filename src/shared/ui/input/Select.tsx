import * as SelectPrimitive from '@radix-ui/react-select';
import { cn } from '@shared/lib/cn';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import type { ComponentPropsWithoutRef } from 'react';

// ---------------------------------------------------------------------------
// Select (root — re-export for convenience)
// ---------------------------------------------------------------------------

export const Select = SelectPrimitive.Root;
export const SelectGroup = SelectPrimitive.Group;
export const SelectValue = SelectPrimitive.Value;

// ---------------------------------------------------------------------------
// Trigger
// ---------------------------------------------------------------------------

type SelectTriggerProps = ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>;

/**
 * Select trigger button. Renders the current value and a chevron icon.
 */
export function SelectTrigger({ className, children, ...props }: SelectTriggerProps) {
    return (
        <SelectPrimitive.Trigger
            className={cn(
                'flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm text-foreground',
                'placeholder:text-muted-foreground',
                'focus:ring-1 focus:ring-ring focus:outline-none',
                'disabled:cursor-not-allowed disabled:opacity-50',
                '[&>span]:line-clamp-1',
                className,
            )}
            {...props}
        >
            {children}
            <SelectPrimitive.Icon asChild>
                <ChevronDown className="h-4 w-4 opacity-50" />
            </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>
    );
}

// ---------------------------------------------------------------------------
// Scroll buttons
// ---------------------------------------------------------------------------

function SelectScrollUpButton({
    className,
    ...props
}: ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>) {
    return (
        <SelectPrimitive.ScrollUpButton
            className={cn('flex cursor-default items-center justify-center py-1', className)}
            {...props}
        >
            <ChevronUp className="h-4 w-4" />
        </SelectPrimitive.ScrollUpButton>
    );
}

function SelectScrollDownButton({
    className,
    ...props
}: ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>) {
    return (
        <SelectPrimitive.ScrollDownButton
            className={cn('flex cursor-default items-center justify-center py-1', className)}
            {...props}
        >
            <ChevronDown className="h-4 w-4" />
        </SelectPrimitive.ScrollDownButton>
    );
}

// ---------------------------------------------------------------------------
// Content
// ---------------------------------------------------------------------------

type SelectContentProps = ComponentPropsWithoutRef<typeof SelectPrimitive.Content>;

/**
 * Dropdown content panel for the select.
 */
export function SelectContent({
    className,
    children,
    position = 'popper',
    ...props
}: SelectContentProps) {
    return (
        <SelectPrimitive.Portal>
            <SelectPrimitive.Content
                data-floating-animate
                className={cn(
                    'relative z-50 max-h-96 min-w-8rem overflow-hidden rounded-md border border-border bg-popover text-popover-foreground shadow-md',
                    position === 'popper' &&
                        'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
                    className,
                )}
                position={position}
                {...props}
            >
                <SelectScrollUpButton />
                <SelectPrimitive.Viewport
                    className={cn(
                        'p-1',
                        position === 'popper' &&
                            'h-(--radix-select-trigger-height) w-full min-w-(--radix-select-trigger-width)',
                    )}
                >
                    {children}
                </SelectPrimitive.Viewport>
                <SelectScrollDownButton />
            </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
    );
}

// ---------------------------------------------------------------------------
// Label
// ---------------------------------------------------------------------------

type SelectLabelProps = ComponentPropsWithoutRef<typeof SelectPrimitive.Label>;

/**
 * Group label inside the select dropdown.
 */
export function SelectLabel({ className, ...props }: SelectLabelProps) {
    return (
        <SelectPrimitive.Label
            className={cn('py-1.5 pr-2 pl-8 text-sm font-semibold', className)}
            {...props}
        />
    );
}

// ---------------------------------------------------------------------------
// Item
// ---------------------------------------------------------------------------

type SelectItemProps = ComponentPropsWithoutRef<typeof SelectPrimitive.Item>;

/**
 * Individual option inside the select dropdown.
 */
export function SelectItem({ className, children, ...props }: SelectItemProps) {
    return (
        <SelectPrimitive.Item
            className={cn(
                'relative flex w-full cursor-default items-center rounded-sm py-1.5 pr-2 pl-8 text-sm outline-none select-none',
                'focus:bg-accent focus:text-accent-foreground',
                'data-disabled:pointer-events-none data-disabled:opacity-50',
                className,
            )}
            {...props}
        >
            <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                <SelectPrimitive.ItemIndicator>
                    <Check className="h-4 w-4" />
                </SelectPrimitive.ItemIndicator>
            </span>
            <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
        </SelectPrimitive.Item>
    );
}

// ---------------------------------------------------------------------------
// Separator
// ---------------------------------------------------------------------------

type SelectSeparatorProps = ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>;

/**
 * Visual separator between groups in the select dropdown.
 */
export function SelectSeparator({ className, ...props }: SelectSeparatorProps) {
    return (
        <SelectPrimitive.Separator
            className={cn('-mx-1 my-1 h-px bg-muted', className)}
            {...props}
        />
    );
}
