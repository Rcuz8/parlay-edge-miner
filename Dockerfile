# ---- Build stage ----
FROM node:20-alpine AS builder

# Enable Corepack so the same Yarn 4 version is used in CI and locally
RUN corepack enable

# Create app directory
WORKDIR /workspace

# Copy everything (monorepo)
COPY . .

# Install dependencies (offline, immutable)
RUN yarn install --immutable

# Build only the edge-miner app (skipping tests and other packages)
RUN yarn turbo run build --filter=apps/edge-miner

# ---- Runtime stage ----
FROM node:20-alpine

# Enable Corepack for runtime (optional but keeps "yarn" available)
RUN corepack enable

WORKDIR /app

# Copy built artifacts and production deps for the edge-miner app only
COPY --from=builder /workspace/apps/edge-miner/dist ./dist
COPY --from=builder /workspace/apps/edge-miner/package.json ./package.json

# Install only production dependencies for the edge-miner package
RUN corepack enable && corepack prepare yarn@4.1.0 --activate
COPY --from=builder /workspace/package.json ./
COPY --from=builder /workspace/yarn.lock ./
COPY --from=builder /workspace/.yarn ./ ./.yarn
COPY --from=builder /workspace/.yarnrc.yml ./
RUN yarn workspaces focus --production apps/edge-miner

EXPOSE 8080

CMD ["node", "dist/handler.js"]