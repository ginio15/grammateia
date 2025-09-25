from fastapi import APIRouter

from backend.src.services.db import get_connection
from backend.src.services.archive import run_monthly_archive

router = APIRouter(prefix="/admin", tags=["admin"])


@router.post("/archive/run")
def run_archive():
    conn = get_connection()
    result = run_monthly_archive(conn)
    conn.close()
    return {"month": result.month, "itemsMoved": result.itemsMoved}
