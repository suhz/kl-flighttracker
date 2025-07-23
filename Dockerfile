FROM node:22-alpine AS dependencies
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:22-alpine AS builder
WORKDIR /app
# Copy dependencies from dependencies stage
COPY --from=dependencies /app/node_modules ./node_modules
COPY package*.json ./
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
# Install OpenSSL libraries required by Prisma
RUN apk add --no-cache openssl
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=dependencies /app/node_modules ./node_modules
# Copy source files and scripts needed for collector
COPY --from=builder /app/src ./src
COPY --from=builder /app/tsconfig.json ./
COPY --from=builder /app/scripts ./scripts
# Verify source files exist
RUN ls -la /app/src/collector/
# Generate Prisma client in runner stage
RUN npx prisma generate
# Ensure source files are readable by the nextjs user
RUN chown -R nextjs:nodejs /app/src
USER nextjs
EXPOSE 3000
ENV PORT 3000
ENV NODE_ENV production
CMD ["node", "server.js"] 