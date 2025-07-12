# @parlay/odds-client

Type-safe Axios wrapper for [The Odds API](https://theoddsapi.com/).

```ts
import { defaultClient } from '@odd/client';
const odds = await defaultClient.getMoneylineOdds('baseball_mlb');
```

* Parsing via `zod` ensures runtime data integrity.
* Exports `OddsClient` class for DI & custom Axios instances.
* Unit tests use `nock` to stub HTTP.

Required env: `ODDS_API_KEY` (validated by common-config).