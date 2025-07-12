"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nock_1 = __importDefault(require("nock"));
const client_1 = require("../src/client");
const client = new client_1.OddsClient();
describe('OddsClient', () => {
    const sport = 'baseball_mlb';
    const base = 'https://api.the-odds-api.com';
    afterEach(() => {
        nock_1.default.cleanAll();
    });
    it('parses moneyline odds response', async () => {
        const mockResponse = [
            {
                id: '1',
                sport_key: sport,
                sport_title: 'MLB',
                commence_time: new Date().toISOString(),
                home_team: 'Boston Red Sox',
                away_team: 'New York Yankees',
                bookmakers: [],
            },
        ];
        (0, nock_1.default)(base)
            .get(`/v4/sports/${sport}/odds`)
            .query(true)
            .reply(200, mockResponse);
        const data = await client.getMoneylineOdds(sport);
        expect(data).toEqual(mockResponse);
    });
});
