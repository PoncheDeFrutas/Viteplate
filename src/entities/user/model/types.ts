import { z } from 'zod';

/**
 * Bounded set of application roles.
 * Extend this union as new roles are introduced.
 */
export const ROLES = ['admin', 'user', 'viewer'] as const;

export const roleSchema = z.enum(ROLES);

export type Role = z.infer<typeof roleSchema>;
