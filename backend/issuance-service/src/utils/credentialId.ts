import { sha256Stable } from './hash';
import type { Credential } from '../schema/credential';

/**
 * Deterministic id based on fields that define the credential's identity.
 * We ignore issuanceDate (it may be server-filled) and any externalId.
 */
export function computeCredentialId(c: Credential): string {
  const basis = {
    subject: c.subject,
    issuer: c.issuer,
    claims: c.claims
  };
  return sha256Stable(basis);
}
