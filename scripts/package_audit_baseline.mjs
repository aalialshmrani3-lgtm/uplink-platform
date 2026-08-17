import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";

const auditRoot = "/home/ubuntu/naqla_audit_baseline";
const files = [];

function walk(directory) {
  for (const name of readdirSync(directory)) {
    if (name === "NAQLA_FULL_AUDIT_PACKAGE.zip") continue;
    const path = join(directory, name);
    const stats = statSync(path);
    if (stats.isDirectory()) walk(path);
    else files.push(path);
  }
}

walk(auditRoot);
const sourceSummary = JSON.parse(readFileSync(join(auditRoot, "SOURCE_SCAN_SUMMARY.json"), "utf8"));
const testSummary = JSON.parse(readFileSync(join(auditRoot, "tests", "TEST_SUMMARY.json"), "utf8"));

const manifest = {
  package: "NAQLA_FULL_AUDIT_PACKAGE",
  generatedAt: new Date().toISOString(),
  scope: "Baseline read-only audit; no production records, credentials, payments, signatures, or external submissions included.",
  staging: {
    route: "/audit",
    mode: "local static demo and reviewer lens",
    writeOperations: false,
    roles: ["innovator", "company", "investor", "accelerator", "organizer", "admin"],
  },
  sourceScan: sourceSummary,
  browserEvidence: testSummary,
  featureStatus: [
    { feature: "NAQLA 1 idea analysis", status: "implemented_with_observed_gaps", evidence: "docs/KNOWN_GAPS.md" },
    { feature: "NAQLA 1 to 2 matching", status: "partial", evidence: "docs/KNOWN_GAPS.md" },
    { feature: "SAIP application number handling", status: "demo/local", evidence: "docs/KNOWN_GAPS.md" },
    { feature: "NAQLA 2 challenges, events, deal surfaces", status: "implemented_surface_runtime_verify", evidence: "docs/ROUTE_MAP.md and tests/JOURNEY_RESULTS.csv" },
    { feature: "NAQLA 3 marketplace, contracts, escrow surfaces", status: "implemented_surface_runtime_verify", evidence: "docs/ROUTE_MAP.md and tests/JOURNEY_RESULTS.csv" },
  ],
  files: files
    .sort()
    .map((path) => ({
      path: relative(auditRoot, path),
      bytes: statSync(path).size,
      sha256: createHash("sha256").update(readFileSync(path)).digest("hex"),
    })),
};

writeFileSync(join(auditRoot, "AUDIT_MANIFEST.json"), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(JSON.stringify({ files: manifest.files.length, routes: sourceSummary.routes, controls: testSummary.controls_recorded }));
