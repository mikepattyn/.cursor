from fastapi import FastAPI

from .api import calculator, health
from .config import load_config
from .logging import configure_logging
from .repositories.sqlite import CalculatorStore


def create_app() -> FastAPI:
    configure_logging()
    config = load_config()
    app = FastAPI()
    app.state.config = config
    app.state.store = CalculatorStore(config.sqlite_path)
    app.include_router(health.router)
    app.include_router(calculator.router)
    return app


app = create_app()
