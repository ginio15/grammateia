# Running Grammateia from a USB Drive on Windows

This guide shows how to run the app (backend + frontend) on a Windows machine **without installing anything globally besides Python and Node.js**. Everything else stays inside the project folder so you can move it with a USB stick.

## 1. Prerequisites (One-Time per PC)
Install these if the target PC does not already have them:

- **Python 3.9+** (Recommend 3.11). During install: check "Add Python to PATH".
- **Node.js 18+ LTS** (includes `npm`).

You do **not** need Docker.

## 2. Copy the Project
Copy the entire `grammateia3` folder to e.g. `D:\apps\grammateia3` (or run directly from the USB drive letter, e.g. `E:`). Avoid paths with spaces if possible.

## 3. Folder Overview
```
backend/   # FastAPI + SQLite
frontend/  # React + Vite + TypeScript
```
A `data/` folder will be created automatically the first time the backend runs (holds `app.db`).

## 4. Set Up Backend (Virtual Environment)
Open **Command Prompt** (cmd.exe) and run:
```bat
cd path\to\grammateia3\backend
py -3 -m venv .venv
call .venv\Scripts\activate
pip install --upgrade pip
pip install -r requirements.txt
```
If you later move the project, you can usually keep the same `.venv`; if it breaks, just delete the `.venv` folder and repeat the above.

## 5. (Optional) Pin the Database Location
By default the database will be created in a `data` directory relative to where you start the backend. To ensure it always lives inside the project (portable), set an environment variable before starting the server:
```bat
set REGISTRY_DB_PATH=%CD%\..\data\app.db
```
You can also define this permanently with:
```bat
setx REGISTRY_DB_PATH "%CD%\..\data\app.db"
```
(Open a new terminal after using `setx`.)

## 6. Start the Backend
From the activated virtual environment inside `backend`:
```bat
python -m backend.src.cli.run
```
Expected output includes a line like:
```
Uvicorn running on http://127.0.0.1:8733
```
Leave this window open while using the app.

### Resetting the Database (Destructive)
If you need a clean slate:
```bat
python -c "from backend.src.services.db import init_db; init_db()"
```
Only do this if you really want to delete all existing records.

## 7. Set Up Frontend
Open a **second** Command Prompt window (or PowerShell) and run:
```bat
cd path\to\grammateia3\frontend
npm install
```
This creates a local `node_modules` folder (can be deleted and regenerated any time).

## 8. Start the Frontend (Dev Mode)
Still in `frontend`:
```bat
npm run dev
```
Vite will show a URL like: `http://localhost:5173` – open it in a browser.

## 9. Using the App
1. Fill out the registration form.
2. Submit to persist—it calls the backend API.
3. Data is stored in the SQLite file at `data\app.db` (or the path you set via `REGISTRY_DB_PATH`).
4. You can stop both servers (Ctrl+C) and later restart; your data remains.

## 10. Optional: Create Convenience Batch Files
Inside the project root (`grammateia3`), you can add these helpers:

`start-backend.bat`:
```bat
@echo off
cd backend
call .venv\Scripts\activate
set REGISTRY_DB_PATH=%CD%\..\data\app.db
python -m backend.src.cli.run
```

`start-frontend.bat`:
```bat
@echo off
cd frontend
npm run dev
```
Double-click each to launch the servers (backend first, then frontend).

## 11. Building the Frontend for Static Preview (Optional)
If you prefer a built version:
```bat
cd frontend
npm run build
npm run preview
```
`npm run preview` serves the production build locally (still needs the backend running for API calls).

## 12. Common Issues
| Symptom | Cause | Fix |
|---------|-------|-----|
| `ModuleNotFoundError` in backend | Virtual env not active | Run `call .venv\Scripts\activate` inside `backend` |
| `EADDRINUSE` / port in use | Another process on port 5173 or 8733 | Stop other process or change port (see below) |
| Frontend shows no registrations | Backend not running or wrong port | Start backend; confirm URL `http://127.0.0.1:8733/registrations` works |
| Database not updating | Using old DB path | Echo `%REGISTRY_DB_PATH%` to verify environment variable |
| Corrupted venv after moving project | Absolute paths cached | Delete `.venv` and recreate |

### Change Backend Port
You can run the backend on another port (e.g. 9000):
```bat
uvicorn backend.src.app:app --host 127.0.0.1 --port 9000 --reload
```
(Install `uvicorn` already included in requirements.) Update any hardcoded frontend base URL if present (currently it uses relative or configured endpoint—adjust if needed).

## 13. Safe Cleanup
- To reclaim space: delete `.venv`, `frontend\node_modules`, and the `data` folder (if you also want to remove records).
- You can always regenerate them via the steps above.

## 14. Verifying Persistence
After creating a registration, confirm the row count:
```bat
cd backend
call .venv\Scripts\activate
python - <<PY
import sqlite3, os
from backend.src.services.db import resolve_db_path
p = resolve_db_path()
print('DB Path:', p)
conn = sqlite3.connect(p)
print('Registrations:', conn.execute('select count(*) from registrations').fetchone()[0])
PY
```

## 15. Quick Checklist
- [ ] Python installed
- [ ] Node.js installed
- [ ] Created `.venv` and installed backend deps
- [ ] Ran `npm install` in `frontend`
- [ ] Backend running (`http://127.0.0.1:8733`)
- [ ] Frontend running (`http://localhost:5173`)
- [ ] Data persists after restart

---
Feel free to adapt these steps or script them further if you distribute this internally.
