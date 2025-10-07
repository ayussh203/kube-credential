import type { Credential } from '../schema/credential';
import { computeCredentialId } from '../utils/credentialId';
import { getWorkerId } from '../utils/worker';
import { sqliteRepo } from '../repo/sqliteRepo';

export interface IssueResultNew {
  status: 'new';
  message: string;         // "credential issued by worker-n"
  credentialId: string;
  issuedBy: string;
  issuedAt: string;
  payload: Credential;
}

export interface IssueResultAlready {
  status: 'already';
  message: 'already issued';
  credentialId: string;
  issuedBy: string;
  issuedAt: string;
}

export type IssueResult = IssueResultNew | IssueResultAlready;

export class IssuanceService {
  issue(input: Credential): IssueResult {
    const payload: Credential = {
      ...input,
      issuanceDate: input.issuanceDate ?? new Date().toISOString()
    };

    const credentialId = computeCredentialId(payload);
    const existing = sqliteRepo.get(credentialId);
    const worker = getWorkerId();

    if (existing) {
      return {
        status: 'already',
        message: 'already issued',
        credentialId: existing.credentialId,
        issuedBy: existing.issuedBy,
        issuedAt: existing.issuedAt
      };
    }

    const issuedAt = new Date().toISOString();
    sqliteRepo.upsert({
      credentialId,
      payload,
      issuedAt,
      issuedBy: worker
    });

    return {
      status: 'new',
      message: `credential issued by ${worker}`,
      credentialId,
      issuedBy: worker,
      issuedAt,
      payload
    };
  }
}

export const issuanceService = new IssuanceService();
