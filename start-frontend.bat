@echo off
REM Helper to install frontend deps (if missing) and start Vite dev server
cd /d "%~dp0frontend"
if not exist node_modules (
  npm install
)
npm run dev
pause
