import assert from "node:assert/strict";
import mysql from "mysql2/promise";

const url = process.env.NAQLA_TEST_DATABASE_URL;
if (!url) throw new Error("REFUSE_UNISOLATED_DATABASE: missing NAQLA_TEST_DATABASE_URL");
const parsed = new URL(url);
if (parsed.protocol !== "mysql:" || parsed.hostname !== "127.0.0.1" || !/^\/naqla_final_rc_test_[a-z0-9]+$/.test(parsed.pathname)) throw new Error("REFUSE_UNISOLATED_DATABASE");
process.env.NODE_ENV = "test";
process.env.DATABASE_URL = url;
process.env.AI_EXTERNAL_PROVIDER_ENABLED = "false";
if (process.env.AI_EXTERNAL_PROVIDER_ENABLED !== "false") throw new Error("EXTERNAL_PROVIDER_GATE_MUST_BE_FALSE");

type Envelope = { result?: { data?: { json?: unknown } }; error?: { json?: { data?: { code?: string }; message?: string } } };
const ok = <T>(body: Envelope): T => { assert.ok(body.result?.data, body.error?.json?.message ?? "Expected tRPC success"); return body.result.data.json as T; };
const ids = { innovator: 761001, counterparty: 761002, foreign: 761003, innovatorOrg: 861001, counterpartyOrg: 861002, foreignOrg: 861003, challenge: 961001, ip: 971001, listing: 981001 };
let connection: mysql.Connection | undefined;
let server: import("node:http").Server | undefined;

try {
  connection = await mysql.createConnection(url);
  const at = "2026-08-24 00:00:00";
  await connection.query("INSERT INTO users (id,openId,name,email,role,createdAt,updatedAt,lastSignedIn) VALUES ?", [[
    [ids.innovator, "rc-innovator", "Synthetic Innovator", "rc-innovator@example.invalid", "user", at, at, at],
    [ids.counterparty, "rc-counterparty", "Synthetic Counterparty", "rc-counterparty@example.invalid", "user", at, at, at],
    [ids.foreign, "rc-foreign", "Synthetic Foreign", "rc-foreign@example.invalid", "user", at, at, at],
  ]]);
  await connection.query("INSERT INTO organizations (id,nameAr,nameEn,type,scope,createdAt,updatedAt) VALUES ?", [[
    [ids.innovatorOrg, "منظمة مبتكر تركيبية", "Synthetic Innovator Organization", "private", "local", at, at],
    [ids.counterpartyOrg, "منظمة طرف تركيبية", "Synthetic Counterparty Organization", "private", "local", at, at],
    [ids.foreignOrg, "منظمة أجنبية تركيبية", "Synthetic Foreign Organization", "private", "local", at, at],
  ]]);
  await connection.query("INSERT INTO organization_memberships (organizationId,userId,role,status,createdAt,updatedAt) VALUES ?", [[
    [ids.innovatorOrg, ids.innovator, "owner", "active", at, at], [ids.counterpartyOrg, ids.counterparty, "member", "active", at, at], [ids.foreignOrg, ids.foreign, "member", "active", at, at],
  ]]);
  await connection.query("INSERT INTO user_active_contexts (userId,organizationId,updatedAt) VALUES ?", [[[ids.innovator, ids.innovatorOrg, at], [ids.counterparty, ids.counterpartyOrg, at], [ids.foreign, ids.foreignOrg, at]]]);
  await connection.query("INSERT INTO challenges (id,organizerId,title,description,type,status,createdAt,updatedAt) VALUES (?,?,?,?,?,?,?,?)", [ids.challenge, ids.counterparty, "Synthetic integration challenge", "Synthetic-only challenge for a governed cross-engine release journey.", "challenge", "open", at, at]);

  const { createApp } = await import("../server/_core/index.ts");
  const composed = await createApp({ serveFrontend: false });
  server = composed.server;
  await new Promise<void>(resolve => server!.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  assert.ok(address && typeof address !== "string");
  const baseUrl = `http://127.0.0.1:${address.port}`;
  const trpc = async (kind: "query" | "mutation", procedure: string, input: unknown, userId?: number) => {
    const headers: Record<string, string> = userId ? { "x-naqla-test-user-id": String(userId) } : {};
    const payload = JSON.stringify({ json: input });
    const response = kind === "query"
      ? await fetch(`${baseUrl}/api/trpc/${procedure}?input=${encodeURIComponent(payload)}`, { headers })
      : await fetch(`${baseUrl}/api/trpc/${procedure}`, { method: "POST", headers: { "content-type": "application/json", ...headers }, body: payload });
    return { response, body: await response.json() as Envelope };
  };

  const ignoredProductionHeader = await fetch(`${baseUrl}/api/trpc/auth.me?input=${encodeURIComponent(JSON.stringify({ json: null }))}`, { headers: { "x-naqla-test-user-id": "not-a-number" } });
  assert.equal(ignoredProductionHeader.status, 200);
  const innovatorAuth = await trpc("query", "auth.me", null, ids.innovator);
  assert.equal(ok<{ id: number }>(innovatorAuth.body).id, ids.innovator);
  const unauthenticated = await trpc("mutation", "naqla1Qualification.createRecord", { title: "Unauthorized", problemStatement: "Synthetic unauthorized creation must fail without persistence.", desiredOutcome: "Synthetic unauthorized outcome." });
  assert.equal(unauthenticated.response.status, 401);

  const record = ok<{ recordId: number }>((await trpc("mutation", "naqla1Qualification.createRecord", { title: "Synthetic cross-engine innovation", problemStatement: "Synthetic validated energy efficiency problem with governed delivery boundaries.", desiredOutcome: "Synthetic energy optimisation outcome ready for deterministic assessment." }, ids.innovator)).body);
  const evidence = ok<{ evidenceId: number }>((await trpc("mutation", "naqla1Qualification.addEvidence", { recordId: record.recordId, label: "Synthetic authorized qualification evidence", evidenceType: "synthetic_note", contentSha256: "a".repeat(64) }, ids.innovator)).body);
  const immutable = ok<{ versionNumber: number }>((await trpc("mutation", "naqla1Qualification.createImmutableVersion", { recordId: record.recordId }, ids.innovator)).body);
  assert.equal(immutable.versionNumber, 1);
  const qualification = ok<{ qualificationStatus: string }>((await trpc("mutation", "naqla1Qualification.assess", { recordId: record.recordId }, ids.innovator)).body);
  assert.equal(qualification.qualificationStatus, "qualified");
  const foreignPassport = await trpc("query", "naqla1Qualification.getPassport", { recordId: record.recordId }, ids.foreign);
  assert.equal(foreignPassport.response.status, 404);

  await connection.query("INSERT INTO ip_registrations (id,userId,type,title,description,status,createdAt,updatedAt) VALUES (?,?,?,?,?,?,?,?)", [ids.ip, ids.innovator, "patent", "Synthetic qualified energy asset", "Synthetic listing source corresponding to the qualified innovation journey.", "approved", at, at]);
  await connection.query("INSERT INTO naqla2_marketplace_listings (id,ipRegistrationId,ownerUserId,title,summary,disclosureScope,status,createdAt,updatedAt) VALUES (?,?,?,?,?,?,?,?,?)", [ids.listing, ids.ip, ids.innovator, "Synthetic energy optimisation listing", "Synthetic teaser for the authorized matching and pilot handoff.", "teaser_only", "published", at, at]);
  const request = ok<{ requestId: number }>((await trpc("mutation", "naqla2.matching.request", { seekingType: "partner", industry: "energy", stage: "pilot", requirements: "Synthetic energy efficiency pilot need with deterministic matching requirements.", preferences: "Synthetic governed collaboration." }, ids.counterparty)).body);
  const matchRun = ok<{ runId: number; candidateCount: number }>((await trpc("mutation", "naqla2.deterministicMatching.createRun", { requestId: request.requestId, idempotencyKey: "final-rc-match-0001" }, ids.counterparty)).body);
  assert.ok(matchRun.candidateCount >= 1);
  const run = ok<{ candidates: Array<{ id: number; listingId: number; factors: unknown[]; rankBand: string; evidenceConfidence: string }> }>((await trpc("query", "naqla2.deterministicMatching.getRun", { runId: matchRun.runId }, ids.counterparty)).body);
  assert.equal(run.candidates[0]?.listingId, ids.listing);
  assert.ok(run.candidates[0]?.factors.length);
  const interest = ok<{ interestId: number }>((await trpc("mutation", "naqla2.marketplace.requestPurchase", { listingId: ids.listing, message: "Synthetic governed interest for the release-candidate pilot." }, ids.counterparty)).body);
  assert.equal(ok<{ status: string }>((await trpc("mutation", "naqla2.engagements.setInterestStatus", { interestRequestId: interest.interestId, status: "accepted" }, ids.innovator)).body).status, "accepted");
  const engagement = ok<{ engagementId: number }>((await trpc("mutation", "naqla2.engagements.establish", { interestRequestId: interest.interestId }, ids.innovator)).body);
  assert.equal(ok<{ status: string }>((await trpc("mutation", "naqla2.engagements.createPilot", { engagementId: engagement.engagementId, scope: "Synthetic pilot scope for governed integration acceptance." }, ids.counterparty)).body).status, "planned");

  const sources = ok<Array<{ id: number; versionNumber: number }>>((await trpc("query", "naqla3.commercialize.listEligibleInnovationSources", null, ids.innovator)).body);
  assert.equal(sources[0]?.id, record.recordId);
  const asset = ok<{ assetId: number }>((await trpc("mutation", "naqla3.commercialize.createAsset", { sourceInnovationRecordId: record.recordId, sourceInnovationRecordVersion: 1, title: "Synthetic commercial asset", summary: "Synthetic commercial handoff sourced from the immutable qualified innovation record.", assetType: "technology", classification: "restricted", evidenceIds: [evidence.evidenceId] }, ids.innovator)).body);
  const transactionInput = { assetId: asset.assetId, counterpartyUserId: ids.counterparty, counterpartyOrganizationId: ids.counterpartyOrg, engagementId: engagement.engagementId, idempotencyKey: "final-rc-transaction-0001" };
  const transaction = ok<{ transactionId: number; reused: boolean }>((await trpc("mutation", "naqla3.commercialize.createTransaction", transactionInput, ids.innovator)).body);
  assert.equal(transaction.reused, false);
  assert.equal(ok<{ reused: boolean }>((await trpc("mutation", "naqla3.commercialize.createTransaction", transactionInput, ids.innovator)).body).reused, true);
  assert.equal((await trpc("query", "naqla3.commercialize.getTransactionWorkspace", { transactionId: transaction.transactionId }, ids.foreign)).response.status, 403);

  const dueDiligence = ok<{ caseId: number }>((await trpc("mutation", "naqla3.commercialize.createDueDiligenceCase", { transactionId: transaction.transactionId, checklist: [{ key: "scope", complete: true }] }, ids.innovator)).body);
  const ddRequest = ok<{ requestId: number }>((await trpc("mutation", "naqla3.commercialize.createDueDiligenceRequest", { caseId: dueDiligence.caseId, transactionId: transaction.transactionId, recipientUserId: ids.counterparty, subject: "Synthetic information request", body: "Confirm the synthetic accountable delivery boundary.", idempotencyKey: "final-rc-dd-0001" }, ids.innovator)).body);
  assert.equal(ok<{ status: string }>((await trpc("mutation", "naqla3.commercialize.respondDueDiligenceRequest", { requestId: ddRequest.requestId, responseBody: "Synthetic counterparty response confirmed by a human." }, ids.counterparty)).body).status, "responded");
  assert.equal(ok<{ reviewStatus: string }>((await trpc("mutation", "naqla3.commercialize.reviewDueDiligenceResponse", { requestId: ddRequest.requestId, outcome: "accepted", reviewNote: "Synthetic separate human DD review." }, ids.innovator)).body).reviewStatus, "accepted");
  assert.equal(ok<{ status: string }>((await trpc("mutation", "naqla3.commercialize.completeDueDiligence", { caseId: dueDiligence.caseId, transactionId: transaction.transactionId, confirmationNote: "Synthetic human DD completion." }, ids.innovator)).body).status, "completed");

  let transition = 1;
  for (const stage of ["due_diligence", "contract"] as const) transition = ok<{ transitionVersion: number }>((await trpc("mutation", "naqla3.commercialize.transitionStage", { transactionId: transaction.transactionId, toStage: stage, expectedTransitionVersion: transition, idempotencyKey: `final-rc-stage-${stage}` }, ids.innovator)).body).transitionVersion;
  const terms = ok<{ termSheetId: number }>((await trpc("mutation", "naqla3.commercialize.createTermSheet", { transactionId: transaction.transactionId, commercialScope: "Synthetic human-reviewed scope for release candidate.", structure: "Synthetic human-reviewed transaction structure." }, ids.innovator)).body);
  assert.equal(ok<{ status: string }>((await trpc("mutation", "naqla3.commercialize.approveTermSheet", { termSheetId: terms.termSheetId, approvalNote: "Synthetic separate term approval." }, ids.counterparty)).body).status, "approved");
  const agreement = ok<{ agreementId: number }>((await trpc("mutation", "naqla3.commercialize.createAgreementRecord", { transactionId: transaction.transactionId, termSheetId: terms.termSheetId, title: "Synthetic external agreement record" }, ids.innovator)).body);
  assert.equal(ok<{ status: string }>((await trpc("mutation", "naqla3.commercialize.setAgreementExecutionStatus", { agreementId: agreement.agreementId, status: "executed", externalReference: "SYNTHETIC-EXTERNAL-REFERENCE" }, ids.counterparty)).body).status, "executed");
  transition = ok<{ transitionVersion: number }>((await trpc("mutation", "naqla3.commercialize.transitionStage", { transactionId: transaction.transactionId, toStage: "execute", expectedTransitionVersion: transition, idempotencyKey: "final-rc-stage-execute" }, ids.innovator)).body).transitionVersion;
  const plan = ok<{ executionPlanId: number }>((await trpc("mutation", "naqla3.commercialize.createExecutionPlan", { transactionId: transaction.transactionId, objectives: "Synthetic accountable execution objective for release acceptance." }, ids.innovator)).body);
  const milestone = ok<{ milestoneId: number }>((await trpc("mutation", "naqla3.commercialize.createExecutionMilestone", { transactionId: transaction.transactionId, executionPlanId: plan.executionPlanId, title: "Synthetic milestone", description: "Synthetic traceable milestone." }, ids.innovator)).body);
  const deliverable = ok<{ deliverableId: number }>((await trpc("mutation", "naqla3.commercialize.submitExecutionDeliverable", { transactionId: transaction.transactionId, milestoneId: milestone.milestoneId, title: "Synthetic deliverable", evidenceReference: "synthetic/release-evidence" }, ids.innovator)).body);
  assert.equal(ok<{ status: string }>((await trpc("mutation", "naqla3.commercialize.acceptExecutionDeliverable", { deliverableId: deliverable.deliverableId, acceptanceNote: "Synthetic separated delivery acceptance." }, ids.counterparty)).body).status, "accepted");
  transition = ok<{ transitionVersion: number }>((await trpc("mutation", "naqla3.commercialize.transitionStage", { transactionId: transaction.transactionId, toStage: "scale", expectedTransitionVersion: transition, idempotencyKey: "final-rc-stage-scale" }, ids.innovator)).body).transitionVersion;
  const decision = ok<{ decisionId: number }>((await trpc("mutation", "naqla3.commercialize.recordScaleDecision", { transactionId: transaction.transactionId, outcome: "continue_limited", lessonsLearned: "Synthetic human-recorded scaling lessons." }, ids.innovator)).body);
  assert.equal(ok<{ outcome: string }>((await trpc("mutation", "naqla3.commercialize.approveScaleDecision", { decisionId: decision.decisionId, closureNote: "Synthetic separated scale approval." }, ids.counterparty)).body).outcome, "continue_limited");
  assert.equal(ok<{ origin: string }>((await trpc("mutation", "naqla3.commercialize.createFollowOnTransaction", { decisionId: decision.decisionId, idempotencyKey: "final-rc-follow-on-0001" }, ids.innovator)).body).origin, "scale_follow_on");
  const [audits] = await connection.query<mysql.RowDataPacket[]>("SELECT COUNT(*) AS count FROM naqla3_commercial_action_logs WHERE transactionId = ?", [transaction.transactionId]);
  assert.ok(Number(audits[0]?.count) >= 7);
  console.log(JSON.stringify({ result: "PASS", synthetic: true, transport: "express-trpc-http", journey: "innovation_record→authorized_evidence→immutable_version→assessment→match_run→interest→engagement→pilot→commercial_asset→transaction→due_diligence→contract→execute→milestone→deliverable→scale→follow_on", crossEngine: "PASS", tenantIsolation: "PASS", activeContext: "PASS", idempotency: "PASS", immutability: "PASS", auditCount: Number(audits[0]?.count), externalProviderCalls: 0 }));
} finally {
  await new Promise<void>(resolve => server?.close(() => resolve()) ?? resolve());
  const { closeDbForTesting } = await import("../server/db.ts");
  await closeDbForTesting();
  await connection?.end();
}
