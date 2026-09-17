import os
from dataclasses import dataclass
from urllib.parse import urlparse


@dataclass(frozen=True)
class Config:
    calculator_url: str
    port: int
    upstream_timeout_s: float


def load_config() -> Config:
    calculator_url = os.environ.get("CALCULATOR_URL", "http://localhost:8081").rstrip("/")
    parsed = urlparse(calculator_url)
    if parsed.scheme not in {"http", "https"} or not parsed.netloc:
        raise ValueError(f"CALCULATOR_URL must be an absolute URL, got {calculator_url}")
    return Config(
        calculator_url=calculator_url,
        port=int(os.environ.get("PORT", "3000")),
        upstream_timeout_s=float(os.environ.get("UPSTREAM_TIMEOUT_S", "5")),
    )
