FROM gradle:8.12.1-jdk21 AS build
WORKDIR /src
COPY settings.gradle.kts build.gradle.kts ./
COPY gradle ./gradle
COPY src ./src
RUN gradle test bootJar --no-daemon

FROM eclipse-temurin:21-jre
RUN useradd --system --uid 10001 app \
 && mkdir -p /data \
 && chown app:app /data
WORKDIR /app
COPY --from=build /src/build/libs/example-calculator.jar /app/app.jar
ENV PORT=8081
ENV SQLITE_PATH=/data/calculator.db
EXPOSE 8081
USER app
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
