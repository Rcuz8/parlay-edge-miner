"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nock_1 = __importDefault(require("nock"));
const client_1 = require("../src/client");
describe('estimateWinProbability', () => {
    afterEach(() => nock_1.default.cleanAll());
    it('parses probability from LLM JSON response', async () => {
        (0, nock_1.default)('https://api.openai.com')
            .post(/.*/)
            .reply(200, {
            id: 'chatcmpl-1',
            choices: [
                {
                    index: 0,
                    message: { role: 'assistant', content: '{"probability": 0.62}' },
                    finish_reason: 'stop',
                },
            ],
        });
        const prob = await (0, client_1.estimateWinProbability)({
            homeTeam: 'Boston Red Sox',
            awayTeam: 'New York Yankees',
            homeTeamIsFavorite: true,
        });
        expect(prob).toBeCloseTo(0.62);
    });
});
