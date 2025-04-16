# Base image
FROM node:20-alpine AS base
LABEL maintainer="vynnydev"

# Set working directory
WORKDIR /app

# Update system packages and install dependencies with security fixes
RUN apk update && \
    apk upgrade && \
    apk add --no-cache libc6-compat python3 make g++ && \
    rm -rf /var/cache/apk/*

# Install dependencies only when needed - development deps
FROM base AS deps
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies using clean install to ensure package-lock.json is respected
RUN npm ci --ignore-scripts

# Rebuild the source code only when needed - development build
FROM base AS builder
WORKDIR /app

# Copy node_modules from deps
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Environment variables must be present at build time
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ARG NEXT_PUBLIC_GEMINI_API_KEY
ARG NEXT_PUBLIC_HUGGING_FACE_API_KEY
ARG NEXT_PUBLIC_MAPBOX_TOKEN
ARG NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
ARG REPLICATE_API_TOKEN

# Environment variables
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ENV NEXT_PUBLIC_GEMINI_API_KEY=$NEXT_PUBLIC_GEMINI_API_KEY
ENV NEXT_PUBLIC_HUGGING_FACE_API_KEY=$NEXT_PUBLIC_HUGGING_FACE_API_KEY
ENV NEXT_PUBLIC_MAPBOX_TOKEN=$NEXT_PUBLIC_MAPBOX_TOKEN
ENV NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=$NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
ENV REPLICATE_API_TOKEN=$REPLICATE_API_TOKEN

# Build the application
RUN npm run build

# Production image, copy all the files and run the server
FROM base AS runner
WORKDIR /app

# Set to production environment
ENV NODE_ENV=production

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs && \
    chown -R nextjs:nodejs /app

USER nextjs

# Copy necessary files from builder
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Set hostname to localhost
ENV HOSTNAME "0.0.0.0"

# Expose the port the app runs on
EXPOSE 3000

# Define the command to run the app
CMD ["node", "server.js"]
