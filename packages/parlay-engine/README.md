# @parlay/parlay-engine

Pure utility functions for calculating parlay edges.

Exports:

| Function | Description |
| -------- | ----------- |
| `impliedProbabilityFromOdds` | Convert American odds to decimal probability. |
| `calculateEdge` | Fair probability − implied probability. |
| `buildParlayCombos` | Generate 2–3 leg parlay combos and rank by edge. |

Example:

```ts
import { buildParlayCombos } from '@engine/index';
const legs = [
  { id: 'A', odds: -150, winProbability: 0.65 },
  { id: 'B', odds: +120, winProbability: 0.55 },
];
const parlays = buildParlayCombos(legs);
```

≥90 % branch coverage enforced in CI.