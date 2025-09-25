# Grammateia - Offline Registry App

Grammateia is a web application for offline document registration. It provides a simple interface for registering incoming and outgoing documents across various categories, assigning them protocol and draft numbers.

## Tech Stack

- **Backend:** Python, FastAPI, SQLite
- **Frontend:** React, TypeScript, Vite, Tailwind CSS

## Project Structure

```
/
├── backend/         # Python FastAPI backend
│   ├── src/
│   └── tests/
├── frontend/        # React/TypeScript frontend
│   └── src/
└── specs/           # Project specifications
```

## Getting Started

Follow these instructions to set up and run the project on your local machine.

### Prerequisites

- Python 3.9+
- Node.js 18+ and npm

### Backend Setup

1.  **Navigate to the backend directory:**
    ```sh
    cd backend
    ```

2.  **Create and activate a virtual environment:**
    ```sh
    python -m venv .venv
    source .venv/bin/activate
    # On Windows, use: .venv\Scripts\activate
    ```

3.  **Install Python dependencies:**
    ```sh
    pip install -r requirements.txt
    ```

4.  **Database initialization (automatic):**
        The first time you run the backend it will automatically create the SQLite database (schema) in a `data/` folder at the project root (portable). 
    
        - On Windows, if you prefer a fixed location (legacy style), you can set an environment variable before running the server:
            ```bat
            set REGISTRY_DB_PATH=%CD%\data\app.db
            ```
            (PowerShell: `setx REGISTRY_DB_PATH "$PWD\\data\\app.db"` then open a new shell.)
        - To force a fresh empty database (this DELETES existing data) you can run:
            ```sh
            python -c "from backend.src.services.db import init_db; init_db()"
            ```
            Use this only when you intentionally want to reset everything.

5.  **(Optional) Seed the database with sample data:** (Only if you have a seeding script; skip if not present.)
        ```sh
        python -m backend.src.cli.seed
        ```

### Frontend Setup

1.  **Navigate to the frontend directory:**
    ```sh
    cd frontend
    ```

2.  **Install Node.js dependencies:**
    ```sh
    npm install
    ```

## Running the Application

You need to run both the backend and frontend servers.

1.  **Run the Backend Server:**
    From the `backend` directory:
    ```sh
    python -m backend.src.cli.run
    ```
    The server will be available at `http://127.0.0.1:8733`.

2.  **Run the Frontend Development Server:**
    From the `frontend` directory:
    ```sh
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

### Production / Portable (Windows USB) Notes

If you intend to carry this project on a USB stick and run it on a Windows machine:

1. Copy the whole project folder onto the USB (or directly onto the target machine).
2. On the target Windows PC install (one‑time):
    - Python 3.9+ (recommended 3.11)
    - Node.js 18+ (LTS)
3. Create a virtual environment inside `backend` and install dependencies:
    ```bat
    cd backend
    py -3 -m venv .venv
    call .venv\Scripts\activate
    pip install -r requirements.txt
    ```
4. Install frontend dependencies:
    ```bat
    cd ..\frontend
    npm install
    ```
5. (Optional) Set a portable DB path so the DB file stays with the project:
    ```bat
    set REGISTRY_DB_PATH=%CD%\..\data\app.db
    ```
6. Start backend (from `backend` directory, with venv active):
    ```bat
    python -m backend.src.cli.run
    ```
7. Start frontend (from `frontend`):
    ```bat
    npm run dev
    ```

See `WINDOWS_PORTABLE.md` for a more detailed, copy‑paste friendly guide (including optional batch scripts).

## Running Tests

-   **Backend Tests:**
    From the `backend` directory, run:
    ```sh
    pytest
    ```

-   **Frontend Tests:**
    From the `frontend` directory, run:
    ```sh
    npm test
    ```
