FROM golang:1.23-bookworm AS build
WORKDIR /src
COPY go.mod go.sum* ./
COPY . .
RUN if [ -f go.sum ]; then go mod download; else go mod tidy; fi \
 && CGO_ENABLED=0 GOOS=linux go build -o /out/example-calculator ./cmd/api

FROM debian:bookworm-slim
RUN apt-get update && apt-get install -y --no-install-recommends curl \
 && rm -rf /var/lib/apt/lists/* \
 && useradd --system --uid 10001 app
COPY --from=build /out/example-calculator /usr/local/bin/example-calculator
ENV SQLITE_PATH=/data/calculator.db
EXPOSE 8081
USER app
CMD ["example-calculator"]
