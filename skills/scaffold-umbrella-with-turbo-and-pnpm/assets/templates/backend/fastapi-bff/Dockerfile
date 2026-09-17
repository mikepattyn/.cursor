FROM python:3.12-slim

WORKDIR /app

RUN useradd --system --uid 10001 app
COPY pyproject.toml ./
RUN pip install --no-cache-dir .
COPY app ./app

ENV CALCULATOR_URL=http://localhost:8081
EXPOSE 3000
USER app

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "3000", "--timeout-graceful-shutdown", "10"]
