import type { ReactNode } from 'react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ToastVariant = 'default' | 'success' | 'warning' | 'destructive' | 'info';

interface ToastMessage {
    id: string;
    variant: ToastVariant;
    title: string;
    description?: string;
    action?: ReactNode;
    duration?: number;
}

// ---------------------------------------------------------------------------
// Imperative toast store (Zustand-free, simple approach)
// ---------------------------------------------------------------------------

type ToastListener = (toasts: ToastMessage[]) => void;

let toasts: ToastMessage[] = [];
let listeners: ToastListener[] = [];
let idCounter = 0;

function emitChange() {
    for (const listener of listeners) {
        listener(toasts);
    }
}

/**
 * Imperative toast API.
 *
 * ```ts
 * toast({ title: 'Saved', variant: 'success' });
 * ```
 */
export function toast(message: Omit<ToastMessage, 'id'>) {
    const id = String(++idCounter);
    toasts = [...toasts, { ...message, id }];
    emitChange();
    return id;
}

/** Remove a specific toast by id. */
export function dismissToast(id: string) {
    toasts = toasts.filter((t) => t.id !== id);
    emitChange();
}

/** Subscribe to toast changes. Returns an unsubscribe function. */
export function subscribeToasts(listener: ToastListener): () => void {
    listeners = [...listeners, listener];
    return () => {
        listeners = listeners.filter((l) => l !== listener);
    };
}

/** Get current toasts (snapshot). */
export function getToasts(): ToastMessage[] {
    return toasts;
}

export type { ToastMessage, ToastVariant };
