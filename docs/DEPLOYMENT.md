# Deployment & CI/CD

## Continuous Integration (GitHub Actions)

* **`ci.yml`** – runs on every push / PR
  1. Checkout, install dependencies with cache
  2. `yarn lint`, `yarn test --coverage`, `yarn turbo run build`
  3. Coverage gate: `parlay-engine` ≥90 %, packages ≥80 %

## Continuous Delivery (GitHub Actions)

* **`deploy.yml`** – triggers on merge to `main`
  1. Build monorepo (`turbo run build`)
  2. Login to DigitalOcean Container Registry (DOCR)
  3. `docker build` image tagged with commit SHA
  4. Push to DOCR
  5. `doctl serverless deploy` updates scheduled function with new image & secrets

Secrets expected in repo settings:
* `DO_TOKEN`, `DO_USER`, `DO_PSW` – Container registry & API auth
* `OPENAI_API_KEY`, `ODDS_API_KEY`, `TWILIO_*` – runtime secrets

## Infrastructure-as-Code (Terraform)

Located in `infra/terraform/`.

```bash
# Initialise & deploy
terraform -chdir=infra/terraform init
terraform -chdir=infra/terraform apply -var="do_token=$DO_TOKEN" -var="openai_key=$OPENAI_API_KEY" ...
```

Resources:
* `digitalocean_container_registry.edge` – starter-tier registry
* `digitalocean_functions_function.edge_miner` – Node 18 serverless function with scheduled trigger `0 15 * * *` (15:00 UTC)

## Manual Release

```bash
# Build function image
DOCKER_TAG=$(git rev-parse --short HEAD)
docker build -t registry.digitalocean.com/parlay-edge/edge:$DOCKER_TAG .
docker push registry.digitalocean.com/parlay-edge/edge:$DOCKER_TAG

doctl serverless deploy parlay-edge \
  --env-file .env.production \
  --image registry.digitalocean.com/parlay-edge/edge:$DOCKER_TAG
```