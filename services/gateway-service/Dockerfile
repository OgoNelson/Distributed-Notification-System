# =========================
# Build stage
# =========================
FROM node:20-alpine AS builder

# Install pnpm
RUN npm install -g pnpm@10.20.0

WORKDIR /app

# Copy root workspace files (relative to repo root)
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./

# Copy gateway service package.json
COPY services/gateway-service/package.json ./services/gateway-service/

# Install dependencies including dev for build
RUN pnpm install --frozen-lockfile --filter ./services/gateway-service...

# Copy gateway service source code
COPY services/gateway-service ./services/gateway-service

# Build the project
RUN pnpm build --filter ./services/gateway-service...

# =========================
# Production stage
# =========================
FROM node:20-alpine

# Install pnpm
RUN npm install -g pnpm@10.20.0

WORKDIR /app

# Copy root workspace files
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./

# Copy gateway service package.json
COPY services/gateway-service/package.json ./services/gateway-service/

# Install only production dependencies
RUN pnpm install --prod --frozen-lockfile --filter ./services/gateway-service...

# Copy built files from builder stage
COPY --from=builder /app/services/gateway-service/dist ./dist

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "dist/main.js"]
