from fastapi import APIRouter, Request, Response
from fastapi.responses import JSONResponse

router = APIRouter()


@router.api_route("/api/calculator/value", methods=["GET", "PUT"])
async def calculator_value(request: Request) -> Response:
    body = await request.body()
    headers = {"x-request-id": request.headers.get("x-request-id", "")}
    content_type = request.headers.get("content-type")
    if content_type:
        headers["content-type"] = content_type

    try:
        upstream = await request.app.state.http.request(
            request.method,
            "/value",
            content=body or None,
            headers={k: v for k, v in headers.items() if v},
        )
    except Exception:
        return JSONResponse({"error": "calculator unavailable"}, status_code=502)

    return Response(
        content=upstream.content,
        status_code=upstream.status_code,
        media_type="application/json",
    )
