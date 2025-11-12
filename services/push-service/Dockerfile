# =========================
# Build stage
# =========================
FROM node:20-alpine AS builder

# Install pnpm
RUN npm install -g pnpm@10.20.0

WORKDIR /app

# Copy root workspace files (relative to repo root)
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./

# Copy push service package.json
COPY services/push-service/package.json ./services/push-service/

# Install dependencies including dev for build
RUN pnpm install --frozen-lockfile --filter ./services/push-service...

# Copy push service source code
COPY services/push-service ./services/push-service

# Build the project
RUN pnpm build --filter ./services/push-service...

# =========================
# Production stage
# =========================
FROM node:20-alpine

# Install pnpm
RUN npm install -g pnpm@10.20.0

WORKDIR /app

# Copy root workspace files
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./

# Copy push service package.json
COPY services/push-service/package.json ./services/push-service/

# Install only production dependencies
RUN pnpm install --prod --frozen-lockfile --filter ./services/push-service...

# Copy built files from builder
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 3003

# Start the application
CMD ["node", "dist/server.js"]
