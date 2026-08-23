import assert from "node:assert/strict";
import mysql from "mysql2/promise";

const testDatabaseUrl = process.env.NAQLA_TEST_DATABASE_URL;
if (!testDatabaseUrl) throw new Error("REFUSE_UNISOLATED_DATABASE: missing NAQLA_TEST_DATABASE_URL");
const parsed = new URL(testDatabaseUrl);
if (parsed.protocol !== "mysql:" || parsed.hostname !== "127.0.0.1" || !/^\d{4,5}$/.test(parsed.port) || !/^\/naqla_phase22c_test_[a-z0-9]+$/.test(parsed.pathname)) {
  throw new Error("REFUSE_UNISOLATED_DATABASE: expected random 127.0.0.1 NAQLA test database");
}

process.env.NODE_ENV = "test";
process.env.DATABASE_URL = testDatabaseUrl;
process.env.AI_EXTERNAL_PROVIDER_ENABLED = "false";
if (process.env.AI_EXTERNAL_PROVIDER_ENABLED !== "false") throw new Error("EXTERNAL_PROVIDER_GATE_MUST_BE_FALSE");

const ids = { requester: 777001, owner: 777002, foreign: 777003, requesterOrg: 881001, ownerOrg: 881002, foreignOrg: 881003 };
type Envelope = { result?: { data?: { json?: unknown } }; error?: { json?: { message?: string; data?: { code?: string } } } };
const success = <T>(body: Envelope) => {
  assert.ok(body.result?.data, "Expected tRPC success envelope");
  return body.result.data.json as T;
};

let connection: mysql.Connection | undefined;
let server: import("node:http").Server | undefined;
const evidence: Record<string, unknown> = { synthetic: true, transport: "express-trpc-http", database: "isolated-mariadb", externalProviderCalls: 0 };

try {
  connection = await mysql.createConnection(testDatabaseUrl);
  const at = "2026-08-23 00:00:00";
  await connection.query("INSERT INTO users (id, openId, name, email, role, createdAt, updatedAt, lastSignedIn) VALUES ?", [[
    [ids.requester, "naqla2c-requester", "Synthetic Requester", "naqla2c-requester@example.invalid", "user", at, at, at],
    [ids.owner, "naqla2c-owner", "Synthetic Owner", "naqla2c-owner@example.invalid", "user", at, at, at],
    [ids.foreign, "naqla2c-foreign", "Synthetic Foreign", "naqla2c-foreign@example.invalid", "user", at, at, at],
  ]]);
  await connection.query("INSERT INTO organizations (id, nameAr, nameEn, type, scope, createdAt, updatedAt) VALUES ?", [[
    [ids.requesterOrg, "مؤسسة طالب تركيبية", "Synthetic Requester Organization", "private", "local", at, at],
    [ids.ownerOrg, "مؤسسة مالك تركيبية", "Synthetic Owner Organization", "private", "local", at, at],
    [ids.foreignOrg, "مؤسسة أجنبية تركيبية", "Synthetic Foreign Organization", "private", "local", at, at],
  ]]);
  await connection.query("INSERT INTO organization_memberships (organizationId, userId, role, status, createdAt, updatedAt) VALUES ?", [[
    [ids.requesterOrg, ids.requester, "member", "active", at, at], [ids.ownerOrg, ids.owner, "owner", "active", at, at], [ids.foreignOrg, ids.foreign, "member", "active", at, at],
  ]]);
  await connection.query("INSERT INTO user_active_contexts (userId, organizationId, updatedAt) VALUES ?", [[[ids.requester, ids.requesterOrg, at], [ids.owner, ids.ownerOrg, at], [ids.foreign, ids.foreignOrg, at]]]);
  await connection.query("INSERT INTO challenges (id, organizerId, title, description, type, status, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [990001, ids.requester, "Synthetic energy efficiency challenge", "Synthetic-only challenge anchoring the matching journey.", "challenge", "open", at, at]);
  await connection.query("INSERT INTO ip_registrations (id, userId, type, title, description, status, createdAt, updatedAt) VALUES ?", [[
    [991001, ids.owner, "patent", "Synthetic energy optimisation asset", "Synthetic asset backing teaser discovery.", "approved", at, at],
    [991002, ids.requester, "patent", "Synthetic self-owned asset", "Excluded by self-owned hard filter.", "approved", at, at],
    [991003, ids.owner, "patent", "Synthetic draft asset", "Excluded by publication hard filter.", "approved", at, at],
    [991004, ids.owner, "patent", "Synthetic restricted asset", "Excluded by disclosure hard filter.", "approved", at, at],
  ]]);
  await connection.query("INSERT INTO naqla2_marketplace_listings (id, ipRegistrationId, ownerUserId, title, summary, disclosureScope, status, createdAt, updatedAt) VALUES ?", [[
    [992001, 991001, ids.owner, "Synthetic energy optimisation platform", "Synthetic teaser for energy optimisation and efficient pilot delivery.", "teaser_only", "published", at, at],
    [992002, 991002, ids.requester, "Synthetic self-owned energy platform", "Synthetic teaser that must be excluded because requester owns it.", "teaser_only", "published", at, at],
    [992003, 991003, ids.owner, "Synthetic unpublished energy platform", "Synthetic teaser that must be excluded because it is draft.", "teaser_only", "draft", at, at],
    [992004, 991004, ids.owner, "Synthetic restricted energy platform", "Synthetic disclosure that must be excluded because it is not teaser-only.", "authorized_disclosure", "published", at, at],
  ]]);

  const [userColumns] = await connection.query<mysql.RowDataPacket[]>("SHOW COLUMNS FROM users");
  const expectedUserColumns = ["id", "openId", "name", "email", "loginMethod", "role", "entity_type", "commercial_registration", "license_number", "tax_number", "entity_country", "entity_city", "entity_address", "entity_phone", "entity_email", "authorized_person_name", "authorized_person_position", "entity_documents", "createdAt", "updatedAt", "lastSignedIn", "phone", "avatar", "organizationName", "organizationType", "country", "city", "bio", "website", "linkedIn", "isVerified", "verificationDate", "eliteMembership", "membershipExpiry", "remember_me", "mfa_enabled", "mfa_secret"];
  const existingUserColumns = new Set(userColumns.map(column => String(column.Field)));
  const missingUserColumns = expectedUserColumns.filter(column => !existingUserColumns.has(column));
  if (missingUserColumns.length) throw new Error(`USERS_SCHEMA_MISSING_${missingUserColumns.join(",")}`);

  const { getDb } = await import("../server/db.ts");
  const { users } = await import("../drizzle/schema.ts");
  const { matchingRequests } = await import("../drizzle/schema.ts");
  const { eq } = await import("drizzle-orm");
  try {
    const database = await getDb();
    assert.ok(database, "Expected isolated Drizzle database");
    await database.select().from(users).where(eq(users.id, ids.requester)).limit(1);
    await database.select().from(matchingRequests).limit(1);
    await database.insert(matchingRequests).values({
      userId: ids.foreign,
      userType: "innovator",
      title: "Synthetic contract probe",
      description: "Synthetic-only Drizzle matching request contract probe.",
      lookingFor: "business_partner",
      industry: ["energy"],
      stage: ["pilot"],
      location: [],
      preferredAttributes: [],
      status: "active",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown";
    const causeMessage = error && typeof error === "object" && "cause" in error && error.cause instanceof Error ? error.cause.message : "";
    const detail = `${message}\n${causeMessage}`;
    const knownSchemaDetail = detail.match(/(?:Unknown column|Table) [^\n]+/i)?.[0] ?? `${error instanceof Error ? error.name : "UnknownError"}_${detail.replace(/mysql:\/\/[^\s]+/gi, "[redacted]").slice(0, 500)}`;
    throw new Error(`DRIZZLE_USERS_CONTRACT_FAILURE_${knownSchemaDetail}`);
  }

  const { createApp } = await import("../server/_core/index.ts");
  const composed = await createApp({ serveFrontend: false });
  server = composed.server;
  await new Promise<void>(resolve => server!.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  assert.ok(address && typeof address !== "string", "Expected random HTTP listener");
  const baseUrl = `http://127.0.0.1:${address.port}`;
  const trpc = async (kind: "query" | "mutation", procedure: string, input: unknown, userId?: number) => {
    const headers: Record<string, string> = userId ? { "x-naqla-test-user-id": String(userId) } : {};
    const inputJson = JSON.stringify({ json: input });
    const response = kind === "query"
      ? await fetch(`${baseUrl}/api/trpc/${procedure}?input=${encodeURIComponent(inputJson)}`, { headers })
      : await fetch(`${baseUrl}/api/trpc/${procedure}`, { method: "POST", headers: { "content-type": "application/json", ...headers }, body: inputJson });
    return { response, body: await response.json() as Envelope };
  };

  const auth = await trpc("query", "auth.me", null, ids.requester);
  if (auth.response.status !== 200) throw new Error(`AUTH_HTTP_FAILURE_${auth.response.status}_${auth.body.error?.json?.data?.code ?? "UNKNOWN"}`);
  assert.equal(success<{ id: number }>(auth.body).id, ids.requester);
  const unauthenticated = await trpc("mutation", "naqla2.matching.request", { seekingType: "partner", requirements: "Synthetic unauthenticated request must not persist." });
  assert.equal(unauthenticated.response.status, 401);
  assert.equal(unauthenticated.body.error?.json?.data?.code, "UNAUTHORIZED");
  const discovery = await trpc("query", "naqla2.discovery.getOpportunityTeasers", null);
  const teasers = success<Array<{ id: number }>>(discovery.body);
  assert.ok(teasers.some(item => item.id === 992001));
  assert.ok(!teasers.some(item => item.id === 992004));

  const matchRequest = await trpc("mutation", "naqla2.matching.request", { seekingType: "partner", industry: "energy", stage: "pilot", requirements: "Synthetic energy optimisation efficiency pilot challenge response.", preferences: "synthetic governed delivery" }, ids.requester);
  if (!matchRequest.body.result) {
    const safeMessage = (matchRequest.body.error?.json?.message ?? "unknown").replace(/mysql:\/\/[^\s]+/gi, "[redacted]").slice(0, 180);
    throw new Error(`MATCHING_REQUEST_HTTP_FAILURE_${matchRequest.response.status}_${matchRequest.body.error?.json?.data?.code ?? "UNKNOWN"}_${safeMessage}`);
  }
  const firstRequest = success<{ requestId: number }>(matchRequest.body);
  const firstRun = await trpc("mutation", "naqla2.deterministicMatching.createRun", { requestId: firstRequest.requestId, idempotencyKey: "naqla2c-replay-0001" }, ids.requester);
  const firstRunData = success<{ runId: number; candidateCount: number; exclusionCount: number; reused: boolean; ruleVersion: string; weightVersion: string }>(firstRun.body);
  assert.deepEqual({ candidateCount: firstRunData.candidateCount, exclusionCount: firstRunData.exclusionCount, reused: firstRunData.reused }, { candidateCount: 1, exclusionCount: 3, reused: false });
  assert.equal(firstRunData.ruleVersion, "naqla2-deterministic-v2");
  assert.equal(firstRunData.weightVersion, "term-overlap-100-v1");
  const replay = await trpc("mutation", "naqla2.deterministicMatching.createRun", { requestId: firstRequest.requestId, idempotencyKey: "naqla2c-replay-0001" }, ids.requester);
  const replayData = success<{ runId: number; reused: boolean }>(replay.body);
  assert.equal(replayData.runId, firstRunData.runId);
  assert.equal(replayData.reused, true);

  const runDetail = await trpc("query", "naqla2.deterministicMatching.getRun", { runId: firstRunData.runId }, ids.requester);
  const detail = success<{ candidates: Array<{ id: number; listingId: number; rankBand: string; evidenceConfidence: string; factors: Array<{ factorId: string }> }>; exclusions: Array<{ reasonCode: string }> }>(runDetail.body);
  assert.equal(detail.candidates.length, 1);
  assert.equal(detail.candidates[0]?.listingId, 992001);
  assert.equal(detail.candidates[0]?.evidenceConfidence, "teaser_only");
  assert.ok(["high", "medium", "low"].includes(detail.candidates[0]?.rankBand ?? ""));
  assert.ok(detail.candidates[0]?.factors.some(item => item.factorId === "result_explanation"));
  assert.deepEqual(new Set(detail.exclusions.map(item => item.reasonCode)), new Set(["self_owned", "not_published", "disclosure_not_teaser"]));
  const foreignRead = await trpc("query", "naqla2.deterministicMatching.getRun", { runId: firstRunData.runId }, ids.foreign);
  assert.equal(foreignRead.response.status, 404);
  assert.equal(foreignRead.body.error?.json?.data?.code, "NOT_FOUND");
  const immutableEndpoint = await trpc("mutation", "naqla2.deterministicMatching.updateRun", { runId: firstRunData.runId }, ids.requester);
  assert.equal(immutableEndpoint.response.status, 404);

  const secondRequestCall = await trpc("mutation", "naqla2.matching.request", { seekingType: "partner", industry: "energy", requirements: "Synthetic secondary energy efficiency pilot request." }, ids.requester);
  const secondRequest = success<{ requestId: number }>(secondRequestCall.body);
  const secondRun = await trpc("mutation", "naqla2.deterministicMatching.createRun", { requestId: secondRequest.requestId, idempotencyKey: "naqla2c-replay-0002" }, ids.requester);
  const secondRunData = success<{ runId: number }>(secondRun.body);
  await connection.query("UPDATE naqla2_match_runs SET created_at = CASE id WHEN ? THEN '2026-08-23 00:00:01' WHEN ? THEN '2026-08-23 00:00:02' END WHERE id IN (?, ?)", [firstRunData.runId, secondRunData.runId, firstRunData.runId, secondRunData.runId]);
  const newest = await trpc("query", "naqla2.deterministicMatching.listRuns", { page: 1, limit: 1, sort: "newest" }, ids.requester);
  assert.equal(success<{ items: Array<{ id: number }>; hasNextPage: boolean }>(newest.body).items[0]?.id, secondRunData.runId);
  assert.equal(success<{ hasNextPage: boolean }>(newest.body).hasNextPage, true);
  const oldest = await trpc("query", "naqla2.deterministicMatching.listRuns", { page: 1, limit: 1, sort: "oldest" }, ids.requester);
  assert.equal(success<{ items: Array<{ id: number }> }>(oldest.body).items[0]?.id, firstRunData.runId);
  const filtered = await trpc("query", "naqla2.deterministicMatching.listRuns", { page: 1, limit: 20, sort: "newest", requestId: firstRequest.requestId, createdAfter: "2026-08-22T00:00:00.000Z", createdBefore: "2026-08-24T00:00:00.000Z" }, ids.requester);
  if (!filtered.body.result) throw new Error(`LIST_RUNS_FILTER_HTTP_FAILURE_${filtered.response.status}_${filtered.body.error?.json?.data?.code ?? "UNKNOWN"}`);
  assert.deepEqual(success<{ items: Array<{ id: number }> }>(filtered.body).items.map(item => item.id), [firstRunData.runId]);

  const interest = await trpc("mutation", "naqla2.marketplace.requestPurchase", { listingId: 992001, message: "Synthetic interest for a governed energy pilot assessment." }, ids.requester);
  const interestData = success<{ interestId: number; status: string }>(interest.body);
  assert.equal(interestData.status, "submitted");
  const acceptance = await trpc("mutation", "naqla2.engagements.setInterestStatus", { interestRequestId: interestData.interestId, status: "accepted" }, ids.owner);
  assert.equal(success<{ status: string }>(acceptance.body).status, "accepted");
  const engagement = await trpc("mutation", "naqla2.engagements.establish", { interestRequestId: interestData.interestId }, ids.owner);
  if (!engagement.body.result) throw new Error(`ENGAGEMENT_HTTP_FAILURE_${engagement.response.status}_${engagement.body.error?.json?.data?.code ?? "UNKNOWN"}`);
  const engagementData = success<{ engagementId: number; status: string }>(engagement.body);
  assert.equal(engagementData.status, "established");
  const pilot = await trpc("mutation", "naqla2.engagements.createPilot", { engagementId: engagementData.engagementId, scope: "Synthetic governed pilot scope for energy optimisation validation only." }, ids.requester);
  assert.equal(success<{ status: string }>(pilot.body).status, "planned");

  const [persisted] = await connection.query<mysql.RowDataPacket[]>("SELECT active_context_id, rule_version, weight_version, input_fingerprint, completed_at FROM naqla2_match_runs WHERE id = ?", [firstRunData.runId]);
  assert.equal(persisted[0]?.active_context_id, ids.requesterOrg);
  assert.equal(persisted[0]?.rule_version, "naqla2-deterministic-v2");
  assert.equal(persisted[0]?.weight_version, "term-overlap-100-v1");
  assert.ok(persisted[0]?.input_fingerprint && persisted[0]?.completed_at);
  const [counts] = await connection.query<mysql.RowDataPacket[]>("SELECT (SELECT COUNT(*) FROM naqla2_match_candidates WHERE match_run_id = ?) AS candidates, (SELECT COUNT(*) FROM naqla2_match_exclusions WHERE match_run_id = ?) AS exclusions", [firstRunData.runId, firstRunData.runId]);
  assert.deepEqual({ candidates: Number(counts[0]?.candidates), exclusions: Number(counts[0]?.exclusions) }, { candidates: 1, exclusions: 3 });
  await connection.query("UPDATE naqla2_marketplace_listings SET status = 'withdrawn' WHERE id = 992001");
  const stale = await trpc("query", "naqla2.deterministicMatching.getRun", { runId: firstRunData.runId }, ids.requester);
  const staleCandidate = success<{ candidates: Array<{ title: string | null; summary: string | null; availability?: string }> }>(stale.body).candidates[0];
  assert.deepEqual(staleCandidate && { title: staleCandidate.title, summary: staleCandidate.summary, availability: staleCandidate.availability }, { title: null, summary: null, availability: "stale_or_revoked" });
  await connection.query("UPDATE organization_memberships SET status = 'revoked' WHERE organizationId = ? AND userId = ?", [ids.requesterOrg, ids.requester]);
  const revoked = await trpc("query", "naqla2.deterministicMatching.listRuns", { page: 1, limit: 20, sort: "newest" }, ids.requester);
  assert.equal(revoked.response.status, 403);
  assert.equal(revoked.body.error?.json?.data?.code, "FORBIDDEN");
  Object.assign(evidence, { authenticatedHttp: true, unauthenticatedProtectedStatus: 401, crossTenantStatus: 404, idempotentReplay: true, immutableHttpSurface: true, exclusions: ["self_owned", "not_published", "disclosure_not_teaser"], staleMasked: true, revokedContextDenied: true, listRuns: { pagination: true, filtering: true, sorting: true }, journey: "challenge_fixture→discovery→matching_request→match_run→interest→engagement→pilot" });
} finally {
  await new Promise<void>(resolve => server?.close(() => resolve()) ?? resolve());
  await connection?.end();
  const { closeDbForTesting } = await import("../server/db.ts");
  await closeDbForTesting();
}

console.log(JSON.stringify({ result: "PASS", ...evidence }, null, 2));
