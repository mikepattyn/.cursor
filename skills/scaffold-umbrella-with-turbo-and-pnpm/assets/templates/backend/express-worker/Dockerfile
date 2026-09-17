FROM node:22-bookworm-slim

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@9.15.9 --activate

COPY package.json ./
RUN pnpm install --frozen-lockfile || pnpm install

COPY tsconfig.json ./
COPY src ./src
RUN pnpm build

RUN useradd --system --uid 10001 --create-home app
USER app

ENV PORT=8082
ENV BROKER_URL=nats://localhost:4222
EXPOSE 8082

CMD ["node", "dist/server.js"]
