from http import HTTPStatus
from datetime import date

from fastapi.testclient import TestClient

from backend.src.app import app


def test_common_incoming_flow_and_listing():
    client = TestClient(app)
    today = date.today().strftime("%Y-%m")
    create = client.post(
        "/registrations/common_incoming",
        json={
            "issuer": "Citizen",
            "referenceNumber": "REF-AC-1",
            "subject": "Test",
            "offices": ["OFF-1"],
        },
    )
    assert create.status_code == HTTPStatus.CREATED

    lst = client.get(f"/registrations?month={today}&category=common_incoming&page=1")
    assert lst.status_code == HTTPStatus.OK
    data = lst.json()
    assert data["page"] == 1 and data["pageSize"] == 100
    assert any(item["issuer"] == "Citizen" for item in data["items"]) 


def test_common_outgoing_requires_recipient_and_has_draft_number():
    client = TestClient(app)
    # Missing recipient -> 400
    bad = client.post(
        "/registrations/common_outgoing",
        json={
            "issuer": "Office",
            "referenceNumber": "REF-AC-2",
            "subject": "Test",
        },
    )
    assert bad.status_code == HTTPStatus.BAD_REQUEST

    ok = client.post(
        "/registrations/common_outgoing",
        json={
            "issuer": "Office",
            "referenceNumber": "REF-AC-3",
            "subject": "Test",
            "recipient": "Citizen",
        },
    )
    assert ok.status_code == HTTPStatus.CREATED
    body = ok.json()
    assert body.get("protocolNumber") and body.get("draftNumber")
