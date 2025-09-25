# Quickstart — Offline Registry App

This quickstart describes how to run and validate the app locally after implementation.

## Run (dev)
- Backend: FastAPI app on 127.0.0.1:8733
- Frontend: existing React SPA in `frontend/`

## Minimal validation steps
1) Meta endpoints
- GET /meta/fields returns bilingual labels
- GET /meta/offices returns a static list of offices

2) Create registrations
- POST /registrations/common_incoming with issuer, referenceNumber, subject, offices=[...]
- POST /registrations/common_outgoing with issuer, referenceNumber, subject, recipient
- Confirm protocol numbers follow category-specific seeds and reset policy; outgoing draft numbers increment forever per outgoing category

3) List and paginate
- GET /registrations?month=YYYY-MM&category=common_outgoing&page=1 → pageSize=100

4) Soft delete
- DELETE /registrations/{id} → 204; verify item remains listed with deletedFlag=true and number preserved

5) Archive
- POST /admin/archive/run → verify archive/YYYY-MM.db exists and itemsMoved > 0 for previous month

## Packaging (Windows)
- Build portable `.exe` using PyInstaller (one-folder mode):
	- Install: `pip install pyinstaller`
	- Build: `pyinstaller backend/packaging/GrammatEIARegistry.spec`
- Launch the generated `dist/GrammatEIARegistry/GrammatEIARegistry.exe`.
- On start, the app launches the server on 127.0.0.1:8733 and auto-opens the default browser.
- Verify data is stored at `C:\\RegistryApp\\data\\app.db` or cwd fallback.

## Dataset for QA
- Seed ~500 entries across categories with dates within the last year to validate pagination and archiving.
