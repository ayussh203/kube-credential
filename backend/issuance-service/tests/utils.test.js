"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hash_1 = require("../src/utils/hash");
const credentialId_1 = require("../src/utils/credentialId");
describe('sha256Stable', () => {
    it('produces same hash regardless of object key order', () => {
        const a = { x: 1, y: { b: 2, a: 1 }, arr: [3, 2, 1] };
        const b = { y: { a: 1, b: 2 }, arr: [3, 2, 1], x: 1 };
        expect((0, hash_1.sha256Stable)(a)).toBe((0, hash_1.sha256Stable)(b));
    });
});
describe('computeCredentialId', () => {
    const base = {
        subject: 'did:example:alice',
        issuer: 'did:example:issuer',
        claims: { level: 'gold', score: 95 },
        issuanceDate: '2024-01-01T00:00:00.000Z'
    };
    it('ignores issuanceDate when computing id', () => {
        const id1 = (0, credentialId_1.computeCredentialId)(base);
        const id2 = (0, credentialId_1.computeCredentialId)({ ...base, issuanceDate: '2024-02-02T00:00:00.000Z' });
        expect(id1).toBe(id2);
    });
    it('changes when claims change', () => {
        const id1 = (0, credentialId_1.computeCredentialId)(base);
        const id2 = (0, credentialId_1.computeCredentialId)({ ...base, claims: { level: 'gold' } });
        expect(id1).not.toBe(id2);
    });
});
