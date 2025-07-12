# syntax=docker/dockerfile:1.4

# --- Base image with Node 20 and tooling ------------------------------------------------
FROM node:20-alpine AS base

# Enable Corepack and activate the same Yarn version the repo uses
RUN corepack enable && corepack prepare yarn@4.1.0 --activate

# Turbo needs to be available in the build stages
RUN yarn global add turbo

WORKDIR /repo

# --- Pruner -----------------------------------------------------------------------------
# Reduce the monorepo to only the workspaces needed by @parlay/edge-miner
FROM base AS pruner
ARG WORKSPACE="edge-miner"

# copy the whole repo so turbo can analyse the graph
COPY . .

# Produce a pruned output (source + lockfile + package.json set) for the workspace
RUN turbo prune --scope=$WORKSPACE --docker

# --- Builder ---------------------------------------------------------------------------
FROM base AS builder
ARG WORKSPACE="edge-miner"

WORKDIR /repo

# Copy the pruned dependency graph first (this keeps layers small & cached)
COPY --from=pruner /repo/out/json/ ./
COPY --from=pruner /repo/out/yarn.lock ./yarn.lock

# Also copy the workspace's own package.json explicitly (needed by yarn focus)
COPY apps/$WORKSPACE/package.json ./apps/$WORKSPACE/package.json

# Install only what's required for the selected workspace
RUN yarn install --immutable

# Copy the pruned source
COPY --from=pruner /repo/out/full/ ./
COPY turbo.json turbo.json

# Build the workspace
RUN yarn turbo run build --filter=apps/$WORKSPACE

# Remove TS/JS source (optional slimming) and dev files
RUN rm -rf /repo/apps/*/src /repo/packages/*/src

# Focus the install to production-only dependencies of the workspace
RUN yarn workspaces focus --production @parlay/$WORKSPACE

# --- Runtime image ---------------------------------------------------------------------
FROM node:20-alpine AS runner
ENV NODE_ENV=production

# Re-enable Corepack so the yarn shim exists (optional)
RUN corepack enable

WORKDIR /app

# Copy the built artefacts & production node_modules from the builder
COPY --from=builder /repo .

# App port
ENV PORT=8080
EXPOSE 8080

WORKDIR /app/apps/edge-miner

CMD ["node", "dist/handler.js"]