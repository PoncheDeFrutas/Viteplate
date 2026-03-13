import { cva } from 'class-variance-authority';
import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    MoreHorizontal,
} from 'lucide-react';
import { cn } from '@shared/lib/cn';
import type { ButtonHTMLAttributes, HTMLAttributes } from 'react';
import type { VariantProps } from 'class-variance-authority';

// ---------------------------------------------------------------------------
// Pagination (root nav)
// ---------------------------------------------------------------------------

type PaginationProps = HTMLAttributes<HTMLElement>;

export function Pagination({ className, ...props }: PaginationProps) {
    return (
        <nav
            role="navigation"
            aria-label="pagination"
            className={cn('mx-auto flex w-full justify-center', className)}
            {...props}
        />
    );
}

// ---------------------------------------------------------------------------
// PaginationContent
// ---------------------------------------------------------------------------

type PaginationContentProps = HTMLAttributes<HTMLUListElement>;

export function PaginationContent({ className, ...props }: PaginationContentProps) {
    return <ul className={cn('flex flex-row items-center gap-1', className)} {...props} />;
}

// ---------------------------------------------------------------------------
// PaginationItem
// ---------------------------------------------------------------------------

type PaginationItemProps = HTMLAttributes<HTMLLIElement>;

export function PaginationItem({ className, ...props }: PaginationItemProps) {
    return <li className={cn('', className)} {...props} />;
}

// ---------------------------------------------------------------------------
// PaginationButton variants
// ---------------------------------------------------------------------------

const paginationButtonVariants = cva(
    [
        'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors',
        'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none',
        'disabled:pointer-events-none disabled:opacity-50',
    ],
    {
        variants: {
            variant: {
                default: 'hover:bg-accent hover:text-accent-foreground',
                outline: 'border border-input hover:bg-accent hover:text-accent-foreground',
            },
            size: {
                sm: 'h-8 w-8',
                md: 'h-9 w-9',
                lg: 'h-10 w-10',
            },
            isActive: {
                true: 'border border-input bg-accent text-accent-foreground',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'md',
        },
    },
);

// ---------------------------------------------------------------------------
// PaginationButton
// ---------------------------------------------------------------------------

interface PaginationButtonProps
    extends
        ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof paginationButtonVariants> {}

export function PaginationButton({
    className,
    variant,
    size,
    isActive,
    ...props
}: PaginationButtonProps) {
    return (
        <button
            type="button"
            aria-current={isActive ? 'page' : undefined}
            className={cn(paginationButtonVariants({ variant, size, isActive }), className)}
            {...props}
        />
    );
}

// ---------------------------------------------------------------------------
// Convenience buttons
// ---------------------------------------------------------------------------

type PaginationNavButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function PaginationPrevious({ className, ...props }: PaginationNavButtonProps) {
    return (
        <PaginationButton className={cn('gap-1 pl-2.5', className)} {...props}>
            <ChevronLeft className="h-4 w-4" />
            <span>Previous</span>
        </PaginationButton>
    );
}

export function PaginationNext({ className, ...props }: PaginationNavButtonProps) {
    return (
        <PaginationButton className={cn('gap-1 pr-2.5', className)} {...props}>
            <span>Next</span>
            <ChevronRight className="h-4 w-4" />
        </PaginationButton>
    );
}

export function PaginationFirst({ className, ...props }: PaginationNavButtonProps) {
    return (
        <PaginationButton className={className} aria-label="Go to first page" {...props}>
            <ChevronsLeft className="h-4 w-4" />
        </PaginationButton>
    );
}

export function PaginationLast({ className, ...props }: PaginationNavButtonProps) {
    return (
        <PaginationButton className={className} aria-label="Go to last page" {...props}>
            <ChevronsRight className="h-4 w-4" />
        </PaginationButton>
    );
}

// ---------------------------------------------------------------------------
// Ellipsis
// ---------------------------------------------------------------------------

type PaginationEllipsisProps = HTMLAttributes<HTMLSpanElement>;

export function PaginationEllipsis({ className, ...props }: PaginationEllipsisProps) {
    return (
        <span
            aria-hidden
            className={cn('flex h-9 w-9 items-center justify-center', className)}
            {...props}
        >
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">More pages</span>
        </span>
    );
}
