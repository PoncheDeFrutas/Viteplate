import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, Folder, FileText } from 'lucide-react';
import { cn } from '@shared/lib/cn';
import type { ReactNode } from 'react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface TreeNode {
    /** Unique identifier. */
    id: string;
    /** Display label. */
    label: string;
    /** Optional icon override. */
    icon?: ReactNode;
    /** Child nodes (makes this a branch). */
    children?: TreeNode[];
}

interface TreeProps {
    /** Tree data. */
    data: TreeNode[];
    /** Called when a leaf node is selected. */
    onSelect?: (node: TreeNode) => void;
    /** IDs of initially expanded branch nodes. */
    defaultExpanded?: string[];
    /** Additional class names. */
    className?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Recursive tree view with animated expand/collapse.
 */
export function Tree({ data, onSelect, defaultExpanded, className }: TreeProps) {
    return (
        <ul role="tree" className={cn('space-y-0.5 text-sm', className)}>
            {data.map((node) => (
                <TreeItem
                    key={node.id}
                    node={node}
                    level={0}
                    onSelect={onSelect}
                    defaultExpanded={defaultExpanded}
                />
            ))}
        </ul>
    );
}

// ---------------------------------------------------------------------------
// Item (recursive)
// ---------------------------------------------------------------------------

interface TreeItemProps {
    node: TreeNode;
    level: number;
    onSelect?: (node: TreeNode) => void;
    defaultExpanded?: string[];
}

function TreeItem({ node, level, onSelect, defaultExpanded }: TreeItemProps) {
    const isBranch = Boolean(node.children?.length);
    const [expanded, setExpanded] = useState(defaultExpanded?.includes(node.id) ?? false);

    const toggle = useCallback(() => {
        if (isBranch) {
            setExpanded((prev) => !prev);
        } else {
            onSelect?.(node);
        }
    }, [isBranch, node, onSelect]);

    return (
        <li role="treeitem" aria-expanded={isBranch ? expanded : undefined}>
            <button
                type="button"
                onClick={toggle}
                className={cn(
                    'flex w-full items-center gap-1.5 rounded-sm px-2 py-1 text-left transition-colors',
                    'hover:bg-accent focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none',
                )}
                style={{ paddingLeft: `${level * 1 + 0.5}rem` }}
            >
                {/* Chevron */}
                {isBranch ? (
                    <motion.span
                        animate={{ rotate: expanded ? 90 : 0 }}
                        transition={{ duration: 0.15 }}
                        className="shrink-0"
                    >
                        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                    </motion.span>
                ) : (
                    <span className="w-3.5" />
                )}

                {/* Icon */}
                <span className="shrink-0 text-muted-foreground">
                    {node.icon ??
                        (isBranch ? (
                            <Folder className="h-4 w-4" />
                        ) : (
                            <FileText className="h-4 w-4" />
                        ))}
                </span>

                {/* Label */}
                <span className="truncate">{node.label}</span>
            </button>

            {/* Children */}
            <AnimatePresence initial={false}>
                {isBranch && expanded && (
                    <motion.ul
                        role="group"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        {node.children?.map((child) => (
                            <TreeItem
                                key={child.id}
                                node={child}
                                level={level + 1}
                                onSelect={onSelect}
                                defaultExpanded={defaultExpanded}
                            />
                        ))}
                    </motion.ul>
                )}
            </AnimatePresence>
        </li>
    );
}
