# Deployment & CI/CD

## Overview

The repository is deployed via GitHub Actions using two workflows:

* **CI (`ci.yml`)** – Validates code quality, tests, and build integrity on every push or pull request.
* **CD (`deploy.yml`)** – On merge to `main`, compiles the `apps/edge-miner` workspace and deploys the output as a DigitalOcean **Functions** project.  No container image is involved.

The infrastructure stack is codified in `infra/terraform/` and currently provisions:

* A Functions **namespace** (`parlay-edge`)
* A daily-trigger cron schedule (15:00 UTC)

We intentionally **don’t** use App Platform / Containers yet.  Reasons:

1.  Startup time: Functions cold-start is sub-second for our workload.
2.  Cost: No bill when idle.
3.  Simpler secret management – environment variables are defined per deploy.

If we outgrow Functions (e.g. need > 60 s execution or background workers) the same repo already builds an OCI image (`apps/edge-miner/Dockerfile`).  Switching would look like:

```
# 1. Push image (already handled by Dockerfile if we re-enable it)
docker build -f apps/edge-miner/Dockerfile -t ${REGISTRY}/edge:${SHA} .
docker push ${REGISTRY}/edge:${SHA}

# 2. Create / update App Platform spec
doctl apps update --spec app.yaml
```

Only the `deploy.yml` steps change – Terraform, code, and tests remain identical.

## LLM Frameworks

LangChain, LangSmith, and LangGraph are **not** part of the runtime.  Tracing is opt-in via the lightweight helper in `@parlay/common-config`.

## Release Flow

1. Commit changes following Conventional Commits.
2. Push branch – CI runs and must pass.
3. Create PR → merge to `main` – CD workflow builds & deploys the latest image.


### `doctl serverless deploy` flags used

| Flag               | Purpose                                       |
|--------------------|-----------------------------------------------|
| `apps/edge-miner/dist` | The directory produced by `yarn build` containing `package.json` & compiled JS |
| `--remote-build`   | Builds the action on DO’s builders to keep CI image slim |
| `--env KEY=value`  | Inline runtime secrets – the same set lives in GitHub Secrets |

### Secrets

Same as before – `OPENAI_API_KEY`, `ODDS_API_KEY`, `TWILIO_*`, `DO_TOKEN`.

`DO_TOKEN` only needs **Functions** scope now, but we keep `registry:` scopes so we can switch back to container-based deploys without rotating secrets.