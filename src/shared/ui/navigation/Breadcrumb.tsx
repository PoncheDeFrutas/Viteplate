import { ChevronRight } from 'lucide-react';
import { cn } from '@shared/lib/cn';
import type { HTMLAttributes, ReactNode } from 'react';

// ---------------------------------------------------------------------------
// Breadcrumb (root nav)
// ---------------------------------------------------------------------------

type BreadcrumbProps = HTMLAttributes<HTMLElement>;

export function Breadcrumb({ className, ...props }: BreadcrumbProps) {
    return <nav aria-label="Breadcrumb" className={className} {...props} />;
}

// ---------------------------------------------------------------------------
// BreadcrumbList
// ---------------------------------------------------------------------------

type BreadcrumbListProps = HTMLAttributes<HTMLOListElement>;

export function BreadcrumbList({ className, ...props }: BreadcrumbListProps) {
    return (
        <ol
            className={cn(
                'flex flex-wrap items-center gap-1.5 wrap-break-word text-sm text-muted-foreground sm:gap-2.5',
                className,
            )}
            {...props}
        />
    );
}

// ---------------------------------------------------------------------------
// BreadcrumbItem
// ---------------------------------------------------------------------------

type BreadcrumbItemProps = HTMLAttributes<HTMLLIElement>;

export function BreadcrumbItem({ className, ...props }: BreadcrumbItemProps) {
    return <li className={cn('inline-flex items-center gap-1.5', className)} {...props} />;
}

// ---------------------------------------------------------------------------
// BreadcrumbLink
// ---------------------------------------------------------------------------

interface BreadcrumbLinkProps extends HTMLAttributes<HTMLAnchorElement> {
    href?: string;
    children: ReactNode;
}

export function BreadcrumbLink({ className, ...props }: BreadcrumbLinkProps) {
    return <a className={cn('underline', className)} {...props} />;
}

// ---------------------------------------------------------------------------
// BreadcrumbPage (current)
// ---------------------------------------------------------------------------

type BreadcrumbPageProps = HTMLAttributes<HTMLSpanElement>;

export function BreadcrumbPage({ className, ...props }: BreadcrumbPageProps) {
    return (
        <span
            role="link"
            aria-disabled="true"
            aria-current="page"
            className={cn('font-normal text-foreground', className)}
            {...props}
        />
    );
}

// ---------------------------------------------------------------------------
// BreadcrumbSeparator
// ---------------------------------------------------------------------------

interface BreadcrumbSeparatorProps extends HTMLAttributes<HTMLLIElement> {
    children?: ReactNode;
}

export function BreadcrumbSeparator({ className, children, ...props }: BreadcrumbSeparatorProps) {
    return (
        <li
            role="presentation"
            aria-hidden="true"
            className={cn('[&>svg]:h-3.5 [&>svg]:w-3.5', className)}
            {...props}
        >
            {children ?? <ChevronRight />}
        </li>
    );
}

// ---------------------------------------------------------------------------
// BreadcrumbEllipsis
// ---------------------------------------------------------------------------

type BreadcrumbEllipsisProps = HTMLAttributes<HTMLSpanElement>;

export function BreadcrumbEllipsis({ className, ...props }: BreadcrumbEllipsisProps) {
    return (
        <span
            role="presentation"
            aria-hidden="true"
            className={cn('flex h-9 w-9 items-center justify-center', className)}
            {...props}
        >
            <span className="text-muted-foreground">...</span>
            <span className="sr-only">More</span>
        </span>
    );
}
