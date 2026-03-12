import type { ZodSchema } from 'zod';

export function parseWithSchema<T>(schema: ZodSchema<T>, data: unknown): T {
    return schema.parse(data);
}
