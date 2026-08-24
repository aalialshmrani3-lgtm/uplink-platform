import { createServer } from "node:net";
import { mkdir, mkdtemp, readFile, readdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { randomBytes } from "node:crypto";
import { spawn, spawnSync } from "node:child_process";
import mysql from "mysql2/promise";

const root = path.resolve(import.meta.dirname, "..");
const base = await mkdtemp(path.join(tmpdir(), "naqla-final-rc-mariadb-"));
const data = path.join(base, "data"), socket = path.join(base, "db.sock"), pid = path.join(base, "db.pid"), log = path.join(base, "db.log");
const name = `naqla_final_rc_test_${randomBytes(5).toString("hex")}`, user = "naqla_final_rc", password = randomBytes(18).toString("hex");
let daemon;
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
const port = await new Promise((resolve, reject) => { const probe = createServer(); probe.once("error", reject); probe.listen(0, "127.0.0.1", () => { const address = probe.address(); probe.close(error => error ? reject(error) : resolve(address.port)); }); });
async function ready() { for (let attempt = 0; attempt < 80; attempt++) { try { const connection = await mysql.createConnection({ host: "127.0.0.1", port, user: "root" }); await connection.end(); return; } catch { await wait(125); } } throw new Error(await readFile(log, "utf8").catch(() => "TEMP_MARIADB_NOT_READY")); }
async function migrate() { const connection = await mysql.createConnection({ host: "127.0.0.1", port, user: "root", multipleStatements: true }); try { await connection.query(`CREATE DATABASE \`${name}\``); await connection.query(`CREATE USER '${user}'@'127.0.0.1' IDENTIFIED BY '${password}'`); await connection.query(`GRANT ALL PRIVILEGES ON \`${name}\`.* TO '${user}'@'127.0.0.1'`); await connection.changeUser({ database: name }); for (const file of (await readdir(path.join(root, "drizzle"))).filter(file => /^\d{4}_.+\.sql$/.test(file)).sort()) { const sql = (await readFile(path.join(root, "drizzle", file), "utf8")).replaceAll("--> statement-breakpoint", ""); if (sql.trim()) await connection.query(sql); } } finally { await connection.end(); } }
try { await mkdir(data, { recursive: true }); if (spawnSync("/usr/bin/mariadb-install-db", [`--datadir=${data}`, "--auth-root-authentication-method=normal", "--skip-test-db", "--user=ubuntu"], { stdio: "ignore" }).status !== 0) throw new Error("TEMP_MARIADB_INITIALIZATION_FAILED"); daemon = spawn("/usr/sbin/mariadbd", [`--datadir=${data}`, `--socket=${socket}`, `--pid-file=${pid}`, `--log-error=${log}`, `--port=${port}`, "--bind-address=127.0.0.1", "--skip-name-resolve", "--user=ubuntu"], { stdio: "ignore" }); await ready(); await migrate(); const databaseUrl = `mysql://${user}:${password}@127.0.0.1:${port}/${name}`; const child = spawn("pnpm", ["tsx", "scripts/final_platform_http_harness.ts"], { cwd: root, env: { ...process.env, NODE_ENV: "test", DATABASE_URL: databaseUrl, NAQLA_TEST_DATABASE_URL: databaseUrl, AI_EXTERNAL_PROVIDER_ENABLED: "false" }, stdio: "inherit" }); const code = await new Promise(resolve => child.once("exit", value => resolve(value ?? 1))); if (code !== 0) throw new Error("FINAL_PLATFORM_HTTP_HARNESS_FAILED"); } finally { if (daemon && !daemon.killed) { daemon.kill("SIGTERM"); await Promise.race([new Promise(resolve => daemon.once("exit", resolve)), wait(5000)]); if (daemon.exitCode === null) daemon.kill("SIGKILL"); } await rm(base, { recursive: true, force: true }); }
console.log(JSON.stringify({ cleanup: "PASS", synthetic: true, externalProviderCalls: 0 }));
