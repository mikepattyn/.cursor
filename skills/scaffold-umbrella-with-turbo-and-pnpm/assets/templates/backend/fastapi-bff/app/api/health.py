from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse

router = APIRouter()


@router.get("/healthz")
async def healthz() -> dict[str, str]:
    return {"status": "ok"}


@router.get("/readyz")
async def readyz(request: Request) -> JSONResponse:
    client = request.app.state.http
    try:
        upstream = await client.get("/healthz")
        if upstream.is_success:
            return JSONResponse({"status": "ok"})
    except Exception:
        pass
    return JSONResponse({"status": "unavailable"}, status_code=503)
