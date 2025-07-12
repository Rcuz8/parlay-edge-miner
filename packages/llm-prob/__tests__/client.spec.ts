import nock from 'nock';
import { estimateWinProbability } from '../src/client';

describe('estimateWinProbability', () => {
  afterEach(() => nock.cleanAll());

  it('parses probability from LLM JSON response', async () => {
    nock('https://api.openai.com')
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

    const prob = await estimateWinProbability({
      homeTeam: 'Boston Red Sox',
      awayTeam: 'New York Yankees',
      homeTeamIsFavorite: true,
    });
    expect(prob).toBeCloseTo(0.62);
  });
});