import type { Credential } from '../schema/credential';
import { computeCredentialId } from '../utils/credentialId';
import { findIssuedById } from '../db/issuanceDb';
import { getWorkerId } from '../utils/worker';
import { recordAudit } from '../db/verificationDb';

export interface VerifyResultValid {
  valid: true;
  credentialId: string;
  issuedBy: string;
  issuedAt: string;
  verifiedBy: string; // worker
}

export interface VerifyResultInvalid {
  valid: false;
  message: string;
  verifiedBy: string;
}

export type VerifyResult = VerifyResultValid | VerifyResultInvalid;

export class VerificationService {
  verify(input: Credential): VerifyResult {
    const credentialId = computeCredentialId(input);
    const record = findIssuedById(credentialId);
    const worker = getWorkerId();

    let result: VerifyResult;

    if (!record) {
      result = {
        valid: false,
        message: 'credential not issued',
        verifiedBy: worker
      };
    } else {
      result = {
        valid: true,
        credentialId,
        issuedBy: record.issuedBy,
        issuedAt: record.issuedAt,
        verifiedBy: worker
      };
    }
    try {
      recordAudit(credentialId, result.valid, worker, result);
    } catch (err) {
      console.error('audit log failed', err);
    }

    return result;
  }
}

export const verificationService = new VerificationService();
