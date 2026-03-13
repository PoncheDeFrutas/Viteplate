import { useForm } from '@tanstack/react-form';
import { loginFormSchema } from '../model/login-form-schema';
import { useLogin } from '../model/use-login';
import type { ApiError } from '@shared/api';

/**
 * Login form component using TanStack Form with Zod Standard Schema validation.
 *
 * Validates email and password on blur and submit, then delegates to
 * the `useLogin` mutation for the actual authentication flow.
 */
export function LoginForm() {
    const loginMutation = useLogin();

    const form = useForm({
        defaultValues: {
            email: '',
            password: '',
        },
        validators: {
            onSubmit: loginFormSchema,
        },
        onSubmit: ({ value }) => {
            loginMutation.mutate(value);
        },
    });

    const serverError = loginMutation.error as ApiError | null;

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                void form.handleSubmit();
            }}
            className="mx-auto w-full max-w-sm space-y-6"
        >
            {serverError && (
                <div
                    role="alert"
                    className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300"
                >
                    {serverError.message}
                </div>
            )}

            <div className="space-y-2">
                <form.Field name="email">
                    {(field) => (
                        <>
                            <label
                                htmlFor={field.name}
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                            >
                                Email
                            </label>
                            <input
                                id={field.name}
                                type="email"
                                autoComplete="email"
                                value={field.state.value}
                                onChange={(e) => field.handleChange(e.target.value)}
                                onBlur={field.handleBlur}
                                className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500"
                                placeholder="you@example.com"
                            />
                            {field.state.meta.errors.length > 0 && (
                                <p className="text-sm text-red-600 dark:text-red-400">
                                    {field.state.meta.errors[0]?.message ??
                                        String(field.state.meta.errors[0])}
                                </p>
                            )}
                        </>
                    )}
                </form.Field>
            </div>

            <div className="space-y-2">
                <form.Field name="password">
                    {(field) => (
                        <>
                            <label
                                htmlFor={field.name}
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                            >
                                Password
                            </label>
                            <input
                                id={field.name}
                                type="password"
                                autoComplete="current-password"
                                value={field.state.value}
                                onChange={(e) => field.handleChange(e.target.value)}
                                onBlur={field.handleBlur}
                                className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500"
                                placeholder="Enter your password"
                            />
                            {field.state.meta.errors.length > 0 && (
                                <p className="text-sm text-red-600 dark:text-red-400">
                                    {field.state.meta.errors[0]?.message ??
                                        String(field.state.meta.errors[0])}
                                </p>
                            )}
                        </>
                    )}
                </form.Field>
            </div>

            <form.Subscribe selector={(state) => [state.isSubmitting]}>
                {([isSubmitting]) => (
                    <button
                        type="submit"
                        disabled={isSubmitting || loginMutation.isPending}
                        className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-offset-gray-900"
                    >
                        {isSubmitting || loginMutation.isPending ? 'Signing in...' : 'Sign in'}
                    </button>
                )}
            </form.Subscribe>
        </form>
    );
}
