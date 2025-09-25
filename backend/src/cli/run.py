from __future__ import annotations

import subprocess
import sys
import time
import webbrowser

import httpx


def wait_for_server(url: str, timeout_sec: int = 10) -> bool:
    start = time.time()
    while time.time() - start < timeout_sec:
        try:
            r = httpx.get(url, timeout=1.0)
            if r.status_code < 500:
                return True
        except Exception:
            time.sleep(0.3)
    return False


def main():
    host = "127.0.0.1"
    port = 8733
    url = f"http://{host}:{port}"

    # Start Uvicorn in a subprocess
    proc = subprocess.Popen(
        [sys.executable, "-m", "uvicorn", "backend.src.app:app", "--host", host, "--port", str(port)],
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True,
    )

    if wait_for_server(url, timeout_sec=10):
        webbrowser.open(url)
        print(f"Server running at {url}. Press Ctrl+C to stop.")
    else:
        print("Failed to start server in time.")

    try:
        proc.wait()
    except KeyboardInterrupt:
        proc.terminate()


if __name__ == "__main__":
    main()
