# Phase 0 Research — Offline Registry App

Date: 2025-09-24
Feature: 001-an-offline-registry

## Decisions and Rationale

### 1) Packaging: PyInstaller
- Decision: Use PyInstaller to build a portable Windows `.exe` that bundles the FastAPI app and Python runtime.
- Rationale: Mature, offline-friendly, widely used for Python apps; supports one-file and one-folder modes.
- Alternatives: Nuitka (faster binaries but heavier setup), cx_Freeze (less common), Briefcase (geared to GUI apps).
- Notes: Prefer one-folder for faster startup and easier data co-location; can evaluate one-file if required.

### 2) Auto-open Browser on Start
- Decision: On app start, spawn the FastAPI server bound to 127.0.0.1:8733 and open the default browser to http://127.0.0.1:8733.
- Rationale: Improves operator UX; required by constitution.
- Pattern: Use Python `webbrowser.open` after server starts or a short retry loop.

### 3) SQLite Path & WAL Mode
- Decision: Primary path `C:\\RegistryApp\\data\\app.db`; if not writable or directory missing, fallback to `cwd/app.db`.
- Rationale: Constitution requires preferred path with safe fallback.
- Implementation: Ensure parent directory exists (create if missing); `PRAGMA journal_mode=WAL;` on connection.

### 4) Numbering Atomicity and Sequences
- Decision: Maintain `numbering_sequences` table with rows per (category, year) for protocol numbers and per (outgoingCategory) for draft numbers.
- Rationale: Guarantees deterministic numbering and safe concurrent increments (even though single-user).
- Implementation: Generate numbers inside a transaction. Protocol resets yearly; draft numbers never reset, scoped per outgoing category.

### 5) Audit Username Source
- Decision: Read Windows username from `USERNAME` environment variable; fallback to `"unknown"` if missing.
- Rationale: Clarified requirement; no blocking on missing variable.

### 6) Archiving Strategy
- Decision: Use SQLite `ATTACH DATABASE 'archive/YYYY-MM.db' AS arch;` then `INSERT INTO arch.registrations SELECT ...` and `DELETE FROM main.registrations WHERE ...`.
- Rationale: Atomic-ish movement within SQLite; matches constitution.
- Edge: Ensure archive directory exists; run only for previous month; record `ArchiveBatch` summary.

### 7) Synthetic Dataset (~500)
- Decision: Provide a seeding script to insert ~500 entries across categories with plausible dates within the last year.
- Rationale: QA and pagination validation.

## Best Practices Notes
- FastAPI + Pydantic models for request/response validation.
- Use Alembic optional; for simplicity, initial DDL executed at startup.
- Enforce all text fields <= 255 chars at API and DB levels.
- Keep responses bilingual where relevant for labels through `GET /meta/*` endpoints.

## Open Questions (none)
All clarifications resolved per spec.
