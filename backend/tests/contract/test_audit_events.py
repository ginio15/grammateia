from http import HTTPStatus

import os
from fastapi.testclient import TestClient
import pytest

from backend.src.app import app
from backend.src.services.db import get_connection


@pytest.fixture(scope="module")
def client():
    with TestClient(app) as c:
        yield c


def test_audit_events_on_create_and_delete(client: TestClient, monkeypatch):
    # Ensure USERNAME fallback is used for determinism
    monkeypatch.delenv("USERNAME", raising=False)

    # Create
    create = client.post(
        "/registrations/common_incoming",
        json={
            "issuer": "Citizen C",
            "referenceNumber": "R-3",
            "subject": "Audit test",
            "offices": ["OFF-1"],
        },
    )
    assert create.status_code == HTTPStatus.CREATED
    reg_id = create.json()["id"]

    # Check audit for create
    conn = get_connection()
    cur = conn.cursor()
    row = cur.execute(
        "SELECT action, registrationId, username FROM audit_events WHERE registrationId = ? ORDER BY id ASC",
        (reg_id,),
    ).fetchone()
    assert row is not None and row["action"] == "create" and row["username"] == "unknown"

    # Delete
    del_res = client.delete(f"/registrations/{reg_id}")
    assert del_res.status_code == HTTPStatus.NO_CONTENT

    # Check audit for delete
    row2 = cur.execute(
        "SELECT action, registrationId, username FROM audit_events WHERE registrationId = ? ORDER BY id DESC",
        (reg_id,),
    ).fetchone()
    conn.close()
    assert row2 is not None and row2["action"] == "delete" and row2["username"] == "unknown"
