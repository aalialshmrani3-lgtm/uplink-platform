import { createServer } from "node:net";
import { mkdir, mkdtemp, readFile, readdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { randomBytes } from "node:crypto";
import { spawn, spawnSync } from "node:child_process";
import mysql from "mysql2/promise";

const projectRoot = path.resolve(import.meta.dirname, "..");
const tempBase = await mkdtemp(path.join(tmpdir(), "naqla2c-mariadb-"));
const dataDir = path.join(tempBase, "data");
const socketPath = path.join(tempBase, "mariadb.sock");
const pidPath = path.join(tempBase, "mariadb.pid");
const logPath = path.join(tempBase, "mariadb.log");
const dbName = `naqla_phase22c_test_${randomBytes(5).toString("hex")}`;
const testUser = "naqla2c";
const testPassword = randomBytes(18).toString("hex");
let mariadb;

function freePort() {
  return new Promise((resolve, reject) => {
    const probe = createServer();
    probe.once("error", reject);
    probe.listen(0, "127.0.0.1", () => {
      const address = probe.address();
      const port = typeof address === "object" && address ? address.port : undefined;
      probe.close(error => error ? reject(error) : resolve(port));
    });
  });
}

const wait = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));

async function waitForDatabase(port) {
  let lastError;
  for (let attempt = 0; attempt < 80; attempt += 1) {
    try {
      const root = await mysql.createConnection({ host: "127.0.0.1", port, user: "root", password: "" });
      await root.query("SELECT 1");
      await root.end();
      return;
    } catch (error) {
      lastError = error;
      await wait(125);
    }
  }
  const logExcerpt = await readFile(logPath, "utf8").then(content => content.split("\n").slice(-12).join("\n")).catch(() => "log_unavailable");
  throw new Error(`TEMP_MARIADB_NOT_READY: ${lastError instanceof Error ? lastError.message : "unknown"}; ${logExcerpt}`);
}

async function migrate(port) {
  const migrationNames = (await readdir(path.join(projectRoot, "drizzle"))).filter(name => /^\d{4}_.+\.sql$/.test(name)).sort();
  const root = await mysql.createConnection({ host: "127.0.0.1", port, user: "root", password: "", multipleStatements: true });
  try {
    await root.query(`CREATE DATABASE \`${dbName}\``);
    await root.query(`CREATE USER '${testUser}'@'127.0.0.1' IDENTIFIED BY '${testPassword}'`);
    await root.query(`GRANT ALL PRIVILEGES ON \`${dbName}\`.* TO '${testUser}'@'127.0.0.1'`);
    await root.query("FLUSH PRIVILEGES");
    await root.changeUser({ database: dbName });
    for (const migrationName of migrationNames) {
      const sql = (await readFile(path.join(projectRoot, "drizzle", migrationName), "utf8")).replaceAll("--> statement-breakpoint", "");
      if (sql.trim()) await root.query(sql);
    }
  } finally {
    await root.end();
  }
}

const port = await freePort();
try {
  await mkdir(dataDir, { recursive: true });
  const initialized = spawnSync("/usr/bin/mariadb-install-db", [`--datadir=${dataDir}`, "--auth-root-authentication-method=normal", "--skip-test-db", "--user=ubuntu"], { stdio: "ignore" });
  if (initialized.status !== 0) throw new Error("TEMP_MARIADB_INITIALIZATION_FAILED");
  mariadb = spawn("/usr/sbin/mariadbd", [`--datadir=${dataDir}`, `--socket=${socketPath}`, `--pid-file=${pidPath}`, `--log-error=${logPath}`, `--port=${port}`, "--bind-address=127.0.0.1", "--skip-name-resolve", "--user=ubuntu"], { stdio: "ignore" });
  mariadb.once("error", error => { throw error; });
  await waitForDatabase(port);
  await migrate(port);
  const databaseUrl = `mysql://${testUser}:${testPassword}@127.0.0.1:${port}/${dbName}`;
  const runner = spawn("pnpm", ["tsx", "scripts/phase22c_http_harness.ts"], {
    cwd: projectRoot,
    env: { ...process.env, NODE_ENV: "test", AI_EXTERNAL_PROVIDER_ENABLED: "false", DATABASE_URL: databaseUrl, NAQLA_TEST_DATABASE_URL: databaseUrl },
    stdio: "inherit",
  });
  const exitCode = await new Promise(resolve => runner.once("exit", code => resolve(code ?? 1)));
  if (exitCode !== 0) throw new Error("PHASE22C_HTTP_HARNESS_FAILED");
} finally {
  if (mariadb && !mariadb.killed) {
    mariadb.kill("SIGTERM");
    await Promise.race([new Promise(resolve => mariadb.once("exit", resolve)), wait(5_000)]);
    if (mariadb.exitCode === null) mariadb.kill("SIGKILL");
  }
  await rm(tempBase, { recursive: true, force: true });
}

console.log(JSON.stringify({ cleanup: "PASS", synthetic: true, externalProviderCalls: 0 }));
