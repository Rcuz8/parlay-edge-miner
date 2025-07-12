# @parlay/llm-prob

Thin wrapper around OpenAI Chat Completions that converts baseball matchup context into a fair win probability.

```ts
import { estimateWinProbability } from '@llm/client';
const p = await estimateWinProbability({
  homeTeam: 'Red Sox',
  awayTeam: 'Yankees',
  homeTeamIsFavorite: true,
});
```

* Returns a **number between 0-1**.
* Guarded by `zod` response schema – falls back to `0.5` on parse failure.
* Mocked in unit tests; no real OpenAI calls during CI.

Env: `OPENAI_API_KEY`.