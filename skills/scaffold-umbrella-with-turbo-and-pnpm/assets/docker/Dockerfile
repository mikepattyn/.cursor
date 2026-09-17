FROM node:22-bookworm-slim

WORKDIR /workspace

RUN corepack enable && corepack prepare pnpm@9.15.9 --activate

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/frontend/__FRAMEWORK__/example-app/package.json ./apps/frontend/__FRAMEWORK__/example-app/
COPY packages/frontend/typescript/example-calculator/package.json ./packages/frontend/typescript/example-calculator/
COPY packages/frontend/__FRAMEWORK__/example-calculator/package.json ./packages/frontend/__FRAMEWORK__/example-calculator/
COPY packages/shared/typescript/calculator-client/package.json ./packages/shared/typescript/calculator-client/
COPY packages/contracts/openapi/calculator-api/package.json ./packages/contracts/openapi/calculator-api/
COPY infra/cdk/package.json ./infra/cdk/
# If Express BFF was chosen, uncomment:
# COPY apps/backend/express/example-bff/package.json ./apps/backend/express/example-bff/

RUN pnpm install --frozen-lockfile

EXPOSE 4200

CMD ["pnpm", "--filter", "@umbrella/example-app", "dev"]
