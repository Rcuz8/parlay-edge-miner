# Edge Miner Function (NestJS)

Serverless entrypoint executed daily by DigitalOcean Functions.

Flow:
1. `OddsService` – fetch MLB money-line odds.
2. `StatsService` – (placeholder for future advanced metrics).
3. `ParlayService` – combine odds with LLM fair probabilities to rank parlays.
4. `NotifierService` – send top parlay via Twilio SMS.

Invoke locally (after build):
```bash
node dist/handler.js
```

Integration tests mock all external APIs; smoke script validates compiled bundle exits 0.