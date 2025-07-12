# Deployment & CI/CD

## Overview

The repository is deployed via GitHub Actions using two workflows:

* **CI (`ci.yml`)** – Validates code quality, tests, and build integrity on every push or pull request.
* **CD (`deploy.yml`)** – On merge to `main`, builds a Docker image and deploys it to DigitalOcean Functions through DOCR.

The infrastructure stack is codified in `infra/terraform/` and consists of a starter-tier DO Container Registry and a Node 18 DigitalOcean Function scheduled at 15:00 UTC daily.

## LLM Frameworks

LangChain, LangSmith, and LangGraph are **not** part of the runtime.  Tracing is opt-in via the lightweight helper in `@parlay/common-config`.

## Release Flow

1. Commit changes following Conventional Commits.
2. Push branch – CI runs and must pass.
3. Create PR → merge to `main` – CD workflow builds & deploys the latest image.

Secrets required by the CD workflow are listed in the workflow file itself; Terraform variable definitions are the single source of truth for runtime environment variables.