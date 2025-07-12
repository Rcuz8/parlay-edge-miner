# Parlay Edge-Miner

A serverless monorepo that identifies positive-edge (\+EV) 2–3 leg MLB money-line parlays daily and sends them via SMS.

---

## Architecture

```mermaid
graph TD
  subgraph DigitalOcean
    F[Serverless Function (edge-miner)] -->|cron 15:00 UTC| H(Handler)
  end

  subgraph Monorepo
    H --> Nest(AppModule)
    Nest --> OddsService
    Nest --> StatsService
    Nest --> ParlayService
    Nest --> NotifierService

    OddsService -->|Axios| OddsClient
    StatsService -->|Axios| MlbStatsClient
    ParlayService -->|pure fns| ParlayEngine
    ParlayService --> LlmProb(OpenAI)
  end

  NotifierService --> TwilioSMS
```

---

## Quick Start

```bash
# Install (Yarn 4 Berry)
yarn install --immutable

# Build all packages
yarn turbo run build

# Run unit tests with coverage
yarn test

# Execute smoke test against compiled handler
yarn smoke
```

Deployments are automated from `main` via GitHub Actions → DigitalOcean Functions.

---

## Environment Variables

| Variable           | Description               |
| ------------------ | ------------------------- |
| `OPENAI_API_KEY`   | OpenAI access token       |
| `ODDS_API_KEY`     | The Odds API token        |
| `TWILIO_SID`       | Twilio Account SID        |
| `TWILIO_TOKEN`     | Twilio Auth Token         |
| `TWILIO_FROM`      | Sender phone number       |
| `TWILIO_TO`        | Subscriber phone number   |
| `LANGCHAIN_TRACING`| `true` to enable tracing  |

---

## Adding a New Sport

1. Implement a `<sport>-stats` client package mirroring `mlb-stats`.
2. Update `OddsService` to fetch the new sport key.
3. Extend `ParlayService` to include the new legs.

---

## Teardown

```bash
terraform -chdir=infra/terraform destroy
# Delete container registry when finished
```

---

## License

MIT © 2025