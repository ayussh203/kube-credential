"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../src/app"));
const sqlite_1 = require("../src/db/sqlite");
const sample = () => ({
    subject: 'did:example:alice',
    issuer: 'did:example:issuer',
    claims: { level: 'gold', tags: ['a', 'b', 1] }
});
describe('POST /api/issue', () => {
    beforeEach(() => (0, sqlite_1.resetDb)());
    it('issues a new credential and returns worker info', async () => {
        const res = await (0, supertest_1.default)(app_1.default).post('/api/issue').send(sample());
        expect(res.status).toBe(201);
        expect(res.body.message).toMatch(/^credential issued by worker-/);
        expect(typeof res.body.credentialId).toBe('string');
        expect(typeof res.body.issuedBy).toBe('string');
        expect(typeof res.body.issuedAt).toBe('string');
        expect(typeof res.body.payload.issuanceDate).toBe('string');
    });
    it('is idempotent: same payload returns "already issued"', async () => {
        const first = await (0, supertest_1.default)(app_1.default).post('/api/issue').send(sample());
        expect(first.status).toBe(201);
        const second = await (0, supertest_1.default)(app_1.default).post('/api/issue').send(sample());
        expect(second.status).toBe(200);
        expect(second.body.message).toBe('already issued');
    });
});
