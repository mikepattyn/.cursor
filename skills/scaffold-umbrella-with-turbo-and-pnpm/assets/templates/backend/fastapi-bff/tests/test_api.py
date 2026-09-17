from fastapi.testclient import TestClient
import httpx
import respx

from app.main import create_app


def test_healthz():
    client = TestClient(create_app())
    response = client.get("/healthz")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


@respx.mock
def test_proxies_get():
    respx.get("http://localhost:8081/value").mock(
        return_value=httpx.Response(200, json={"value": 4, "updatedAt": "2026-01-01T00:00:00Z"})
    )
    client = TestClient(create_app())
    response = client.get("/api/calculator/value")
    assert response.status_code == 200
    assert response.json()["value"] == 4


@respx.mock
def test_upstream_failure():
    respx.get("http://localhost:8081/value").mock(side_effect=httpx.ConnectError("down"))
    client = TestClient(create_app())
    response = client.get("/api/calculator/value")
    assert response.status_code == 502
    assert response.json() == {"error": "calculator unavailable"}
