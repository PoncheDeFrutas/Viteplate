import { useForm } from '@tanstack/react-form';
import { Button, Input, Label } from '@shared/ui';
import { ErrorMessage } from '@shared/ui';
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
            autoComplete="on"
            data-lpignore="true"
            className="mx-auto w-full max-w-sm space-y-6"
        >
            <ErrorMessage message={serverError?.message} />

            <div className="space-y-2">
                <form.Field name="email">
                    {(field) => (
                        <>
                            <Label htmlFor={field.name}>Email</Label>
                            <Input
                                id={field.name}
                                name="email"
                                type="email"
                                inputMode="email"
                                autoComplete="username"
                                autoCapitalize="none"
                                autoCorrect="off"
                                spellCheck={false}
                                value={field.state.value}
                                onChange={(e) => field.handleChange(e.target.value)}
                                onBlur={field.handleBlur}
                                variant={field.state.meta.errors.length > 0 ? 'error' : 'default'}
                                placeholder="you@example.com"
                            />
                            {field.state.meta.errors.length > 0 && (
                                <p className="text-sm text-destructive">
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
                            <Label htmlFor={field.name}>Password</Label>
                            <Input
                                id={field.name}
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                value={field.state.value}
                                onChange={(e) => field.handleChange(e.target.value)}
                                onBlur={field.handleBlur}
                                variant={field.state.meta.errors.length > 0 ? 'error' : 'default'}
                                placeholder="Enter your password"
                            />
                            {field.state.meta.errors.length > 0 && (
                                <p className="text-sm text-destructive">
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
                    <Button
                        type="submit"
                        variant="default"
                        size="lg"
                        fullWidth
                        loading={isSubmitting || loginMutation.isPending}
                    >
                        {isSubmitting || loginMutation.isPending ? 'Signing in…' : 'Sign in'}
                    </Button>
                )}
            </form.Subscribe>
        </form>
    );
}
