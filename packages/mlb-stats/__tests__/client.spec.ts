import nock from 'nock';
import { MlbStatsClient } from '../src/client';

describe('MlbStatsClient', () => {
  const client = new MlbStatsClient();
  const base = 'https://statsapi.mlb.com';
  const date = '2024-04-01';

  afterEach(() => {
    nock.cleanAll();
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

    nock(base)
      .get('/api/v1/schedule')
      .query({ date })
      .reply(200, mockResponse);

    const data = await client.getSchedule(date);
    expect(data).toEqual(mockResponse);
  });
});