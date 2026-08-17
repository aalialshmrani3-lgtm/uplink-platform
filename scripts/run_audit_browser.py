#!/usr/bin/env python3
"""Read-only browser audit for NAQLA routes.

This script never clicks controls except the local /audit role and scenario selectors.
It records page reachability, visible interactive controls, browser errors, request failures,
and screenshots into /home/ubuntu/naqla_audit_baseline/tests.
"""

import base64
import csv
import json
import os
import re
import shutil
import signal
import subprocess
import time
import urllib.request
from pathlib import Path

from websocket import create_connection

ROOT = Path("/home/ubuntu/uplink-platform")
OUT = Path("/home/ubuntu/naqla_audit_baseline/tests")
BASE = os.environ.get("NAQLA_AUDIT_BASE_URL", "http://127.0.0.1:3000")
PORT = 9333
PROFILE = "/tmp/naqla-audit-browser-profile"


def replace_route_params(route: str) -> str:
    return re.sub(r":([A-Za-z][A-Za-z0-9_]*)", "1", route)


def collect_routes() -> list[str]:
    source = (ROOT / "client/src/App.tsx").read_text(encoding="utf-8")
    routes = re.findall(r'<Route\s+path="([^"]+)"\s+component=', source)
    return sorted({replace_route_params(route) for route in routes})


class CDP:
    def __init__(self, ws_url: str):
        self.ws = create_connection(ws_url, timeout=15, origin=f"http://127.0.0.1:{PORT}")
        self.counter = 0

    def call(self, method: str, params: dict | None = None) -> dict:
        self.counter += 1
        request_id = self.counter
        self.ws.send(json.dumps({"id": request_id, "method": method, "params": params or {}}))
        while True:
            response = json.loads(self.ws.recv())
            if response.get("id") == request_id:
                if "error" in response:
                    raise RuntimeError(f"{method}: {response['error']}")
                return response.get("result", {})

    def drain_events(self) -> list[dict]:
        events = []
        self.ws.settimeout(0.05)
        while True:
            try:
                event = json.loads(self.ws.recv())
                if "method" in event:
                    events.append(event)
            except Exception:
                break
        self.ws.settimeout(15)
        return events


def launch_browser() -> subprocess.Popen:
    shutil.rmtree(PROFILE, ignore_errors=True)
    return subprocess.Popen(
        [
            "/usr/bin/chromium",
            "--headless=new",
            "--no-sandbox",
            "--disable-gpu",
            "--hide-scrollbars",
            f"--remote-debugging-port={PORT}",
            "--remote-allow-origins=*",
            f"--user-data-dir={PROFILE}",
            "--window-size=1440,1000",
            "about:blank",
        ],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )


def target_url() -> str:
    for _ in range(40):
        try:
            with urllib.request.urlopen(f"http://127.0.0.1:{PORT}/json", timeout=1) as response:
                targets = json.load(response)
            page = next((item for item in targets if item.get("type") == "page"), None)
            if page:
                return page["webSocketDebuggerUrl"]
        except Exception:
            time.sleep(0.25)
    raise RuntimeError("Chromium debugging endpoint unavailable")


def js_json(cdp: CDP, expression: str):
    result = cdp.call("Runtime.evaluate", {"expression": expression, "returnByValue": True, "awaitPromise": True})
    return result.get("result", {}).get("value")


def page_controls_script() -> str:
    return """
JSON.stringify({
  title: document.title,
  bodyText: (document.body?.innerText || '').slice(0, 3000),
  controls: [...document.querySelectorAll('a,button,input[type=submit],input[type=button]')].map((el, index) => ({
    index,
    tag: el.tagName.toLowerCase(),
    label: (el.innerText || el.value || el.getAttribute('aria-label') || '').trim().replace(/\\s+/g, ' ').slice(0, 200),
    href: el.getAttribute('href') || '',
    disabled: Boolean(el.disabled),
    testId: el.getAttribute('data-testid') || ''
  }))
})
"""


def save_screenshot(cdp: CDP, output: Path):
    data = cdp.call("Page.captureScreenshot", {"format": "png", "captureBeyondViewport": False})["data"]
    output.write_bytes(base64.b64decode(data))


def capture_route(cdp: CDP, route: str, index: int, button_rows: list[dict], journey_rows: list[dict], error_rows: list[dict]):
    url = f"{BASE}{route}"
    cdp.drain_events()
    cdp.call("Page.navigate", {"url": url})
    time.sleep(1.35)
    payload_raw = js_json(cdp, page_controls_script())
    payload = json.loads(payload_raw or "{}")
    events = cdp.drain_events()
    screenshot_name = f"route_{index:03d}.png"
    save_screenshot(cdp, OUT / "screenshots" / screenshot_name)
    body = payload.get("bodyText", "")
    outcome = "passed"
    note = "صفحة محمّلة وتم جمع عناصرها"
    if "404" in body and "Page Not Found" in body:
        outcome = "failed"
        note = "واجهة 404"
    elif "جاري التحميل" in body and len(body) < 120:
        outcome = "failed"
        note = "واجهة تحميل فقط بعد فترة الانتظار"
    journey_rows.append({"journey_id": f"ROUTE-{index:03d}", "route": route, "url": url, "outcome": outcome, "note": note, "screenshot": f"screenshots/{screenshot_name}"})
    for control in payload.get("controls", []):
        intended = "تنقل" if control["tag"] == "a" else "تفاعل واجهة يحتاج اختباراً وظيفياً"
        button_rows.append({
            "route": route,
            "control_index": control["index"],
            "tag": control["tag"],
            "label": control["label"],
            "href": control["href"],
            "test_id": control["testId"],
            "disabled": control["disabled"],
            "intended_behavior": intended,
            "observed_behavior": "رُصد في DOM فقط؛ لم يُنقر لتجنب أي كتابة/إجراء",
            "status": "not_clicked",
            "screenshot": f"screenshots/{screenshot_name}",
        })
    for event in events:
        method = event.get("method")
        params = event.get("params", {})
        if method == "Runtime.exceptionThrown":
            error_rows.append({"route": route, "category": "exception", "detail": str(params.get("exceptionDetails", {}))[:1000], "screenshot": f"screenshots/{screenshot_name}"})
        elif method == "Log.entryAdded" and params.get("entry", {}).get("level") in {"error", "warning"}:
            error_rows.append({"route": route, "category": f"console_{params['entry']['level']}", "detail": params["entry"].get("text", "")[:1000], "screenshot": f"screenshots/{screenshot_name}"})
        elif method == "Network.loadingFailed":
            error_rows.append({"route": route, "category": "network_failed", "detail": str(params)[:1000], "screenshot": f"screenshots/{screenshot_name}"})


def audit_local_interactions(cdp: CDP, button_rows: list[dict], journey_rows: list[dict]):
    cdp.call("Page.navigate", {"url": f"{BASE}/audit"})
    time.sleep(1.2)
    for test_id in ["audit-role-company", "audit-role-investor", "audit-case-a", "audit-case-b", "audit-case-c"]:
        before = js_json(cdp, "document.body.innerText") or ""
        js_json(cdp, f"document.querySelector('[data-testid={test_id}]')?.click(); true")
        time.sleep(0.2)
        after = js_json(cdp, "document.body.innerText") or ""
        journey_rows.append({
            "journey_id": f"AUDIT-{test_id}",
            "route": "/audit",
            "url": f"{BASE}/audit",
            "outcome": "passed" if before != after else "failed",
            "note": "تفاعل محلي لا يكتب بيانات ولا يغير صلاحية" if before != after else "لم يتغير نص الصفحة بعد النقر",
            "screenshot": "screenshots/route_001.png",
        })
        button_rows.append({
            "route": "/audit",
            "control_index": "local",
            "tag": "button",
            "label": test_id,
            "href": "",
            "test_id": test_id,
            "disabled": False,
            "intended_behavior": "تغيير منظور المراجعة أو حالة القصة محلياً",
            "observed_behavior": "تغير محتوى الصفحة محلياً" if before != after else "لم يرصد تغيراً نصياً",
            "status": "passed" if before != after else "failed",
            "screenshot": "screenshots/route_001.png",
        })


def write_csv(path: Path, fields: list[str], rows: list[dict]):
    with path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=fields)
        writer.writeheader()
        writer.writerows(rows)


def main():
    shutil.rmtree(OUT, ignore_errors=True)
    (OUT / "screenshots").mkdir(parents=True, exist_ok=True)
    browser = launch_browser()
    try:
        cdp = CDP(target_url())
        cdp.call("Page.enable")
        cdp.call("Runtime.enable")
        cdp.call("Network.enable")
        routes = collect_routes()
        buttons, journeys, errors = [], [], []
        for index, route in enumerate(routes, start=1):
            capture_route(cdp, route, index, buttons, journeys, errors)
        audit_local_interactions(cdp, buttons, journeys)
        write_csv(OUT / "BUTTON_MATRIX.csv", ["route", "control_index", "tag", "label", "href", "test_id", "disabled", "intended_behavior", "observed_behavior", "status", "screenshot"], buttons)
        write_csv(OUT / "JOURNEY_RESULTS.csv", ["journey_id", "route", "url", "outcome", "note", "screenshot"], journeys)
        write_csv(OUT / "ERROR_LOG.csv", ["route", "category", "detail", "screenshot"], errors)
        summary = {"base_url": BASE, "routes_tested": len(routes), "controls_recorded": len(buttons), "journeys_recorded": len(journeys), "errors_recorded": len(errors), "mode": "read_only"}
        (OUT / "TEST_SUMMARY.json").write_text(json.dumps(summary, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        print(json.dumps(summary, ensure_ascii=False))
    finally:
        browser.send_signal(signal.SIGTERM)
        try:
            browser.wait(timeout=5)
        except subprocess.TimeoutExpired:
            browser.kill()


if __name__ == "__main__":
    main()
