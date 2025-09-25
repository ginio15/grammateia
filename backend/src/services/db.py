import os
import sqlite3
from pathlib import Path

PREFERRED_PATH = Path("C:/RegistryApp/data/app.db")


def resolve_db_path() -> Path:
    # Test override via environment variable
    env_path = os.environ.get("REGISTRY_DB_PATH")
    if env_path:
        p = Path(env_path)
        try:
            p.parent.mkdir(parents=True, exist_ok=True)
        except Exception:
            pass
        return p
    try:
        preferred_dir = PREFERRED_PATH.parent
        preferred_dir.mkdir(parents=True, exist_ok=True)
        return PREFERRED_PATH
    except Exception:
        # Fallback to current working directory
        return Path.cwd() / "app.db"


def get_connection() -> sqlite3.Connection:
    db_path = resolve_db_path()
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    # Enable WAL mode
    conn.execute("PRAGMA journal_mode=WAL;")
    return conn


def init_db():
    conn = get_connection()
    cur = conn.cursor()
    # Minimal schema; will be expanded later per data-model.md
    cur.executescript(
        """
        CREATE TABLE IF NOT EXISTS registrations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
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
            deletedFlag INTEGER NOT NULL DEFAULT 0,
            deletedAt TEXT
        );

        CREATE TABLE IF NOT EXISTS numbering_sequences (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            type TEXT NOT NULL,
            category TEXT,
            year INTEGER,
            nextNumber INTEGER NOT NULL,
            lastUpdated TEXT
        );

        CREATE TABLE IF NOT EXISTS audit_events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            action TEXT NOT NULL,
            registrationId INTEGER NOT NULL,
            timestamp TEXT NOT NULL,
            username TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS archive_batches (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            month TEXT NOT NULL,
            createdAt TEXT NOT NULL,
            itemsMoved INTEGER NOT NULL
        );
        """
    )
    conn.commit()
    conn.close()
