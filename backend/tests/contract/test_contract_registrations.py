from http import HTTPStatus
from fastapi.testclient import TestClient
import pytest

from backend.src.app import app


@pytest.fixture(scope="module")
def client():
    with TestClient(app) as c:
        yield c


def test_create_registration_minimal_and_entry_date_default(client: TestClient):
    # Using common_incoming category per OpenAPI
    payload = {
        "issuer": "Citizen A",
        "referenceNumber": "REF-1",
        "subject": "Apply for something",
        "offices": ["OFF-1"],
        # entryDate omitted -> server to default to today
    }
    res = client.post("/registrations/common_incoming", json=payload)
    assert res.status_code == HTTPStatus.CREATED
    # When implemented, expect 201 and body with id, entryDate auto-filled to YYYY-MM-DD


def test_list_registrations_pagination_contract(client: TestClient):
    res = client.get("/registrations?month=2025-01&page=1")
    assert res.status_code == HTTPStatus.OK


def test_delete_registration_contract(client: TestClient):
    # Create one to delete when implemented
    create = client.post(
        "/registrations/common_outgoing",
        json={
            "issuer": "Office",
            "referenceNumber": "R-2",
            "subject": "To delete",
            "recipient": "Citizen B",
        },
    )
    assert create.status_code in (HTTPStatus.OK, HTTPStatus.CREATED)
    reg_id = create.json().get("id")
    del_res = client.delete(f"/registrations/{reg_id}")
    assert del_res.status_code == HTTPStatus.NO_CONTENT


def test_archive_run_contract(client: TestClient):
    res = client.post("/admin/archive/run")
    assert res.status_code == HTTPStatus.OK
