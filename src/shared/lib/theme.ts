import { STORAGE_KEYS } from '@shared/config';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type Theme = 'light' | 'dark';

const THEMES: readonly Theme[] = ['light', 'dark'] as const;

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

function isTheme(value: unknown): value is Theme {
    return typeof value === 'string' && THEMES.includes(value as Theme);
}

// ---------------------------------------------------------------------------
// System preference
// ---------------------------------------------------------------------------

/** Returns the OS-level color scheme preference, defaulting to `'light'`. */
export function getSystemTheme(): Theme {
    if (typeof window === 'undefined') {
        return 'light';
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

// ---------------------------------------------------------------------------
// Persistence (localStorage)
// ---------------------------------------------------------------------------

/** Reads the persisted theme from localStorage, falling back to the system preference. */
export function getStoredTheme(): Theme {
    if (typeof window === 'undefined') {
        return 'light';
    }

    try {
        const stored = localStorage.getItem(STORAGE_KEYS.theme);
        return isTheme(stored) ? stored : getSystemTheme();
    } catch {
        // localStorage may be unavailable (e.g., private browsing in some browsers).
        return getSystemTheme();
    }
}

/** Persists the selected theme to localStorage. */
export function setStoredTheme(theme: Theme): void {
    try {
        localStorage.setItem(STORAGE_KEYS.theme, theme);
    } catch {
        // Silently ignore — theme will fall back to system preference on next visit.
    }
}

// ---------------------------------------------------------------------------
// DOM
// ---------------------------------------------------------------------------

/**
 * Applies the theme by toggling the `dark` class on the `<html>` element.
 *
 * When the View Transitions API is available (Chromium 111+) the change is
 * wrapped in `document.startViewTransition()` so the browser cross-fades the
 * old and new snapshots at the compositor level — smooth, zero per-element
 * transition cost. On browsers that don't support the API the toggle happens
 * instantly (no degraded UX, just no animation).
 */
export function applyThemeToDocument(theme: Theme): void {
    const apply = () => {
        document.documentElement.classList.toggle('dark', theme === 'dark');

        const themeColor = theme === 'dark' ? '#050506' : '#f6f7f9';
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            metaThemeColor.setAttribute('content', themeColor);
        }
    };

    if (document.startViewTransition) {
        document.startViewTransition(apply);
    } else {
        apply();
    }
}
