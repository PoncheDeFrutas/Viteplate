import * as NavMenuPrimitive from '@radix-ui/react-navigation-menu';
import { cn } from '@shared/lib/cn';
import type { ComponentPropsWithoutRef } from 'react';

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

type NavigationMenuProps = ComponentPropsWithoutRef<typeof NavMenuPrimitive.Root>;

export function NavigationMenu({ className, children, ...props }: NavigationMenuProps) {
    return (
        <NavMenuPrimitive.Root
            className={cn(
                'relative z-10 flex max-w-max flex-1 items-center justify-center',
                className,
            )}
            {...props}
        >
            {children}
            <NavigationMenuViewport />
        </NavMenuPrimitive.Root>
    );
}

// ---------------------------------------------------------------------------
// List
// ---------------------------------------------------------------------------

type NavigationMenuListProps = ComponentPropsWithoutRef<typeof NavMenuPrimitive.List>;

export function NavigationMenuList({ className, ...props }: NavigationMenuListProps) {
    return (
        <NavMenuPrimitive.List
            className={cn(
                'group flex flex-1 list-none items-center justify-center gap-1',
                className,
            )}
            {...props}
        />
    );
}

// ---------------------------------------------------------------------------
// Item
// ---------------------------------------------------------------------------

export const NavigationMenuItem = NavMenuPrimitive.Item;

// ---------------------------------------------------------------------------
// Trigger
// ---------------------------------------------------------------------------

type NavigationMenuTriggerProps = ComponentPropsWithoutRef<typeof NavMenuPrimitive.Trigger>;

export function NavigationMenuTrigger({
    className,
    children,
    ...props
}: NavigationMenuTriggerProps) {
    return (
        <NavMenuPrimitive.Trigger
            className={cn(
                'group inline-flex h-9 w-max items-center justify-center rounded border border-transparent bg-transparent px-3 py-1 text-sm',
                'focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none',
                'disabled:pointer-events-none disabled:opacity-50',
                'data-[state=open]:border-border',
                className,
            )}
            {...props}
        >
            {children}
            <svg
                className="ml-1 h-3 w-3"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 12 12"
                fill="none"
                aria-hidden
            >
                <path
                    d="M2 4l4 4 4-4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </NavMenuPrimitive.Trigger>
    );
}

// ---------------------------------------------------------------------------
// Content
// ---------------------------------------------------------------------------

type NavigationMenuContentProps = ComponentPropsWithoutRef<typeof NavMenuPrimitive.Content>;

export function NavigationMenuContent({ className, ...props }: NavigationMenuContentProps) {
    return (
        <NavMenuPrimitive.Content
            className={cn('left-0 top-0 w-full md:absolute md:w-auto', className)}
            {...props}
        />
    );
}

// ---------------------------------------------------------------------------
// Link
// ---------------------------------------------------------------------------

type NavigationMenuLinkProps = ComponentPropsWithoutRef<typeof NavMenuPrimitive.Link>;

export function NavigationMenuLink({ className, ...props }: NavigationMenuLinkProps) {
    return (
        <NavMenuPrimitive.Link
            className={cn(
                'block select-none rounded border border-transparent p-2 leading-none no-underline outline-none',
                'focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none',
                className,
            )}
            {...props}
        />
    );
}

// ---------------------------------------------------------------------------
// Viewport
// ---------------------------------------------------------------------------

function NavigationMenuViewport() {
    return (
        <div className="absolute left-0 top-full flex justify-center">
            <NavMenuPrimitive.Viewport
                className={cn(
                    'relative mt-1.5 h-(--radix-navigation-menu-viewport-height) w-full overflow-hidden border border-border bg-popover text-popover-foreground',
                    'md:w-[var(--radix-navigation-menu-viewport-width)]',
                )}
            />
        </div>
    );
}

// ---------------------------------------------------------------------------
// Indicator
// ---------------------------------------------------------------------------

type NavigationMenuIndicatorProps = ComponentPropsWithoutRef<typeof NavMenuPrimitive.Indicator>;

export function NavigationMenuIndicator({ className, ...props }: NavigationMenuIndicatorProps) {
    return (
        <NavMenuPrimitive.Indicator
            className={cn(
                'top-full z-1 flex h-1.5 items-end justify-center overflow-hidden',
                className,
            )}
            {...props}
        >
            <div className="relative top-[60%] h-2 w-2 rotate-45 bg-border" />
        </NavMenuPrimitive.Indicator>
    );
}
