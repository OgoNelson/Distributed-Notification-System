# =========================
# Build stage
# =========================
FROM node:20-alpine AS builder

# Install pnpm
RUN npm install -g pnpm@10.20.0

WORKDIR /app

# Copy root workspace files (relative to repo root)
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./

# Copy email service package.json
COPY services/email-service/package.json ./services/email-service/

# Install dependencies including dev for build
RUN pnpm install --frozen-lockfile --filter ./services/email-service...

# Copy email service source code
COPY services/email-service ./services/email-service

# Build the project
RUN pnpm build --filter ./services/email-service...

# =========================
# Production stage
# =========================
FROM node:20-alpine

# Install pnpm
RUN npm install -g pnpm@10.20.0

WORKDIR /app

# Copy root workspace files
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./

# Copy email service package.json
COPY services/email-service/package.json ./services/email-service/

# Install only production dependencies
RUN pnpm install --prod --frozen-lockfile --filter ./services/email-service...

# Copy built files from builder
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 3001

# Start the application
CMD ["node", "dist/server.js"]
