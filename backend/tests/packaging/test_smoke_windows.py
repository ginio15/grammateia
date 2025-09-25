import os
import sys
import pytest


@pytest.mark.skipif(sys.platform != "win32", reason="Windows-only packaging smoke test")
def test_packaged_binary_starts_server():
    # Placeholder: In CI on Windows, build with PyInstaller and run
    exe_path = os.environ.get("REGISTRY_APP_EXE")
    assert exe_path and os.path.exists(exe_path), "Provide REGISTRY_APP_EXE to run smoke test"
    # Further steps would start the process and poll http://127.0.0.1:8733
    # Keeping as placeholder to avoid side effects here
    assert True
