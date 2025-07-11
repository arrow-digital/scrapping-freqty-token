# Dockerfile

# Build stage
FROM node:20-bookworm-slim AS builder

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./
COPY tsconfig.json ./
COPY tsup.config.ts ./

# Install dependencies including Playwright
RUN npm ci

# Copy source code
COPY src/ ./src/

# Build the application
RUN npm run build

# Runner stage
FROM node:20-bookworm-slim AS runner

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev && npm cache clean --force

# Install Playwright browser
RUN npx playwright install chromium --with-deps

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Create credentials file if it doesn't exist (will be overridden at runtime)
COPY credentials.json.example ./credentials.json


# bootstrap container
ENTRYPOINT [ "npm", "start" ]
