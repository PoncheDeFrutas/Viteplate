import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@shared/lib/cn';
import type { ComponentPropsWithoutRef } from 'react';

// ---------------------------------------------------------------------------
// Accordion (root — re-export for convenience)
// ---------------------------------------------------------------------------

export const Accordion = AccordionPrimitive.Root;

// ---------------------------------------------------------------------------
// AccordionItem
// ---------------------------------------------------------------------------

type AccordionItemProps = ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>;

export function AccordionItem({ className, ...props }: AccordionItemProps) {
    return (
        <AccordionPrimitive.Item
            data-accordion-item=""
            className={cn('border-b border-border', className)}
            {...props}
        />
    );
}

// ---------------------------------------------------------------------------
// AccordionTrigger
// ---------------------------------------------------------------------------

type AccordionTriggerProps = ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>;

/**
 * Accordion trigger with a rotating chevron indicator.
 */
export function AccordionTrigger({ className, children, ...props }: AccordionTriggerProps) {
    return (
        <AccordionPrimitive.Header className="flex">
            <AccordionPrimitive.Trigger
                className={cn(
                    'flex flex-1 items-center justify-between py-4 text-sm font-medium transition-all',
                    'hover:underline',
                    '[&[data-state=open]>svg]:rotate-180',
                    className,
                )}
                {...props}
            >
                {children}
                <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
            </AccordionPrimitive.Trigger>
        </AccordionPrimitive.Header>
    );
}

// ---------------------------------------------------------------------------
// AccordionContent
// ---------------------------------------------------------------------------

type AccordionContentProps = ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>;

/**
 * Animated accordion content panel.
 * CSS animations are defined in `index.css` via `[data-accordion-content]`.
 */
export function AccordionContent({ className, children, ...props }: AccordionContentProps) {
    return (
        <AccordionPrimitive.Content
            data-accordion-content=""
            className="overflow-hidden text-sm"
            {...props}
        >
            <div className={cn('pt-0 pb-4', className)}>{children}</div>
        </AccordionPrimitive.Content>
    );
}
