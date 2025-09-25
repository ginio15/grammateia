import os
import sqlite3
import tempfile
from datetime import date, datetime, timedelta, timezone

from backend.src.services.db import get_connection, init_db, resolve_db_path
from backend.src.services.archive import run_monthly_archive


def _prev_month_yyyymm(today: date | None = None) -> str:
    if today is None:
        today = date.today()
    first = today.replace(day=1)
    prev = first - timedelta(days=1)
    return prev.strftime("%Y-%m")


def test_run_monthly_archive_moves_previous_month_records():
    with tempfile.TemporaryDirectory() as td:  # isolate DB per test
        os.environ["REGISTRY_DB_PATH"] = os.path.join(td, "test.db")
        init_db()
        conn = get_connection()
        cur = conn.cursor()

        target_month = _prev_month_yyyymm()
        prev_entry_date = f"{target_month}-15T10:00:00Z"
        curr_month = date.today().strftime("%Y-%m")
        curr_entry_date = f"{curr_month}-05T08:30:00Z"
        now_iso = datetime.now(timezone.utc).isoformat(timespec="seconds")

        registrations = [
            ("common_incoming", "Issuer A", "REF-A", "Subject A", None, "[\"OF001\"]", 40001, None, prev_entry_date, now_iso),
            ("common_outgoing", "Issuer B", "REF-B", "Subject B", "Recipient B", None, 40002, 1, prev_entry_date, now_iso),
            ("signals_incoming", "Issuer C", "REF-C", "Subject C", None, "[\"OF002\"]", 1, None, curr_entry_date, now_iso),
        ]

        for reg in registrations:
            cur.execute(
                """
                INSERT INTO registrations (category, issuer, referenceNumber, subject, recipient, offices, protocolNumber, draftNumber, entryDate, createdAt, deletedFlag)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
                """,
                reg,
            )

        reg_ids = [row[0] for row in cur.execute("SELECT id FROM registrations").fetchall()]

        for rid in reg_ids:
            cur.execute(
                "INSERT INTO audit_events (action, registrationId, timestamp, username) VALUES (?, ?, ?, ?)",
                ("create", rid, now_iso, "tester"),
            )

        conn.commit()

        result = run_monthly_archive(conn)
        assert result.month == target_month
        assert result.itemsMoved == 2

        cur = conn.cursor()
        assert cur.execute("SELECT COUNT(*) FROM registrations").fetchone()[0] == 1
        assert cur.execute("SELECT COUNT(*) FROM audit_events").fetchone()[0] == 1

        main_db_path = resolve_db_path()
        archive_db_path = main_db_path.parent / "archive" / f"{target_month}.db"
        assert archive_db_path.exists()

        arch = sqlite3.connect(archive_db_path)
        try:
            assert arch.execute("SELECT COUNT(*) FROM registrations").fetchone()[0] == 2
            assert arch.execute("SELECT COUNT(*) FROM audit_events").fetchone()[0] == 2
        finally:
            arch.close()

        assert cur.execute(
            "SELECT COUNT(*) FROM archive_batches WHERE month = ?",
            (target_month,),
        ).fetchone()[0] == 1

        conn.close()
