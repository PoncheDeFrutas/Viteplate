import { z } from 'zod';

type EnvDefaults = {
    VITE_API_BASE_URL: string;
    VITE_ENABLE_MSW: boolean;
    VITE_ENABLE_DEBUG?: boolean;
};

const DEFAULT_ENV: EnvDefaults = {
    VITE_API_BASE_URL: 'http://localhost:3000',
    VITE_ENABLE_MSW: true,
    VITE_ENABLE_DEBUG: false,
};

type EnvKey = keyof typeof DEFAULT_ENV;

type RawEnv = {
    VITE_API_BASE_URL: string | undefined;
    VITE_ENABLE_MSW: string | boolean | undefined;
    VITE_ENABLE_DEBUG: string | boolean | undefined;
};

const rawEnv: RawEnv = {
    VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
    VITE_ENABLE_MSW: import.meta.env.VITE_ENABLE_MSW,
    VITE_ENABLE_DEBUG: import.meta.env.VITE_ENABLE_DEBUG,
};

const booleanEnvSchema = z.preprocess((value) => {
    if (typeof value === 'boolean') {
        return value;
    }

    if (typeof value === 'string') {
        const normalizedValue = value.trim().toLowerCase();

        if (normalizedValue === 'true') {
            return true;
        }

        if (normalizedValue === 'false') {
            return false;
        }
    }

    return value;
}, z.boolean());

const envSchema = z.object({
    VITE_API_BASE_URL: z.url(),
    VITE_ENABLE_MSW: booleanEnvSchema,
    VITE_ENABLE_DEBUG: booleanEnvSchema.optional(),
});

function warnFallback(key: EnvKey, fallbackValue: EnvDefaults[EnvKey], reason: string) {
    if (typeof console === 'undefined') {
        return;
    }

    console.warn(
        `[shared/config] ${key} no está configurada correctamente. Se usará el valor por defecto "${String(
            fallbackValue,
        )}". Motivo: ${reason}. Revisa tu archivo .env.`,
    );
}

function resolveEnvValue<Key extends EnvKey>(
    key: Key,
    value: RawEnv[Key],
    schema: z.ZodType<EnvDefaults[Key]>,
): EnvDefaults[Key] {
    if (value === undefined || value === '') {
        const fallbackValue = DEFAULT_ENV[key];

        warnFallback(key, fallbackValue, 'variable ausente');

        return fallbackValue;
    }

    const parsedValue = schema.safeParse(value);

    if (!parsedValue.success) {
        const fallbackValue = DEFAULT_ENV[key];
        const reason = parsedValue.error.issues[0]?.message ?? 'valor inválido';

        warnFallback(key, fallbackValue, reason);

        return fallbackValue;
    }

    return parsedValue.data;
}

export const env = {
    apiBaseUrl: resolveEnvValue(
        'VITE_API_BASE_URL',
        rawEnv.VITE_API_BASE_URL,
        envSchema.shape.VITE_API_BASE_URL,
    ),
    enableMsw: resolveEnvValue(
        'VITE_ENABLE_MSW',
        rawEnv.VITE_ENABLE_MSW,
        envSchema.shape.VITE_ENABLE_MSW,
    ),
    enableDebug: resolveEnvValue(
        'VITE_ENABLE_DEBUG',
        rawEnv.VITE_ENABLE_DEBUG,
        envSchema.shape.VITE_ENABLE_DEBUG,
    ),
} as const;

export type Env = typeof env;
