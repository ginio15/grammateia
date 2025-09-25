@echo off
REM Helper to create venv (if missing), activate and start the backend from project root
cd /d "%~dp0backend"
if not exist .venv (
  py -3 -m venv .venv
  call .venv\Scripts\activate
  pip install -r requirements.txt
) else (
  call .venv\Scripts\activate
)
REM Ensure DB is created inside project data folder
set REGISTRY_DB_PATH=%CD%\..\data\app.db
python -m backend.src.cli.run
pause
