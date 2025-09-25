import os
import tempfile
from backend.src.services.db import get_connection, init_db
from backend.src.services.numbering import next_protocol, next_draft


def test_protocol_start_values_and_yearly_reset():
    # Isolate DB per test
    with tempfile.TemporaryDirectory() as td:
        os.environ["REGISTRY_DB_PATH"] = os.path.join(td, "test.db")
        # initialize schema in the isolated DB
        init_db()
        conn = get_connection()
        # Signals start at 1
        n1 = next_protocol(conn, "signals_incoming", 2025)
        assert n1 == 1
        n2 = next_protocol(conn, "signals_incoming", 2025)
        assert n2 == 2
        # Yearly reset
        n3 = next_protocol(conn, "signals_incoming", 2026)
        assert n3 == 1

        # Common start at 40001
        c1 = next_protocol(conn, "common_incoming", 2025)
        assert c1 == 40001
        c2 = next_protocol(conn, "common_incoming", 2025)
        assert c2 == 40002
        conn.close()


def test_draft_never_resets_and_per_outgoing_category():
    with tempfile.TemporaryDirectory() as td:
        os.environ["REGISTRY_DB_PATH"] = os.path.join(td, "test.db")
        # initialize schema in the isolated DB
        init_db()
        conn = get_connection()
        d1 = next_draft(conn, "common_outgoing")
        d2 = next_draft(conn, "common_outgoing")
        assert d1 == 1 and d2 == 2
        # Different outgoing category has its own sequence
        dx1 = next_draft(conn, "confidential_outgoing")
        assert dx1 == 1
        conn.close()
