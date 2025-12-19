FROM node:24-alpine AS base
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

# 📦 Dependencies for development
FROM base AS dev-deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# 📦 Dependencies for production
FROM base AS prod-deps
COPY package.json pnpm-lock.yaml ./
ENV NODE_ENV=production
RUN pnpm install --frozen-lockfile --prod

FROM base AS development
ENV NODE_ENV=development
COPY --from=dev-deps /app/node_modules ./node_modules
COPY . .

RUN addgroup appgroup && adduser -S appuser -G appgroup && chown -R appuser:appgroup /app
USER appuser

EXPOSE 5000
CMD ["pnpm", "dev"]

FROM base AS production
ENV NODE_ENV=production
COPY --from=prod-deps /app/node_modules ./node_modules
COPY . .

RUN addgroup appgroup && adduser -S appuser -G appgroup && chown -R appuser:appgroup /app
USER appuser

EXPOSE 5000
CMD ["pnpm", "start"]
