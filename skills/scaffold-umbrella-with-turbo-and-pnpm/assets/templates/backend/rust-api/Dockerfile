FROM rust:1.85-bookworm AS build
WORKDIR /app
COPY Cargo.toml rust-toolchain.toml ./
COPY src ./src
COPY migrations ./migrations
COPY tests ./tests
RUN if [ -f Cargo.lock ]; then cargo build --release --locked; else cargo build --release; fi

FROM debian:bookworm-slim
RUN apt-get update && apt-get install -y --no-install-recommends curl \
 && rm -rf /var/lib/apt/lists/* \
 && useradd --system --uid 10001 app
COPY --from=build /app/target/release/example-calculator /usr/local/bin/example-calculator
ENV SQLITE_PATH=/data/calculator.db
EXPOSE 8081
USER app
CMD ["example-calculator"]
