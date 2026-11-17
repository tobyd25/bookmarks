# Stage 1 build
FROM bookmarks-backend-base AS builder
WORKDIR /app

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
RUN pnpm i

COPY src ./src
COPY tsconfig.json ./

RUN pnpm build
RUN cp src/schema.sql dist/schema.sql

# Stage 2 run production
FROM node:22-slim
WORKDIR /app

RUN apt-get update && apt-get install -y libsqlite3-dev && rm -rf /var/lib/apt/lists/*
RUN npm i -g pnpm

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./

RUN pnpm prune --prod
CMD ["pnpm", "start"]