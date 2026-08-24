import { execFileSync } from "node:child_process";

const classifications = {
  "client/src/_core/hooks/useLanguageOptimized.ts": "client diagnostic; no payload persistence or release-blocking path",
  "client/src/hooks/useWebSocket.ts": "client connection lifecycle; notification payload is not written to server logs",
  "client/src/pages/ComponentShowcase.tsx": "developer showcase route; no production navigation entry",
  "client/src/pages/Naqla2CreateEvent.tsx": "legacy form diagnostic; no server credential or evidence payload log",
  "client/src/pages/Naqla2CreateHackathon.tsx": "legacy form diagnostic; no server credential or evidence payload log",
  "client/src/pages/Naqla2EventDetail.tsx": "legacy detail diagnostic; no server credential or evidence payload log",
  "client/src/pages/Naqla2HackathonDetail.tsx": "legacy detail diagnostic; no server credential or evidence payload log",
  "client/src/pages/Naqla3BlockchainContracts.tsx": "retired NAQLA3 page; no active Route after RC cleanup",
  "client/src/pages/RoleManagement.tsx": "administrator UI diagnostic; no active commerce payload log",
  "server/_core/index.ts": "server lifecycle startup telemetry",
  "server/_core/sdk.ts": "OAuth lifecycle telemetry; URL only",
  "server/_core/voiceTranscription.ts": "documentation examples only",
  "server/redis.ts": "Redis connection lifecycle telemetry",
  "server/routers.ts": "bounded administrative process lifecycle; raw child output removed",
  "server/webhook_service.ts": "bounded delivery lifecycle; raw remote errors removed",
  "server/websocket.ts": "bounded connection lifecycle; user IDs and payload logs removed",
  "server/seed_rbac.ts": "operator-invoked development seed",
  "server/seed_saudi_organizations.ts": "operator-invoked development seed",
};

const raw = execFileSync("git", ["-c", "color.ui=false", "grep", "-lE", "console\\.(log|debug|trace)", "--", "client", "server", "scripts", ":!**/*.test.*"], { encoding: "utf8" });
const files = raw.trim().split("\n").filter(Boolean);
const unclassified = [];
const rows = files.map((file) => {
  const classification = classifications[file] ?? (file.startsWith("scripts/") ? "test/build/deployment tooling outside production runtime" : undefined);
  if (!classification) unclassified.push(file);
  return { file, classification: classification ?? "UNCLASSIFIED" };
});

if (unclassified.length) {
  console.error(JSON.stringify({ result: "FAIL", unclassified }, null, 2));
  process.exitCode = 1;
} else {
  console.log(JSON.stringify({ result: "PASS", files: rows, count: rows.length }, null, 2));
}
