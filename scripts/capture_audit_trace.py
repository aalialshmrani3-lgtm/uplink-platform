#!/usr/bin/env python3
"""Capture a Chrome DevTools trace for local read-only /audit interactions."""

import json
import shutil
import signal
import subprocess
import time
import urllib.request
from pathlib import Path

from websocket import create_connection

PORT = 9445
PROFILE = "/tmp/naqla-audit-trace-profile"
OUT = Path("/home/ubuntu/naqla_audit_baseline/tests/audit_staging_trace.json")


class CDP:
    def __init__(self, url: str):
        self.ws = create_connection(url, timeout=20, origin=f"http://127.0.0.1:{PORT}")
        self.id = 0

    def call(self, method: str, params: dict | None = None):
        self.id += 1
        call_id = self.id
        self.ws.send(json.dumps({"id": call_id, "method": method, "params": params or {}}))
        while True:
            message = json.loads(self.ws.recv())
            if message.get("id") == call_id:
                if "error" in message:
                    raise RuntimeError(message["error"])
                return message.get("result", {})
            if message.get("method") == "Tracing.tracingComplete":
                self.trace_stream = message.get("params", {}).get("stream")

    def wait_trace_stream(self):
        while True:
            message = json.loads(self.ws.recv())
            if message.get("method") == "Tracing.tracingComplete":
                return message.get("params", {}).get("stream")


def get_target():
    for _ in range(40):
        try:
            with urllib.request.urlopen(f"http://127.0.0.1:{PORT}/json", timeout=1) as response:
                target = next(item for item in json.load(response) if item.get("type") == "page")
            return target["webSocketDebuggerUrl"]
        except Exception:
            time.sleep(0.25)
    raise RuntimeError("Chrome debugging endpoint unavailable")


def main():
    shutil.rmtree(PROFILE, ignore_errors=True)
    OUT.parent.mkdir(parents=True, exist_ok=True)
    browser = subprocess.Popen([
        "/usr/bin/chromium", "--headless=new", "--no-sandbox", "--disable-gpu",
        f"--remote-debugging-port={PORT}", "--remote-allow-origins=*",
        f"--user-data-dir={PROFILE}", "--window-size=1440,1000", "about:blank",
    ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    try:
        cdp = CDP(get_target())
        cdp.call("Page.enable")
        cdp.call("Tracing.start", {"categories": "devtools.timeline,disabled-by-default-devtools.timeline", "transferMode": "ReturnAsStream"})
        cdp.call("Page.navigate", {"url": "http://127.0.0.1:3000/audit"})
        time.sleep(1.25)
        for selector in ["[data-testid=audit-role-company]", "[data-testid=audit-role-investor]", "[data-testid=audit-case-a]", "[data-testid=audit-case-c]"]:
            cdp.call("Runtime.evaluate", {"expression": f"document.querySelector('{selector}')?.click()", "awaitPromise": True})
            time.sleep(0.15)
        cdp.call("Tracing.end")
        stream = cdp.wait_trace_stream()
        chunks = []
        while True:
            result = cdp.call("IO.read", {"handle": stream})
            chunks.append(result.get("data", ""))
            if result.get("eof"):
                break
        cdp.call("IO.close", {"handle": stream})
        OUT.write_text("".join(chunks), encoding="utf-8")
        print(json.dumps({"trace": str(OUT), "bytes": OUT.stat().st_size}))
    finally:
        browser.send_signal(signal.SIGTERM)
        try:
            browser.wait(timeout=5)
        except subprocess.TimeoutExpired:
            browser.kill()


if __name__ == "__main__":
    main()
