from http import HTTPStatus

import pytest
from fastapi.testclient import TestClient

from backend.src.app import app


@pytest.fixture(scope="module")
def client():
    with TestClient(app) as c:
        yield c


def test_health_ok(client: TestClient):
    res = client.get("/health")
    assert res.status_code == HTTPStatus.OK
    assert res.json() == {"status": "ok"}


def test_meta_offices_contract(client: TestClient):
    # Placeholder for /meta/offices per OpenAPI; expect 200 and schema-like keys
    res = client.get("/meta/offices")
    assert res.status_code == HTTPStatus.OK


def test_meta_fields_contract(client: TestClient):
    res = client.get("/meta/fields")
    assert res.status_code == HTTPStatus.OK
