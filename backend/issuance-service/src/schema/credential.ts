import { z } from 'zod';

// Primitive JSON-safe types
const prim = z.union([z.string(), z.number(), z.boolean(), z.null()]);

export const credentialSchema = z.object({
  subject: z.string().min(1, 'subject is required'),
  issuer: z.string().min(1, 'issuer is required'),

  // If your editor complains about `.datetime`, ensure zod >= 3.22.
  // npm i zod@latest
  issuanceDate: z.string().datetime({ offset: true }).optional(),

  // Explicit key schema (z.string()) avoids the overload error
  // Values can be primitive OR array of primitives
  claims: z
    .record(z.string(), prim.or(z.array(prim)))
    .default({}),

  externalId: z.string().optional()
});

export type Credential = z.infer<typeof credentialSchema>;
