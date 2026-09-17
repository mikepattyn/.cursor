from contextlib import asynccontextmanager

from fastapi import FastAPI

from .api import calculator, health
from .config import load_config
from .dependencies import lifespan_client
from .logging import configure_logging


@asynccontextmanager
async def lifespan(app: FastAPI):
    async for client in lifespan_client(app.state.config):
        app.state.http = client
        yield


def create_app() -> FastAPI:
    configure_logging()
    app = FastAPI(lifespan=lifespan)
    app.state.config = load_config()
    app.include_router(health.router)
    app.include_router(calculator.router)
    return app


app = create_app()
