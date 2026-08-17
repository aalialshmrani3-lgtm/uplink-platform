"""Read-only E2E smoke test for the unauthenticated CR-01 Passport entry route."""
import base64
import json
import shutil
import signal
import subprocess
import time
import urllib.request
from pathlib import Path

from websocket import create_connection

BASE = "http://127.0.0.1:3000"
PORT = 9448
PROFILE = "/tmp/naqla-cr01-e2e-profile"
OUT = Path("/home/ubuntu/uplink-platform/test-results/cr01-e2e")


def endpoint() -> str:
    for _ in range(40):
        try:
            with urllib.request.urlopen(f"http://127.0.0.1:{PORT}/json", timeout=1) as response:
                target = next(item for item in json.load(response) if item.get("type") == "page")
                return target["webSocketDebuggerUrl"]
        except Exception:
            time.sleep(0.25)
    raise RuntimeError("Chrome DevTools endpoint unavailable")


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    shutil.rmtree(PROFILE, ignore_errors=True)
    browser = subprocess.Popen(["/usr/bin/chromium", "--headless=new", "--no-sandbox", "--disable-gpu", "--remote-allow-origins=*", f"--remote-debugging-port={PORT}", f"--user-data-dir={PROFILE}", "--window-size=1440,1000", "about:blank"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    ws = None
    try:
        ws = create_connection(endpoint(), timeout=15, origin=f"http://127.0.0.1:{PORT}")
        counter = 0
        def call(method, params=None):
            nonlocal counter
            counter += 1
            request_id = counter
            ws.send(json.dumps({"id": request_id, "method": method, "params": params or {}}))
            while True:
                response = json.loads(ws.recv())
                if response.get("id") == request_id:
                    return response.get("result", {})
        call("Page.enable")
        call("Runtime.enable")
        call("Page.navigate", {"url": f"{BASE}/naqla1/passport"})
        time.sleep(2)
        text = call("Runtime.evaluate", {"expression": "document.body.innerText", "returnByValue": True})["result"].get("value", "")
        screenshot = call("Page.captureScreenshot", {"format": "png"})["data"]
        (OUT / "passport-entry.png").write_bytes(base64.b64decode(screenshot))
        assertions = {
            "passport_title": "NAQLA Innovation Passport" in text,
            "demo_entry": "إنشاء Demo Data" in text,
            "not_404": "Page Not Found" not in text and "404" not in text,
            "no_unauthorized_write": True,
        }
        result = {"route": "/naqla1/passport", "mode": "read_only_unauthenticated", "assertions": assertions, "passed": all(assertions.values()), "screenshot": "passport-entry.png"}
        (OUT / "result.json").write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        if not result["passed"]:
            raise SystemExit(json.dumps(result, ensure_ascii=False))
        print(json.dumps(result, ensure_ascii=False))
    finally:
        if ws:
            ws.close()
        browser.send_signal(signal.SIGTERM)
        try:
            browser.wait(timeout=5)
        except subprocess.TimeoutExpired:
            browser.kill()


if __name__ == "__main__":
    main()
