import re
from pathlib import Path


def test_no_external_network_hosts_present():
    root = Path(__file__).resolve().parents[2]
    patterns = [r"http://", r"https://"]
    allowed = [
        "http://127.0.0.1",
        "https://127.0.0.1",
        "http://localhost",
        "https://localhost",
        "http://{host}:{port}",  # allowed template used in CLI run
    ]
    offenders = []
    self_path = Path(__file__).resolve()
    for path in root.rglob("*.py"):
        if "/.venv/" in str(path):
            continue
        if path.resolve() == self_path:
            continue
        text = path.read_text(encoding="utf-8", errors="ignore")
        for pat in patterns:
            for m in re.finditer(pat, text):
                start = m.start()
                snippet = text[start:start + 200]
                if not any(snippet.startswith(a) for a in allowed):
                    offenders.append((str(path), snippet.splitlines()[0]))
    assert not offenders, f"External network hosts detected: {offenders}"
