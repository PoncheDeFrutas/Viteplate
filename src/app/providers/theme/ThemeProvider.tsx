import { useCallback, useEffect, useState } from 'react';
import { applyThemeToDocument, getStoredTheme, setStoredTheme } from '@shared/lib/theme';
import type { Theme } from '@shared/lib/theme';
import type { ReactNode } from 'react';
import { ThemeContext } from './theme-context';

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

interface ThemeProviderProps {
    children: ReactNode;
}

/**
 * Provides the current theme and actions to switch it.
 *
 * On mount it reads the persisted preference (or falls back to the OS
 * setting), applies the `dark` class to `<html>`, and listens for
 * system-level changes to `prefers-color-scheme`.
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
    const [theme, setThemeState] = useState<Theme>(getStoredTheme);

    // Apply to DOM + persist whenever the theme changes
    useEffect(() => {
        applyThemeToDocument(theme);
        setStoredTheme(theme);
    }, [theme]);

    // Listen for OS-level preference changes
    useEffect(() => {
        const media = window.matchMedia('(prefers-color-scheme: dark)');

        function handleChange(e: MediaQueryListEvent) {
            setThemeState(e.matches ? 'dark' : 'light');
        }

        media.addEventListener('change', handleChange);
        return () => media.removeEventListener('change', handleChange);
    }, []);

    const toggleTheme = useCallback(() => {
        setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
    }, []);

    const setTheme = useCallback((next: Theme) => {
        setThemeState(next);
    }, []);

    return <ThemeContext value={{ theme, toggleTheme, setTheme }}>{children}</ThemeContext>;
}
