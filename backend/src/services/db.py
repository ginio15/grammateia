import os
import sqlite3
from pathlib import Path

# Cross-platform data directory
def get_data_dir() -> Path:
    """Get the appropriate data directory for the current platform"""
    if os.name == 'nt':  # Windows
        return Path("C:/RegistryApp/data")
    else:  # macOS/Linux
        # Use a data directory in the project root
        return Path.cwd() / "data"

PREFERRED_PATH = get_data_dir() / "app.db"


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


def ensure_db():
    """Ensure database exists and has correct schema, without deleting existing data"""
    db_path = resolve_db_path()
    
    conn = get_connection()
    schema_path = Path(__file__).parent.parent / "models" / "schema.sql"
    with open(schema_path, "r") as f:
        schema = f.read()
    
    # Execute schema - uses "CREATE TABLE IF NOT EXISTS" so it's safe
    conn.executescript(schema)
    conn.commit()
    conn.close()


def init_db():
    """Initialize database from scratch - WARNING: This deletes existing data!"""
    db_path = resolve_db_path()
    if db_path.exists():
        # This is a simple approach for a single-user, local app.
        # In a real-world scenario, a proper migration tool should be used.
        db_path.unlink()

    conn = get_connection()
    schema_path = Path(__file__).parent.parent / "models" / "schema.sql"
    with open(schema_path, "r") as f:
        schema = f.read()
    
    conn.executescript(schema)
    conn.commit()
    conn.close()
