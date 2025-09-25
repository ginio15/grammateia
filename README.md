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

4.  **Initialize the database:**
    This will create the `app.db` file with the necessary schema in `C:/RegistryApp/data/`.
    ```sh
    python -c "from backend.src.services.db import init_db; init_db()"
    ```

5.  **(Optional) Seed the database with sample data:**
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
