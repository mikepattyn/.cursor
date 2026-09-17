from collections.abc import AsyncIterator

import httpx

from .config import Config


async def lifespan_client(config: Config) -> AsyncIterator[httpx.AsyncClient]:
    async with httpx.AsyncClient(
        base_url=config.calculator_url,
        timeout=config.upstream_timeout_s,
    ) as client:
        yield client
