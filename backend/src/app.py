from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from backend.src.services.db import init_db
from backend.src.api.meta import router as meta_router
from backend.src.api.registrations import router as registrations_router
from backend.src.api.admin import router as admin_router

@asynccontextmanager
async def lifespan(app: FastAPI):  # type: ignore
    # Startup
    init_db()
    yield
    # Shutdown (no-op for now)


app = FastAPI(title="Offline Registry App API", version="0.1.0", lifespan=lifespan)

# Add CORS middleware for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],  # Vite default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers will be included here (meta, registrations, admin)
app.include_router(meta_router)
app.include_router(registrations_router)
app.include_router(admin_router)

@app.get("/health")
def health():
    return {"status": "ok"}
