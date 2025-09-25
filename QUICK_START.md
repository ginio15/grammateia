# Quick Start — Grammateia (1 page)

This is a minimal quick-start to get the backend and frontend running fast.

Prereqs
- Python 3.9+ (3.11 recommended)
- Node.js 18+ (or a portable Node binary)

Quick steps (macOS / Linux)
```bash
# backend
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# run backend (in its terminal)
python -m backend.src.cli.run

# frontend (in another terminal)
cd frontend
npm install
npm run dev
```

Quick steps (Windows — cmd.exe)
```bat
REM backend
cd backend
py -3 -m venv .venv
call .venv\Scripts\activate
pip install -r requirements.txt
REM run backend (keep this window open)
python -m backend.src.cli.run

REM frontend (new window)
cd frontend
npm install
npm run dev
```

Notes
- Backend will automatically create a `data/` folder with `app.db` on first run.
- To force a fresh (destructive) DB reset:
  ```bash
  python -c "from backend.src.services.db import init_db; init_db()"
  ```
- If running from USB on Windows, optionally set `REGISTRY_DB_PATH` so DB stays inside the project:
  ```bat
  set REGISTRY_DB_PATH=%CD%\..\data\app.db
  ```

Do I need admin access to install Python and Node on Windows?
- Short answer: No — not necessarily.

- Python: the official installer provides an "Install for me" / "Add to PATH" option which installs for the current user and does not require admin rights. Alternatively you can use the embeddable zip distribution and extract it into the project or a user folder.

- Node.js: the standard Windows MSI/installer often requires admin to install system‑wide under `Program Files`. However you have these no‑admin alternatives:
  - Install Node from the Microsoft Store (sometimes available without admin).
  - Use a portable Node binary (download the Windows zip from nodejs.org, extract to a folder on the USB or your user directory, and run `node`/`npm` from there). You can temporarily prepend that folder to PATH in your terminal session:
    ```bat
    set PATH=C:\path\to\node-folder;%PATH%
    ```
  - Use a per-user Node version manager (some require admin to install; check the chosen tool first).

- Ports and privileges: the app uses user-level ports (5173 for Vite, 8733 for backend). No admin privileges are required to bind those ports.

Recommendation
- If you want to avoid admin on many target PCs, use:
  1. Python installer with "Install for me" (or embeddable zip).
  2. Node portable zip extracted to the project (or Microsoft Store Node if available).

If you'd like, I can:
- add small `start-*.bat` and `start-*.sh` helper scripts to the repo, or
- add a tiny section to `README.md` linking this quick-start and the existing `WINDOWS_PORTABLE.md`.

That's it — tell me if you want the helper scripts added now.
