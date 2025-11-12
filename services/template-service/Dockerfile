# =========================
# Build stage
# =========================
FROM node:20-alpine AS builder

# Install pnpm
RUN npm install -g pnpm@10.20.0

WORKDIR /app

# Copy root workspace files (relative to repo root)
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./

# Copy template service package.json
COPY services/template-service/package.json ./services/template-service/

# Install dependencies including dev for build
RUN pnpm install --frozen-lockfile --filter ./services/template-service...

# Copy template service source code
COPY services/template-service ./services/template-service

# Build the project
RUN pnpm build --filter ./services/template-service...

# =========================
# Production stage
# =========================
FROM node:20-alpine

# Install pnpm
RUN npm install -g pnpm@10.20.0

WORKDIR /app

# Copy root workspace files
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./

# Copy template service package.json
COPY services/template-service/package.json ./services/template-service/

# Install only production dependencies
RUN pnpm install --prod --frozen-lockfile --filter ./services/template-service...

# Copy built files from builder
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 3002

# Start the application
CMD ["node", "dist/server.js"]
