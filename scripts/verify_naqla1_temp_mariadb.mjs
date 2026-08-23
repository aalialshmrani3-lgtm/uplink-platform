import assert from "node:assert/strict";
import mysql from "mysql2/promise";

const databaseUrl = process.env.NAQLA_TEST_DATABASE_URL;

if (!databaseUrl || !databaseUrl.includes("127.0.0.1:34071") || databaseUrl.includes("DATABASE_URL")) {
  throw new Error("REFUSE_UNISOLATED_DATABASE: NAQLA_TEST_DATABASE_URL must point only to local temporary MariaDB port 34071");
}

process.env.DATABASE_URL = databaseUrl;
process.env.AI_EXTERNAL_PROVIDER_ENABLED = "false";

const { appRouter } = await import("../server/routers.ts");
const { closeDbForTesting } = await import("../server/db.ts");

const syntheticUser = {
  id: 901001,
  openId: "naqla-temp-storage-user",
  name: "NAQLA Temporary Storage Tester",
  email: "naqla-temp-storage@example.invalid",
  role: "user",
};
const foreignUser = {
  ...syntheticUser,
  id: 901002,
  openId: "naqla-temp-storage-foreign",
  email: "naqla-temp-storage-foreign@example.invalid",
};
const contextFor = (user) => ({ req: {}, res: {}, user });
const owner = appRouter.createCaller(contextFor(syntheticUser));
const foreign = appRouter.createCaller(contextFor(foreignUser));

let directConnection;

try {
const record = await owner.naqla1Qualification.createRecord({
  title: "Synthetic storage qualification record",
  problemStatement: "Synthetic test problem statement with enough deterministic detail for qualification.",
  desiredOutcome: "Synthetic test desired outcome with enough deterministic detail for qualification.",
});

const evidence = await owner.naqla1Qualification.addEvidence({
  recordId: record.recordId,
  label: "Synthetic authorized evidence metadata",
  evidenceType: "synthetic_note",
  contentSha256: "a".repeat(64),
});

const version = await owner.naqla1Qualification.createImmutableVersion({ recordId: record.recordId });
assert.equal(version.versionNumber, 1);
assert.match(version.snapshotSha256, /^[a-f0-9]{64}$/);

const beforeRevoke = await owner.naqla1Qualification.assess({ recordId: record.recordId });
assert.equal(beforeRevoke.qualificationStatus, "qualified");

const passportBeforeRevoke = await owner.naqla1Qualification.getPassport({ recordId: record.recordId });
assert.equal(passportBeforeRevoke.passport?.qualificationStatus, "qualified");
assert.equal(passportBeforeRevoke.versions.length, 1);
assert.equal(passportBeforeRevoke.evidence[0]?.authorizationStatus, "authorized");

await assert.rejects(
  () => foreign.naqla1Qualification.getPassport({ recordId: record.recordId }),
  (error) => error?.code === "NOT_FOUND",
);

await owner.naqla1Qualification.revokeEvidence({ evidenceId: evidence.evidenceId });
const afterRevoke = await owner.naqla1Qualification.assess({ recordId: record.recordId });
assert.notEqual(afterRevoke.qualificationStatus, "qualified");
assert.ok(afterRevoke.gaps.includes("missing_authorized_evidence"));

const passportAfterRevoke = await owner.naqla1Qualification.getPassport({ recordId: record.recordId });
assert.equal(passportAfterRevoke.evidence[0]?.authorizationStatus, "revoked");
assert.ok(passportAfterRevoke.gaps.some((gap) => gap.code === "missing_authorized_evidence"));
assert.ok(passportAfterRevoke.passport?.nextBestAction);

directConnection = await mysql.createConnection(databaseUrl);
const [rows] = await directConnection.query(
  "SELECT (SELECT COUNT(*) FROM naqla1_innovation_records) AS recordsCount, (SELECT COUNT(*) FROM naqla1_evidence) AS evidenceCount, (SELECT COUNT(*) FROM naqla1_immutable_versions) AS versionsCount, (SELECT COUNT(*) FROM naqla1_deterministic_assessments) AS assessmentsCount, (SELECT COUNT(*) FROM naqla1_passports) AS passportsCount",
);

const counts = rows[0];
assert.equal(Number(counts.recordsCount), 1);
assert.equal(Number(counts.evidenceCount), 1);
assert.equal(Number(counts.versionsCount), 1);
assert.equal(Number(counts.assessmentsCount), 2);
assert.equal(Number(counts.passportsCount), 1);

console.log(JSON.stringify({
  result: "PASS",
  database: "temporary-local-mariadb",
  recordId: record.recordId,
  qualificationBeforeRevoke: beforeRevoke.qualificationStatus,
  qualificationAfterRevoke: afterRevoke.qualificationStatus,
  nextBestActionAfterRevoke: passportAfterRevoke.passport?.nextBestAction,
  persistedCounts: counts,
  externalProviderCalls: 0,
}, null, 2));
process.exitCode = 0;
} finally {
  await directConnection?.end();
  await closeDbForTesting();
}
