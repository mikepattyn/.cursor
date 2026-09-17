from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel

router = APIRouter()


class ValueBody(BaseModel):
    value: float


@router.get("/value")
def get_value(request: Request) -> dict[str, float | str | None]:
    try:
        return request.app.state.store.get()
    except Exception as exc:
        raise HTTPException(status_code=500, detail="read failed") from exc


@router.put("/value")
def put_value(request: Request, body: ValueBody) -> dict[str, float | str]:
    try:
        return request.app.state.store.put(body.value)
    except Exception as exc:
        raise HTTPException(status_code=500, detail="write failed") from exc
