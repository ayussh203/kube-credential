"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../src/app"));
describe('Health endpoints', () => {
    it('GET /healthz returns ok + worker', async () => {
        const res = await (0, supertest_1.default)(app_1.default).get('/healthz');
        expect(res.status).toBe(200);
        expect(res.body.status).toBe('ok');
        expect(typeof res.body.worker).toBe('string');
    });
    it('GET /readyz returns ready', async () => {
        const res = await (0, supertest_1.default)(app_1.default).get('/readyz');
        expect(res.status).toBe(200);
        expect(res.body.ready).toBe(true);
    });
});
