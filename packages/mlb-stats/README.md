# @parlay/mlb-stats

Minimal client for the public [MLB Stats API](https://statsapi.mlb.com/).

```ts
import { defaultMlbStatsClient } from '@stats/client';
const schedule = await defaultMlbStatsClient.getSchedule('2025-04-01');
```

* Uses Axios and `zod` for type-safe parsing.
* Currently supports `/schedule`; easy to extend.
* 100 % logic coverage via nock tests – see `__tests__`.