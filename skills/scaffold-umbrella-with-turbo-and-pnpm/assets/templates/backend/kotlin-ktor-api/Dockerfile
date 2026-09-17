FROM gradle:8.12.1-jdk21 AS build
WORKDIR /src
COPY settings.gradle.kts build.gradle.kts ./
COPY gradle ./gradle
COPY src ./src
RUN gradle test installDist --no-daemon

FROM eclipse-temurin:21-jre
RUN useradd --system --uid 10001 app \
 && mkdir -p /data \
 && chown app:app /data
WORKDIR /app
COPY --from=build /src/build/install/example-calculator/ /app/
ENV PORT=8081
ENV SQLITE_PATH=/data/calculator.db
EXPOSE 8081
USER app
ENTRYPOINT ["/app/bin/example-calculator"]
