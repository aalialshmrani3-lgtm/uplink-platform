import assert from "node:assert/strict";
import { createServer } from "node:net";
import { spawn } from "node:child_process";

const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
const freePort = () => new Promise((resolve, reject) => {
  const probe = createServer();
  probe.once("error", reject);
  probe.listen(0, "127.0.0.1", () => {
    const address = probe.address();
    const port = typeof address === "object" && address ? address.port : undefined;
    probe.close((error) => error ? reject(error) : resolve(port));
  });
});

const waitFor = async (predicate, label) => {
  let lastError;
  for (let index = 0; index < 80; index += 1) {
    try {
      const result = await predicate();
      if (result) return result;
    } catch (error) {
      lastError = error;
    }
    await sleep(125);
  }
  throw new Error(`MOBILE_BROWSER_TIMEOUT_${label}_${lastError instanceof Error ? lastError.message : "unknown"}`);
};

const appPort = await freePort();
const debugPort = await freePort();
let server;
let chrome;
let socket;
try {
  server = spawn("node", ["dist/index.js"], {
    cwd: process.cwd(),
    env: { ...process.env, NODE_ENV: "production", PORT: String(appPort), AI_EXTERNAL_PROVIDER_ENABLED: "false", DATABASE_URL: "mysql://invalid:invalid@127.0.0.1:1/isolated_visual_only" },
    stdio: "ignore",
  });
  await waitFor(async () => (await fetch(`http://127.0.0.1:${appPort}/`, { redirect: "manual" })).status === 200, "server");
  chrome = spawn("/usr/bin/chromium", ["--headless=new", "--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage", `--remote-debugging-address=127.0.0.1`, `--remote-debugging-port=${debugPort}`, "--window-size=375,812", "about:blank"], { stdio: "ignore" });
  const pages = await waitFor(async () => {
    const response = await fetch(`http://127.0.0.1:${debugPort}/json/list`);
    const result = await response.json();
    return Array.isArray(result) && result[0]?.webSocketDebuggerUrl ? result : null;
  }, "chromium");
  socket = new WebSocket(pages[0].webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { socket.addEventListener("open", resolve, { once: true }); socket.addEventListener("error", reject, { once: true }); });
  let nextId = 1;
  const calls = new Map();
  socket.addEventListener("message", (event) => {
    const message = JSON.parse(String(event.data));
    const pending = calls.get(message.id);
    if (!pending) return;
    calls.delete(message.id);
    if (message.error) pending.reject(new Error(message.error.message));
    else pending.resolve(message.result);
  });
  const cdp = (method, params = {}) => new Promise((resolve, reject) => {
    const id = nextId++;
    calls.set(id, { resolve, reject });
    socket.send(JSON.stringify({ id, method, params }));
  });
  await cdp("Page.enable");
  await cdp("Emulation.setDeviceMetricsOverride", { width: 375, height: 812, deviceScaleFactor: 1, mobile: true });
  const results = [];
  for (const route of ["/naqla2/review-assistance", "/naqla2/application-assistance"]) {
    await cdp("Page.navigate", { url: `http://127.0.0.1:${appPort}${route}` });
    await sleep(3200);
    const evaluation = await cdp("Runtime.evaluate", {
      expression: `(() => {
        const doc = document.documentElement;
        const main = document.querySelector('main');
        const width = doc.clientWidth;
        const contentWidth = Math.max(doc.scrollWidth, document.body.scrollWidth);
        const text = document.body.innerText;
        return { route: ${JSON.stringify(route)}, width, contentWidth, overflow: contentWidth > width, hasMain: Boolean(main), safeBoundary: /Sign in to access only your authorized application or review workspace|سجّل الدخول للوصول إلى مساحة الطلب أو المراجعة المصرح بها فقط/.test(text) };
      })()`,
      returnByValue: true,
    });
    const result = evaluation.result.value;
    assert.equal(result.overflow, false, `MOBILE_HORIZONTAL_OVERFLOW_${route}`);
    assert.equal(result.hasMain, true, `MOBILE_MAIN_MISSING_${route}`);
    assert.equal(result.safeBoundary, true, `MOBILE_SAFE_AUTH_BOUNDARY_MISSING_${route}`);
    results.push(result);
  }
  console.log(JSON.stringify({ result: "PASS", viewport: "375x812", routes: results, synthetic: true, productionDataAccessed: false, externalProviderCalls: 0 }));
} finally {
  socket?.close();
  if (chrome && !chrome.killed) chrome.kill("SIGTERM");
  if (server && !server.killed) server.kill("SIGTERM");
}
