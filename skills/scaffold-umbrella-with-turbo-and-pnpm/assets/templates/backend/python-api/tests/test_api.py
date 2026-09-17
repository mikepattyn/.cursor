import os
from pathlib import Path

from fastapi.testclient import TestClient


def make_client(tmp_path: Path) -> TestClient:
    os.environ["SQLITE_PATH"] = str(tmp_path / "calculator.db")
    from app.main import create_app

    return TestClient(create_app())


def test_empty_get(tmp_path: Path):
    client = make_client(tmp_path)
    response = client.get("/value")
    assert response.status_code == 200
    assert response.json() == {"value": None, "updatedAt": None}


def test_put_then_get(tmp_path: Path):
    client = make_client(tmp_path)
    put = client.put("/value", json={"value": 12})
    assert put.status_code == 200
    assert put.json()["value"] == 12
    assert put.json()["updatedAt"]
    got = client.get("/value")
    assert got.json()["value"] == 12


def test_healthz(tmp_path: Path):
    client = make_client(tmp_path)
    assert client.get("/healthz").json() == {"status": "ok"}
    assert client.get("/readyz").status_code == 200
