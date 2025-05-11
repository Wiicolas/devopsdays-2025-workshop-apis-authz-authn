# Stage 1: Dependencies
FROM node:20-alpine AS deps
WORKDIR /app

# Install dependencies required for node-gyp
RUN apk add --no-cache python3 make g++ libc6-compat

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Stage 2: Builder
FROM node:20-alpine AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the application
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
# Temporarily disable ESLint for production build
ENV DISABLE_ESLINT_PLUGIN=true

RUN npm run build

# Stage 3: Runner
FROM node:20-alpine AS runner
WORKDIR /app

# Install necessary production packages
RUN apk add --no-cache libc6-compat

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Set environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copy necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 5000

# Set environment variables for the application
ENV PORT=5000
ENV HOSTNAME="0.0.0.0"

# Start the application
CMD ["node", "server.js"]