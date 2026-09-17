FROM node:22-bookworm-slim

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@9.15.9 --activate

COPY package.json ./
RUN pnpm install --frozen-lockfile || pnpm install

COPY tsconfig.json tsconfig.build.json ./
COPY src ./src
RUN pnpm build

RUN useradd --system --uid 10001 --create-home app \
 && mkdir -p /data \
 && chown app:app /data

ENV PORT=8081
ENV SQLITE_PATH=/data/calculator.db
ENV NODE_OPTIONS=--experimental-sqlite

EXPOSE 8081
USER app

CMD ["node", "dist/server.js"]
