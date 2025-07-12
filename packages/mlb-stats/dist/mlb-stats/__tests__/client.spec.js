"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nock_1 = __importDefault(require("nock"));
const client_1 = require("../src/client");
describe('MlbStatsClient', () => {
    const client = new client_1.MlbStatsClient();
    const base = 'https://statsapi.mlb.com';
    const date = '2024-04-01';
    afterEach(() => {
        nock_1.default.cleanAll();
    });
    it('fetches schedule data', async () => {
        const mockResponse = {
            dates: [
                {
                    date,
                    games: [],
                },
            ],
        };
        (0, nock_1.default)(base)
            .get('/api/v1/schedule')
            .query({ date })
            .reply(200, mockResponse);
        const data = await client.getSchedule(date);
        expect(data).toEqual(mockResponse);
    });
});
