let handler: any;

// mock environment variables needed for config
process.env.OPENAI_API_KEY = 'test';
process.env.ODDS_API_KEY = 'test';
process.env.TWILIO_SID = 'sid';
process.env.TWILIO_TOKEN = 'token';
process.env.TWILIO_FROM = '+1000000000';
process.env.TWILIO_TO = '+1000000001';

// Minimal odds API mock data
const mockOdds = [
  {
    id: 'game1',
    sport_key: 'baseball_mlb',
    sport_title: 'MLB',
    commence_time: new Date().toISOString(),
    home_team: 'Boston Red Sox',
    away_team: 'New York Yankees',
    bookmakers: [
      {
        key: 'fanduel',
        title: 'FanDuel',
        markets: [
          {
            key: 'h2h',
            outcomes: [
              { name: 'Boston Red Sox', price: -120 },
              { name: 'New York Yankees', price: 110 },
            ],
          },
        ],
      },
    ],
  },
];

jest.mock('@odd/client', () => {
  return {
    defaultClient: { getMoneylineOdds: jest.fn() },
    OddsApiResponse: {} as any,
  };
});

// @ts-ignore
import { defaultClient as mockedOdds } from '@odd/client';

// mock OddsService
jest.mock('../src/services/odds.service', () => ({
  OddsService: class {
    getMlbMoneylineOdds = jest.fn().mockResolvedValue(mockOdds);
  },
}));

jest.mock('../src/services/parlay.service', () => ({
  ParlayService: class {
    findPositiveEdgeParlays = jest.fn().mockResolvedValue([{ edge: 0.1, legs: [], impliedProbability: 0.2, fairProbability: 0.3 }]);
  },
}));

beforeAll(() => {
  (mockedOdds.getMoneylineOdds as jest.Mock).mockResolvedValue(mockOdds);
  handler = require('../src/handler').default;
});

jest.mock('@llm/client', () => ({
  estimateWinProbability: jest.fn().mockResolvedValue(0.6),
}));

jest.mock('twilio', () => () => ({
  messages: { create: jest.fn().mockResolvedValue({ sid: 'abc' }) },
}));

describe('handler integration', () => {
  it('returns ok', async () => {
    const res = await handler();
    expect(res).toEqual({ ok: true });
  });
});