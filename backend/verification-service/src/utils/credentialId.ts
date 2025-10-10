import { sha256Stable } from './hash';
import type { Credential } from '../schema/credential';

export function computeCredentialId(c: Credential): string {
  const basis = {
    subject: c.subject,
    issuer: c.issuer,
    claims: c.claims
  };
  return sha256Stable(basis);
}
