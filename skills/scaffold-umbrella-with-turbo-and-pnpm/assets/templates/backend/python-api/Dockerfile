FROM python:3.12-slim

WORKDIR /app

RUN useradd --system --uid 10001 app
COPY pyproject.toml ./
RUN pip install --no-cache-dir .
COPY app ./app
COPY migrations ./migrations

ENV SQLITE_PATH=/data/calculator.db
EXPOSE 8081
USER app

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8081", "--timeout-graceful-shutdown", "10"]
