import os
from dataclasses import dataclass
from pathlib import Path


@dataclass(frozen=True)
class Config:
    sqlite_path: Path
    port: int


def load_config() -> Config:
    return Config(
        sqlite_path=Path(os.environ.get("SQLITE_PATH", "/data/calculator.db")),
        port=int(os.environ.get("PORT", "8081")),
    )
