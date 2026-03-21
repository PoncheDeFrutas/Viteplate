import { useState, useCallback } from 'react';
import { Command } from 'cmdk';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@shared/lib/cn';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ComboboxOption {
    value: string;
    label: string;
    disabled?: boolean;
}

interface ComboboxProps {
    /** Available options. */
    options: ComboboxOption[];
    /** Currently selected value. */
    value?: string;
    /** Called when an option is selected. */
    onValueChange?: (value: string) => void;
    /** Placeholder text for the trigger button. */
    placeholder?: string;
    /** Placeholder for the search input. */
    searchPlaceholder?: string;
    /** Text shown when no results match. */
    emptyMessage?: string;
    /** Additional class names for the trigger button. */
    className?: string;
    /** Disable the combobox. */
    disabled?: boolean;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Searchable select built on cmdk + Radix Popover.
 */
export function Combobox({
    options,
    value,
    onValueChange,
    placeholder = 'Select...',
    searchPlaceholder = 'Search...',
    emptyMessage = 'No results found.',
    className,
    disabled,
}: ComboboxProps) {
    const [open, setOpen] = useState(false);

    const selectedLabel = options.find((o) => o.value === value)?.label;

    const handleSelect = useCallback(
        (selected: string) => {
            onValueChange?.(selected === value ? '' : selected);
            setOpen(false);
        },
        [onValueChange, value],
    );

    return (
        <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
            <PopoverPrimitive.Trigger asChild disabled={disabled}>
                <button
                    type="button"
                    role="combobox"
                    aria-expanded={open}
                    className={cn(
                        'flex h-9 w-full items-center justify-between border border-input bg-transparent px-3 text-sm',
                        'placeholder:text-muted-foreground',
                        'focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none',
                        'disabled:cursor-not-allowed disabled:opacity-50',
                        className,
                    )}
                >
                    <span className={cn(!selectedLabel && 'text-muted-foreground')}>
                        {selectedLabel ?? placeholder}
                    </span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </button>
            </PopoverPrimitive.Trigger>

            {open && (
                <PopoverPrimitive.Portal forceMount>
                    <PopoverPrimitive.Content align="start" sideOffset={4} className="z-50">
                        <Command className="w-[--radix-popover-trigger-width] overflow-hidden border border-border bg-popover">
                            <Command.Input
                                placeholder={searchPlaceholder}
                                className="flex h-9 w-full bg-transparent px-3 text-sm outline-none placeholder:text-muted-foreground"
                            />
                            <Command.List className="max-h-60 overflow-y-auto p-1">
                                <Command.Empty className="py-4 text-center text-sm text-muted-foreground">
                                    {emptyMessage}
                                </Command.Empty>
                                {options.map((option) => (
                                    <Command.Item
                                        key={option.value}
                                        value={option.value}
                                        disabled={option.disabled}
                                        onSelect={handleSelect}
                                        className={cn(
                                            'relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none',
                                            'data-[selected=true]:bg-muted data-[selected=true]:text-foreground',
                                            'data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50',
                                        )}
                                    >
                                        <Check
                                            className={cn(
                                                'mr-2 h-4 w-4',
                                                value === option.value
                                                    ? 'opacity-100'
                                                    : 'opacity-0',
                                            )}
                                        />
                                        {option.label}
                                    </Command.Item>
                                ))}
                            </Command.List>
                        </Command>
                    </PopoverPrimitive.Content>
                </PopoverPrimitive.Portal>
            )}
        </PopoverPrimitive.Root>
    );
}
