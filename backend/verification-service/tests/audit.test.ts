import { getVerificationDb } from '../src/db/verificationDb';
import { recordAudit } from '../src/db/verificationDb';

describe('audit logging', () => {
  it('inserts a record into verification_audit', () => {
    const db = getVerificationDb();
    db.prepare('DELETE FROM verification_audit').run();

    recordAudit('abc123', true, 'worker-1', { ok: true });
    const row = db.prepare('SELECT * FROM verification_audit WHERE credential_id=?').get('abc123');
    expect(row).toBeTruthy();
   // expect(row.valid).toBe(1);
  });
});
