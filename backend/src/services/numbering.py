from __future__ import annotations

from datetime import datetime, timezone
from typing import Optional  # noqa: F401 (retained for potential future use)

import sqlite3


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


def _ensure_unique_index(conn: sqlite3.Connection) -> None:
    # Create a unique index to prevent duplicate sequence rows
    conn.execute(
        """
        CREATE UNIQUE INDEX IF NOT EXISTS ux_numbering_sequences
        ON numbering_sequences(type, COALESCE(category, ''), COALESCE(year, 0));
        """
    )


def next_protocol(conn: sqlite3.Connection, category: str, year: int) -> int:
    """Get next protocol number for (category, year), creating sequence if needed.

    Start values:
    - Signals categories -> 1
    - Others (common/confidential) -> 40001
    """
    _ensure_unique_index(conn)
    start = 1 if category.startswith("signals_") else 40001
    cur = conn.cursor()
    cur.execute(
        """
        SELECT id, nextNumber FROM numbering_sequences
        WHERE type = 'protocol' AND category = ? AND year = ?
        """,
        (category, year),
    )
    row = cur.fetchone()
    if row is None:
        cur.execute(
            """
            INSERT INTO numbering_sequences (type, category, year, nextNumber, lastUpdated)
            VALUES ('protocol', ?, ?, ?, ?)
            """,
            (category, year, start, _now_iso()),
        )
        next_num = start
    else:
        next_num = row["nextNumber"]
    # Increment for next time
    cur.execute(
        """
        UPDATE numbering_sequences
        SET nextNumber = ?, lastUpdated = ?
        WHERE type = 'protocol' AND category = ? AND year = ?
        """,
        (next_num + 1, _now_iso(), category, year),
    )
    return next_num


def next_draft(conn: sqlite3.Connection, outgoing_category: str) -> int:
    """Get next draft number for outgoing category; never resets."""
    _ensure_unique_index(conn)
    cur = conn.cursor()
    cur.execute(
        """
        SELECT id, nextNumber FROM numbering_sequences
        WHERE type = 'draft' AND category = ? AND year IS NULL
        """,
        (outgoing_category,),
    )
    row = cur.fetchone()
    if row is None:
        cur.execute(
            """
            INSERT INTO numbering_sequences (type, category, year, nextNumber, lastUpdated)
            VALUES ('draft', ?, NULL, 1, ?)
            """,
            (outgoing_category, _now_iso()),
        )
        next_num = 1
    else:
        next_num = row["nextNumber"]
    cur.execute(
        """
        UPDATE numbering_sequences
        SET nextNumber = ?, lastUpdated = ?
        WHERE type = 'draft' AND category = ? AND year IS NULL
        """,
        (next_num + 1, _now_iso(), outgoing_category),
    )
    return next_num
