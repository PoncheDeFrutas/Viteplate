import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges class names using `clsx` for conditional logic and `twMerge`
 * for deduplicating/overriding conflicting Tailwind CSS utilities.
 *
 * @example
 * cn('px-4 py-2', isActive && 'bg-primary', className)
 */
export function cn(...inputs: ClassValue[]): string {
    return twMerge(clsx(inputs));
}
