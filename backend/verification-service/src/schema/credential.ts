import { z } from 'zod';

// Primitive JSON-safe types
const prim = z.union([z.string(), z.number(), z.boolean(), z.null()]);

export const credentialSchema = z.object({
  subject: z.string().min(1, 'subject is required'),
  issuer: z.string().min(1, 'issuer is required'),
  issuanceDate: z.string().datetime({ offset: true }).optional(),
  // key schema explicit to avoid TS overload confusion
  claims: z.record(z.string(), prim.or(z.array(prim))).default({}),
  externalId: z.string().optional()
});

export type Credential = z.infer<typeof credentialSchema>;
