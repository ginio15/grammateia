from __future__ import annotations

import random
from datetime import date, timedelta

from backend.src.services.db import get_connection
from backend.src.services.numbering import next_draft, next_protocol


CATEGORIES = [
    "common_incoming",
    "common_outgoing",
    "confidential_incoming",
    "confidential_outgoing",
    "signals_incoming",
    "signals_outgoing",
]


def main(total: int = 500) -> None:
    conn = get_connection()
    cur = conn.cursor()
    today = date.today()

    for i in range(total):
        category = random.choice(CATEGORIES)
        days_ago = random.randint(0, 365)
        d = today - timedelta(days=days_ago)
        year = d.year
        protocol = next_protocol(conn, category, year)
        draft = next_draft(conn, category) if category.endswith("outgoing") else None
        issuer = f"Issuer {i}"
        ref = f"REF-{i:04d}"
        subject = f"Subject {i}"
        recipient = f"Recipient {i}" if category.endswith("outgoing") else None
        offices = "OFF-1,OFF-2" if category.endswith("incoming") else None

        cur.execute(
            """
            INSERT INTO registrations (
                category, issuer, referenceNumber, subject, recipient, offices,
                protocolNumber, draftNumber, entryDate, createdAt, deletedFlag
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), 0)
            """,
            (
                category,
                issuer,
                ref,
                subject,
                recipient,
                offices,
                protocol,
                draft,
                d.isoformat(),
            ),
        )
    conn.commit()
    conn.close()


if __name__ == "__main__":
    main()
