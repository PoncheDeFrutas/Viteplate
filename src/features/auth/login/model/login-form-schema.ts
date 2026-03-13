import { z } from 'zod';

// ---------------------------------------------------------------------------
// Login form validation schema
// ---------------------------------------------------------------------------

/**
 * Client-side validation for the login form.
 * Provides user-facing error messages for immediate feedback.
 * The DTO schema handles the wire format; this schema handles the UX.
 */
export const loginFormSchema = z.object({
    email: z.email('Please enter a valid email address.'),
    password: z.string().min(1, 'Password is required.'),
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;
