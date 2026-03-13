import { z } from 'zod';
import { roleSchema } from './types';

export const userSchema = z.object({
    id: z.string().min(1),
    email: z.email(),
    name: z.string().min(1),
    role: roleSchema,
});

export type User = z.infer<typeof userSchema>;
