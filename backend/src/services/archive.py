from __future__ import annotations

from dataclasses import dataclass
from datetime import date, datetime, timedelta, timezone
from pathlib import Path
import sqlite3

from backend.src.services.db import resolve_db_path


@dataclass
class ArchiveResult:
    month: str
    itemsMoved: int


def _prev_month_yyyymm(today: date | None = None) -> str:
    if today is None:
        today = date.today()
    first = today.replace(day=1)
    prev = first - timedelta(days=1)
    return prev.strftime("%Y-%m")


def _ensure_archive_dir(db_path: Path) -> Path:
    archive_dir = db_path.parent / "archive"
    archive_dir.mkdir(parents=True, exist_ok=True)
    return archive_dir


def run_monthly_archive(conn: sqlite3.Connection) -> ArchiveResult:
    # Determine previous month
    target_month = _prev_month_yyyymm()
    # Compute archive DB path
    main_db_path = resolve_db_path()
    archive_dir = _ensure_archive_dir(main_db_path)
    archive_db_path = archive_dir / f"{target_month}.db"

    # Attach archive DB and ensure schema
    cur = conn.cursor()
    cur.execute("ATTACH DATABASE ? AS arch", (str(archive_db_path),))
    cur.executescript(
        """
        CREATE TABLE IF NOT EXISTS arch.registrations (
            id INTEGER PRIMARY KEY,
            category TEXT NOT NULL,
            issuer TEXT NOT NULL,
            referenceNumber TEXT NOT NULL,
            subject TEXT NOT NULL,
            recipient TEXT,
            offices TEXT,
            protocolNumber INTEGER NOT NULL,
            draftNumber INTEGER,
            entryDate TEXT NOT NULL,
            createdAt TEXT NOT NULL,
            deletedFlag INTEGER NOT NULL,
            deletedAt TEXT
        );

        CREATE TABLE IF NOT EXISTS arch.audit_events (
            id INTEGER PRIMARY KEY,
            action TEXT NOT NULL,
            registrationId INTEGER NOT NULL,
            timestamp TEXT NOT NULL,
            username TEXT NOT NULL
        );
        """
    )

    # Move registrations and their audit events for the previous month
    # Only move rows whose entryDate starts with target_month
    res = cur.execute(
        "SELECT COUNT(*) AS cnt FROM registrations WHERE entryDate LIKE ?",
        (f"{target_month}%",),
    ).fetchone()
    to_move = int(res["cnt"]) if res else 0

    if to_move > 0:
        cur.execute(
            """
            INSERT INTO arch.registrations
            SELECT * FROM main.registrations WHERE entryDate LIKE ?
            """,
            (f"{target_month}%",),
        )
        # Move audit events for those registrations
        cur.execute(
            """
            INSERT INTO arch.audit_events
            SELECT ae.* FROM main.audit_events ae
            WHERE ae.registrationId IN (
                SELECT id FROM main.registrations WHERE entryDate LIKE ?
            )
            """,
            (f"{target_month}%",),
        )
        # Delete moved rows from main
        cur.execute("DELETE FROM main.audit_events WHERE registrationId IN (SELECT id FROM main.registrations WHERE entryDate LIKE ?)", (f"{target_month}%",))
        cur.execute("DELETE FROM main.registrations WHERE entryDate LIKE ?", (f"{target_month}%",))

    # Record archive batch in main DB
    now_iso = datetime.now(timezone.utc).isoformat(timespec="seconds")
    cur.execute(
        "INSERT INTO archive_batches (month, createdAt, itemsMoved) VALUES (?, ?, ?)",
        (target_month, now_iso, to_move),
    )

    # Finalize and detach
    conn.commit()
    cur.execute("DETACH DATABASE arch")
    cur.close()

    return ArchiveResult(month=target_month, itemsMoved=to_move)
