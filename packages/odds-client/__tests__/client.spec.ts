import nock from 'nock';
import { OddsClient } from '../src/client';

const client = new OddsClient();

describe('OddsClient', () => {
  const sport = 'baseball_mlb';
  const base = 'https://api.the-odds-api.com';

  afterEach(() => {
    nock.cleanAll();
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

    nock(base)
      .get(`/v4/sports/${sport}/odds`)
      .query(true)
      .reply(200, mockResponse);

    const data = await client.getMoneylineOdds(sport);
    expect(data).toEqual(mockResponse);
  });
});