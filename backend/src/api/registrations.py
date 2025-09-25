import os
from datetime import date, datetime, timezone
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, HTTPException, Path, Query
from pydantic import BaseModel, Field

from backend.src.services.db import get_connection
from backend.src.services.numbering import next_draft, next_protocol


class RegistrationCreate(BaseModel):
    issuer: str = Field(max_length=255)
    referenceNumber: str = Field(max_length=255)
    subject: str = Field(max_length=255)
    recipient: Optional[str] = Field(default=None, max_length=255)
    offices: Optional[List[str]] = None
    entryDate: Optional[date] = None


router = APIRouter(prefix="/registrations", tags=["registrations"])


def _now_iso() -> str:
    # Use timezone.utc for compatibility with Python <3.11 where datetime.UTC is absent
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


def _insert_registration(category: str, payload: RegistrationCreate) -> Dict[str, Any]:
    # Minimal validation in line with OpenAPI description
    if category.endswith("incoming"):
        if not payload.offices or len(payload.offices) == 0:
            raise HTTPException(status_code=400, detail="offices required for incoming categories")
    if category.endswith("outgoing"):
        if not payload.recipient:
            raise HTTPException(status_code=400, detail="recipient required for outgoing categories")

    entry_date = payload.entryDate or date.today()
    created_at = _now_iso()

    conn = get_connection()
    cur = conn.cursor()
    # Determine numbers transactionally
    year = entry_date.year
    protocol_number = next_protocol(conn, category, year)
    draft_number = None
    if category.endswith("outgoing"):
        draft_number = next_draft(conn, category)

    cur.execute(
        """
        INSERT INTO registrations (
            category, issuer, referenceNumber, subject, recipient, offices,
            protocolNumber, draftNumber, entryDate, createdAt, deletedFlag
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
        """,
        (
            category,
            payload.issuer,
            payload.referenceNumber,
            payload.subject,
            payload.recipient,
            ",".join(payload.offices) if payload.offices else None,
            protocol_number,
            draft_number,
            entry_date.isoformat(),
            created_at,
        ),
    )
    reg_id = cur.lastrowid
    # Audit event
    username = os.environ.get("USERNAME") or "unknown"
    cur.execute(
        """
        INSERT INTO audit_events (action, registrationId, timestamp, username)
        VALUES ('create', ?, ?, ?)
        """,
        (reg_id, created_at, username),
    )
    conn.commit()
    conn.close()

    return {
        "id": reg_id,
        "category": category,
        "issuer": payload.issuer,
        "referenceNumber": payload.referenceNumber,
        "subject": payload.subject,
        "recipient": payload.recipient,
        "offices": payload.offices,
        "protocolNumber": protocol_number,
        "draftNumber": draft_number,
        "entryDate": entry_date.isoformat(),
        "createdAt": created_at,
        "deletedFlag": False,
        "deletedAt": None,
    }


@router.post("/{category}", status_code=201)
def create_registration(
    category: str = Path(...,
                         pattern="^(common|confidential|signals)_(incoming|outgoing)$"),
    payload: RegistrationCreate = ...,
):
    return _insert_registration(category, payload)


@router.get("")
def list_registrations(
    month: str = Query(..., pattern=r"^\d{4}-\d{2}$"),
    category: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
):
    # Minimal list returning items within month (by entryDate prefix)
    conn = get_connection()
    cur = conn.cursor()
    sql = "SELECT * FROM registrations WHERE deletedFlag = 0 AND entryDate LIKE ?"
    params: List[Any] = [f"{month}%"]
    if category:
        sql += " AND category = ?"
        params.append(category)
    sql += " ORDER BY id LIMIT 100 OFFSET ?"
    params.append((page - 1) * 100)
    rows = cur.execute(sql, params).fetchall()
    conn.close()

    def row_to_item(r):
        offices = r["offices"].split(",") if r["offices"] else None
        return {
            "id": r["id"],
            "category": r["category"],
            "issuer": r["issuer"],
            "referenceNumber": r["referenceNumber"],
            "subject": r["subject"],
            "recipient": r["recipient"],
            "offices": offices,
            "protocolNumber": r["protocolNumber"],
            "draftNumber": r["draftNumber"],
            "entryDate": r["entryDate"],
            "createdAt": r["createdAt"],
            "deletedFlag": bool(r["deletedFlag"]),
            "deletedAt": r["deletedAt"],
        }

    items = [row_to_item(r) for r in rows]
    return {"items": items, "page": page, "pageSize": 100, "total": len(items)}


@router.delete("/{id}", status_code=204)
def delete_registration(id_: int = Path(..., alias="id")):
    conn = get_connection()
    cur = conn.cursor()
    now_iso = _now_iso()
    cur.execute(
        "UPDATE registrations SET deletedFlag = 1, deletedAt = ? WHERE id = ? AND deletedFlag = 0",
        (now_iso, id_),
    )
    if cur.rowcount == 0:
        conn.close()
        raise HTTPException(status_code=404, detail="Not found")
    # Audit event
    username = os.environ.get("USERNAME") or "unknown"
    cur.execute(
        """
        INSERT INTO audit_events (action, registrationId, timestamp, username)
        VALUES ('delete', ?, ?, ?)
        """,
        (id_, now_iso, username),
    )
    conn.commit()
    conn.close()
    return None
