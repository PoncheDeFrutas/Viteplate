import type { ZodSchema } from 'zod';

/**
 * Strictly validates `data` against a Zod `schema` and returns the parsed result.
 *
 * Throws a `ZodError` if validation fails. Use this for trusted boundaries
 * where invalid data should halt execution (e.g. API response parsing).
 * For soft validation with fallbacks, use `schema.safeParse()` instead.
 *
 * @param schema - The Zod schema to validate against.
 * @param data   - The unknown data to parse.
 * @returns The validated and typed data.
 * @throws {ZodError} When the data does not conform to the schema.
 */
export function parseWithSchema<T>(schema: ZodSchema<T>, data: unknown): T {
    return schema.parse(data);
}
