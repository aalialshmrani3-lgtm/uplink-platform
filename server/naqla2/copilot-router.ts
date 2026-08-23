import { createHash } from "node:crypto";
import { TRPCError } from "@trpc/server";
import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "../db";
import { protectedProcedure, router } from "../_core/trpc";
import {
  auditLogs,
  naqla1Evidence,
  naqla2ApplicantClarificationResponses,
  naqla2ApplicantCopilotDrafts,
  naqla2ApplicationEvidenceReferences,
  naqla2ApplicationReviewerAssignments,
  naqla2Applications,
  naqla2ApplicationVersions,
  naqla2CopilotRuns,
  naqla2CopilotSuggestions,
  naqla2ReviewerClarificationRequests,
  organizationMemberships,
  userActiveContexts,
} from "../../drizzle/schema";
import {
  analyzeCopilotGaps,
  COPILOT_POLICY_VERSION,
  COPILOT_SCHEMA_VERSION,
  createCopilotIdempotencyKey,
  createCopilotSourceSnapshotHash,
  redactCopilotText,
  type CopilotMode,
} from "./copilot-deterministic";

type Database = NonNullable<Awaited<ReturnType<typeof getDb>>>;

function nowSql(): string {
  return new Date().toISOString().slice(0, 19).replace("T", " ");
}

function hasAffectedRow(result: unknown): boolean {
  const update = (Array.isArray(result) ? result[0] : result) as { affectedRows?: number; rowsAffected?: number } | undefined;
  return (update?.affectedRows ?? update?.rowsAffected ?? 0) > 0;
}

function parseJsonRecord(value: unknown): Record<string, unknown> {
  if (value && typeof value === "object" && !Array.isArray(value)) return value as Record<string, unknown>;
  if (typeof value !== "string") return {};
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed as Record<string, unknown> : {};
  } catch {
    return {};
  }
}

function snapshotSummary(snapshot: unknown): string {
  const value = parseJsonRecord(snapshot).summary;
  return typeof value === "string" ? value : "";
}

async function requireActiveContext(database: Database, userId: number) {
  const [context] = await database.select({ organizationId: userActiveContexts.organizationId })
    .from(userActiveContexts)
    .where(eq(userActiveContexts.userId, userId))
    .limit(1);
  if (!context) throw new TRPCError({ code: "PRECONDITION_FAILED", message: "An ActiveContext is required" });
  const [membership] = await database.select({ role: organizationMemberships.role })
    .from(organizationMemberships)
    .where(and(
      eq(organizationMemberships.organizationId, context.organizationId),
      eq(organizationMemberships.userId, userId),
      eq(organizationMemberships.status, "active"),
    ))
    .limit(1);
  if (!membership) throw new TRPCError({ code: "FORBIDDEN", message: "The ActiveContext membership is not active" });
  return { organizationId: context.organizationId, role: membership.role };
}

async function resolveApplicantApplication(database: Database, userId: number, tenantId: number, applicationId: number) {
  const [application] = await database.select().from(naqla2Applications)
    .where(and(
      eq(naqla2Applications.id, applicationId),
      eq(naqla2Applications.applicantUserId, userId),
      eq(naqla2Applications.tenantId, tenantId),
    ))
    .limit(1);
  if (!application) throw new TRPCError({ code: "FORBIDDEN", message: "Application access is not authorized" });
  return application;
}

async function resolveReviewerApplication(database: Database, userId: number, tenantId: number, applicationId: number) {
  const [assignment] = await database.select({ applicationId: naqla2ApplicationReviewerAssignments.applicationId })
    .from(naqla2ApplicationReviewerAssignments)
    .innerJoin(naqla2Applications, eq(naqla2ApplicationReviewerAssignments.applicationId, naqla2Applications.id))
    .where(and(
      eq(naqla2ApplicationReviewerAssignments.applicationId, applicationId),
      eq(naqla2ApplicationReviewerAssignments.reviewerUserId, userId),
      eq(naqla2ApplicationReviewerAssignments.organizationId, tenantId),
      eq(naqla2ApplicationReviewerAssignments.status, "active"),
      eq(naqla2Applications.reviewerTenantId, tenantId),
    ))
    .limit(1);
  if (!assignment) throw new TRPCError({ code: "FORBIDDEN", message: "Reviewer assignment access is not authorized" });
  return assignment;
}

async function resolveVersion(database: Database, applicationId: number, applicationVersionId: number) {
  const [version] = await database.select().from(naqla2ApplicationVersions)
    .where(and(eq(naqla2ApplicationVersions.id, applicationVersionId), eq(naqla2ApplicationVersions.applicationId, applicationId)))
    .limit(1);
  if (!version) throw new TRPCError({ code: "NOT_FOUND", message: "ApplicationVersion was not found" });
  return version;
}

async function authorizedEvidenceForVersion(database: Database, applicationVersionId: number, applicantUserId: number, reviewerMode: boolean) {
  const rows = await database.select({
    evidenceId: naqla2ApplicationEvidenceReferences.evidenceId,
    applicantUserId: naqla2ApplicationEvidenceReferences.applicantUserId,
    allowReviewer: naqla2ApplicationEvidenceReferences.allowReviewer,
    label: naqla1Evidence.label,
    evidenceOwnerUserId: naqla1Evidence.ownerUserId,
    authorizationStatus: naqla1Evidence.authorizationStatus,
  })
    .from(naqla2ApplicationEvidenceReferences)
    .innerJoin(naqla1Evidence, eq(naqla2ApplicationEvidenceReferences.evidenceId, naqla1Evidence.id))
    .where(eq(naqla2ApplicationEvidenceReferences.applicationVersionId, applicationVersionId));

  return rows
    .filter((row) => row.applicantUserId === applicantUserId && row.evidenceOwnerUserId === applicantUserId && (!reviewerMode || row.allowReviewer === 1))
    .map((row) => ({
      evidenceId: row.evidenceId,
      label: redactCopilotText(row.label),
      authorizationStatus: row.authorizationStatus,
      allowReviewer: row.allowReviewer === 1,
    }));
}

async function logAudit(database: Database, userId: number, action: string, resource: string, resourceId: number, details: Record<string, unknown>) {
  await database.insert(auditLogs).values({ userId, action, resource, resourceId: String(resourceId), details, status: "success" });
}

async function authorizeMode(database: Database, input: { userId: number; applicationId: number; applicationVersionId: number; mode: CopilotMode }) {
  const context = await requireActiveContext(database, input.userId);
  const reviewerMode = input.mode === "reviewer_assist";
  if (reviewerMode) {
    if (!['reviewer', 'manager', 'owner'].includes(context.role)) throw new TRPCError({ code: "FORBIDDEN", message: "Reviewer role is required" });
    await resolveReviewerApplication(database, input.userId, context.organizationId, input.applicationId);
  } else {
    await resolveApplicantApplication(database, input.userId, context.organizationId, input.applicationId);
  }
  const version = await resolveVersion(database, input.applicationId, input.applicationVersionId);
  const [application] = await database.select().from(naqla2Applications).where(eq(naqla2Applications.id, input.applicationId)).limit(1);
  if (!application) throw new TRPCError({ code: "NOT_FOUND", message: "Application was not found" });
  const evidence = await authorizedEvidenceForVersion(database, version.id, application.applicantUserId, reviewerMode);
  return { context, version, application, evidence, reviewerMode };
}

const runInput = z.object({
  mode: z.enum(["reviewer_assist", "applicant_assist"]),
  applicationId: z.number().int().positive(),
  applicationVersionId: z.number().int().positive(),
});

export const copilotRouter = router({
  run: protectedProcedure.input(runInput).mutation(async ({ ctx, input }) => {
    const database = await getDb();
    if (!database) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
    const authorized = await authorizeMode(database, { userId: ctx.user.id, ...input });
    const summary = snapshotSummary(authorized.version.snapshot);
    const requirementSnapshot = authorized.version.requirementSnapshot ?? { required: ["summary", "authorized_evidence"] };
    const sourceSnapshotHash = createCopilotSourceSnapshotHash({ applicationVersionId: authorized.version.id, summary, evidence: authorized.evidence, requirementSnapshot });
    const idempotencyKey = createCopilotIdempotencyKey({ mode: input.mode, actorId: ctx.user.id, activeContextId: authorized.context.organizationId, applicationVersionId: authorized.version.id, sourceSnapshotHash });

    const [existing] = await database.select().from(naqla2CopilotRuns).where(eq(naqla2CopilotRuns.idempotencyKey, idempotencyKey)).limit(1);
    if (existing) return { runId: existing.id, reused: true, status: existing.status, disclaimer: "This is advisory output only; no eligibility or human decision changed." };

    const actorRole = authorized.reviewerMode ? "reviewer" : "applicant";
    const [run] = await database.insert(naqla2CopilotRuns).values({
      tenantId: authorized.context.organizationId,
      activeContextId: authorized.context.organizationId,
      actorId: ctx.user.id,
      actorRole,
      mode: input.mode,
      applicationId: input.applicationId,
      applicationVersionId: authorized.version.id,
      policyVersion: COPILOT_POLICY_VERSION,
      sourceSnapshotHash,
      schemaVersion: COPILOT_SCHEMA_VERSION,
      providerMetadata: { provider: "none", externalCalls: 0 },
      status: "completed",
      idempotencyKey,
      completedAt: nowSql(),
    }).$returningId();
    const suggestions = analyzeCopilotGaps({ mode: input.mode, summary, evidence: authorized.evidence });
    await database.insert(naqla2CopilotSuggestions).values(suggestions.map((suggestion) => ({
      copilotRunId: run.id,
      audience: suggestion.audience,
      kind: suggestion.kind,
      status: "generated" as const,
      body: suggestion.body,
      deterministicRuleRefs: suggestion.deterministicRuleRefs,
      sourceRefs: suggestion.sourceRefs,
    })));
    await logAudit(database, ctx.user.id, "create", "naqla2_copilot_run", run.id, { mode: input.mode, applicationId: input.applicationId, applicationVersionId: input.applicationVersionId, tenantId: authorized.context.organizationId, sourceSnapshotHash, externalCalls: 0 });
    return { runId: run.id, reused: false, status: "completed", disclaimer: "This is advisory output only; no eligibility or human decision changed." };
  }),

  getRun: protectedProcedure.input(z.object({ runId: z.number().int().positive() })).query(async ({ ctx, input }) => {
    const database = await getDb();
    if (!database) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
    const context = await requireActiveContext(database, ctx.user.id);
    const [run] = await database.select().from(naqla2CopilotRuns).where(and(eq(naqla2CopilotRuns.id, input.runId), eq(naqla2CopilotRuns.actorId, ctx.user.id), eq(naqla2CopilotRuns.tenantId, context.organizationId))).limit(1);
    if (!run) throw new TRPCError({ code: "NOT_FOUND", message: "Copilot run was not found" });
    const authorized = await authorizeMode(database, { userId: ctx.user.id, applicationId: run.applicationId, applicationVersionId: run.applicationVersionId, mode: run.mode });
    const summary = snapshotSummary(authorized.version.snapshot);
    const currentHash = createCopilotSourceSnapshotHash({ applicationVersionId: authorized.version.id, summary, evidence: authorized.evidence, requirementSnapshot: authorized.version.requirementSnapshot ?? { required: ["summary", "authorized_evidence"] } });
    const hasRevokedEvidence = authorized.evidence.some((item) => item.authorizationStatus === "revoked");
    const currentStatus = currentHash === run.sourceSnapshotHash ? run.status : hasRevokedEvidence ? "revoked_source" : "recompute_required";
    if (currentStatus !== run.status) await database.update(naqla2CopilotRuns).set({ status: currentStatus, staleAt: nowSql() }).where(eq(naqla2CopilotRuns.id, run.id));
    const suggestions = await database.select().from(naqla2CopilotSuggestions).where(eq(naqla2CopilotSuggestions.copilotRunId, run.id)).orderBy(desc(naqla2CopilotSuggestions.createdAt));
    await logAudit(database, ctx.user.id, "view", "naqla2_copilot_run", run.id, { status: currentStatus });
    return { run: { ...run, status: currentStatus }, suggestions };
  }),

  reviewer: router({
    listQueue: protectedProcedure.query(async ({ ctx }) => {
      const database = await getDb();
      if (!database) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      const context = await requireActiveContext(database, ctx.user.id);
      if (!['reviewer', 'manager', 'owner'].includes(context.role)) throw new TRPCError({ code: "FORBIDDEN", message: "Reviewer role is required" });
      return database.select({ application: naqla2Applications, assignmentId: naqla2ApplicationReviewerAssignments.id })
        .from(naqla2ApplicationReviewerAssignments)
        .innerJoin(naqla2Applications, eq(naqla2ApplicationReviewerAssignments.applicationId, naqla2Applications.id))
        .where(and(eq(naqla2ApplicationReviewerAssignments.reviewerUserId, ctx.user.id), eq(naqla2ApplicationReviewerAssignments.organizationId, context.organizationId), eq(naqla2ApplicationReviewerAssignments.status, "active"), eq(naqla2Applications.reviewerTenantId, context.organizationId)))
        .orderBy(desc(naqla2Applications.updatedAt));
    }),
    getWorkspace: protectedProcedure.input(z.object({ applicationId: z.number().int().positive() })).query(async ({ ctx, input }) => {
      const database = await getDb();
      if (!database) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      const context = await requireActiveContext(database, ctx.user.id);
      if (!['reviewer', 'manager', 'owner'].includes(context.role)) throw new TRPCError({ code: "FORBIDDEN", message: "Reviewer role is required" });
      await resolveReviewerApplication(database, ctx.user.id, context.organizationId, input.applicationId);
      const [application] = await database.select().from(naqla2Applications).where(and(eq(naqla2Applications.id, input.applicationId), eq(naqla2Applications.reviewerTenantId, context.organizationId))).limit(1);
      if (!application) throw new TRPCError({ code: "NOT_FOUND", message: "Application was not found" });
      const versionRows = await database.select({ id: naqla2ApplicationVersions.id, versionNumber: naqla2ApplicationVersions.versionNumber, createdAt: naqla2ApplicationVersions.createdAt, submittedAt: naqla2ApplicationVersions.submittedAt, snapshot: naqla2ApplicationVersions.snapshot, requirementSnapshot: naqla2ApplicationVersions.requirementSnapshot }).from(naqla2ApplicationVersions).where(eq(naqla2ApplicationVersions.applicationId, application.id)).orderBy(desc(naqla2ApplicationVersions.versionNumber));
      const versions = versionRows.map(({ snapshot, ...version }) => ({ ...version, summary: redactCopilotText(snapshotSummary(snapshot)) }));
      const latestVersion = versionRows[0];
      const authorizedEvidence = latestVersion ? await authorizedEvidenceForVersion(database, latestVersion.id, application.applicantUserId, true) : [];
      const evidenceCoverage = { totalReferences: authorizedEvidence.length, reviewerAuthorized: authorizedEvidence.filter((item) => item.allowReviewer && item.authorizationStatus === "authorized").length, revoked: authorizedEvidence.filter((item) => item.authorizationStatus === "revoked").length };
      const drafts = await database.select().from(naqla2ReviewerClarificationRequests).where(and(eq(naqla2ReviewerClarificationRequests.applicationId, application.id), eq(naqla2ReviewerClarificationRequests.reviewerUserId, ctx.user.id))).orderBy(desc(naqla2ReviewerClarificationRequests.updatedAt));
      return { application, versions, evidenceCoverage, drafts };
    }),
    assign: protectedProcedure.input(z.object({ applicationId: z.number().int().positive(), reviewerUserId: z.number().int().positive() })).mutation(async ({ ctx, input }) => {
      const database = await getDb();
      if (!database) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      const context = await requireActiveContext(database, ctx.user.id);
      if (!['owner', 'manager'].includes(context.role)) throw new TRPCError({ code: "FORBIDDEN", message: "Only an ActiveContext owner or manager may assign reviewers" });
      const [application] = await database.select().from(naqla2Applications).where(and(eq(naqla2Applications.id, input.applicationId), eq(naqla2Applications.ownerUserId, ctx.user.id))).limit(1);
      if (!application) throw new TRPCError({ code: "FORBIDDEN", message: "Application assignment is not authorized" });
      const [reviewerMembership] = await database.select({ role: organizationMemberships.role }).from(organizationMemberships).where(and(eq(organizationMemberships.organizationId, context.organizationId), eq(organizationMemberships.userId, input.reviewerUserId), eq(organizationMemberships.status, "active"))).limit(1);
      if (!reviewerMembership || !['reviewer', 'manager', 'owner'].includes(reviewerMembership.role)) throw new TRPCError({ code: "FORBIDDEN", message: "Reviewer must have an active reviewer-capable membership" });
      await database.update(naqla2Applications).set({ reviewerTenantId: context.organizationId }).where(and(eq(naqla2Applications.id, application.id), eq(naqla2Applications.ownerUserId, ctx.user.id)));
      await database.insert(naqla2ApplicationReviewerAssignments).values({ applicationId: application.id, organizationId: context.organizationId, reviewerUserId: input.reviewerUserId, assignedByUserId: ctx.user.id, status: "active" }).onDuplicateKeyUpdate({ set: { status: "active", revokedAt: null } });
      await logAudit(database, ctx.user.id, "assign", "naqla2_application_reviewer", application.id, { reviewerUserId: input.reviewerUserId, tenantId: context.organizationId });
      return { applicationId: application.id, reviewerUserId: input.reviewerUserId, status: "active" };
    }),
    createClarificationDraft: protectedProcedure.input(z.object({ applicationId: z.number().int().positive(), applicationVersionId: z.number().int().positive(), question: z.string().trim().min(8).max(4000), suggestionId: z.number().int().positive().optional() })).mutation(async ({ ctx, input }) => {
      const database = await getDb();
      if (!database) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      const authorized = await authorizeMode(database, { userId: ctx.user.id, applicationId: input.applicationId, applicationVersionId: input.applicationVersionId, mode: "reviewer_assist" });
      if (input.suggestionId) {
        const [suggestion] = await database.select().from(naqla2CopilotSuggestions).innerJoin(naqla2CopilotRuns, eq(naqla2CopilotSuggestions.copilotRunId, naqla2CopilotRuns.id)).where(and(eq(naqla2CopilotSuggestions.id, input.suggestionId), eq(naqla2CopilotRuns.actorId, ctx.user.id), eq(naqla2CopilotRuns.mode, "reviewer_assist"))).limit(1);
        if (!suggestion) throw new TRPCError({ code: "FORBIDDEN", message: "Suggestion is not available to this reviewer" });
      }
      const [draft] = await database.insert(naqla2ReviewerClarificationRequests).values({ applicationId: input.applicationId, applicationVersionId: input.applicationVersionId, reviewerUserId: ctx.user.id, suggestionId: input.suggestionId, question: redactCopilotText(input.question), status: "draft" }).$returningId();
      if (input.suggestionId) await database.update(naqla2CopilotSuggestions).set({ status: "accepted_as_draft", actionedAt: nowSql() }).where(eq(naqla2CopilotSuggestions.id, input.suggestionId));
      await logAudit(database, ctx.user.id, "create", "naqla2_reviewer_clarification_draft", draft.id, { applicationId: input.applicationId, tenantId: authorized.context.organizationId });
      return { clarificationRequestId: draft.id, status: "draft" };
    }),
    editClarificationDraft: protectedProcedure.input(z.object({ clarificationRequestId: z.number().int().positive(), question: z.string().trim().min(8).max(4000) })).mutation(async ({ ctx, input }) => {
      const database = await getDb();
      if (!database) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      await requireActiveContext(database, ctx.user.id);
      const result = await database.update(naqla2ReviewerClarificationRequests).set({ question: redactCopilotText(input.question) }).where(and(eq(naqla2ReviewerClarificationRequests.id, input.clarificationRequestId), eq(naqla2ReviewerClarificationRequests.reviewerUserId, ctx.user.id), eq(naqla2ReviewerClarificationRequests.status, "draft")));
      if (!hasAffectedRow(result)) throw new TRPCError({ code: "FORBIDDEN", message: "Only the owning reviewer may edit a draft clarification" });
      await logAudit(database, ctx.user.id, "edit", "naqla2_reviewer_clarification_draft", input.clarificationRequestId, {});
      return { clarificationRequestId: input.clarificationRequestId, status: "draft" };
    }),
    sendClarification: protectedProcedure.input(z.object({ clarificationRequestId: z.number().int().positive() })).mutation(async ({ ctx, input }) => {
      const database = await getDb();
      if (!database) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      await requireActiveContext(database, ctx.user.id);
      const result = await database.update(naqla2ReviewerClarificationRequests).set({ status: "sent", sentByUserId: ctx.user.id, sentAt: nowSql() }).where(and(eq(naqla2ReviewerClarificationRequests.id, input.clarificationRequestId), eq(naqla2ReviewerClarificationRequests.reviewerUserId, ctx.user.id), eq(naqla2ReviewerClarificationRequests.status, "draft")));
      if (!hasAffectedRow(result)) throw new TRPCError({ code: "FORBIDDEN", message: "Only the owning reviewer may send a draft clarification" });
      await logAudit(database, ctx.user.id, "send", "naqla2_reviewer_clarification", input.clarificationRequestId, {});
      return { clarificationRequestId: input.clarificationRequestId, status: "sent" };
    }),
  }),

  applicant: router({
    listMyApplications: protectedProcedure.query(async ({ ctx }) => {
      const database = await getDb();
      if (!database) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      const context = await requireActiveContext(database, ctx.user.id);
      return database.select().from(naqla2Applications)
        .where(and(eq(naqla2Applications.applicantUserId, ctx.user.id), eq(naqla2Applications.tenantId, context.organizationId)))
        .orderBy(desc(naqla2Applications.updatedAt));
    }),
    getWorkspace: protectedProcedure.input(z.object({ applicationId: z.number().int().positive() })).query(async ({ ctx, input }) => {
      const database = await getDb();
      if (!database) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      const context = await requireActiveContext(database, ctx.user.id);
      const application = await resolveApplicantApplication(database, ctx.user.id, context.organizationId, input.applicationId);
      const versions = await database.select().from(naqla2ApplicationVersions).where(eq(naqla2ApplicationVersions.applicationId, application.id)).orderBy(desc(naqla2ApplicationVersions.versionNumber));
      const latestVersion = versions[0];
      const authorizedEvidence = latestVersion ? await authorizedEvidenceForVersion(database, latestVersion.id, ctx.user.id, false) : [];
      const evidenceCoverage = { totalReferences: authorizedEvidence.length, authorized: authorizedEvidence.filter((item) => item.authorizationStatus === "authorized").length, revoked: authorizedEvidence.filter((item) => item.authorizationStatus === "revoked").length };
      const clarifications = await database.select({ id: naqla2ReviewerClarificationRequests.id, applicationId: naqla2ReviewerClarificationRequests.applicationId, applicationVersionId: naqla2ReviewerClarificationRequests.applicationVersionId, question: naqla2ReviewerClarificationRequests.question, status: naqla2ReviewerClarificationRequests.status, sentAt: naqla2ReviewerClarificationRequests.sentAt }).from(naqla2ReviewerClarificationRequests).where(and(eq(naqla2ReviewerClarificationRequests.applicationId, application.id), eq(naqla2ReviewerClarificationRequests.status, "sent"))).orderBy(desc(naqla2ReviewerClarificationRequests.sentAt));
      const responses = await database.select().from(naqla2ApplicantClarificationResponses).where(eq(naqla2ApplicantClarificationResponses.applicantUserId, ctx.user.id));
      return { application, versions, evidenceCoverage, clarifications, responses: responses.filter((response) => clarifications.some((request) => request.id === response.clarificationRequestId)) };
    }),
    createResponseDraft: protectedProcedure.input(z.object({ clarificationRequestId: z.number().int().positive(), responseText: z.string().trim().min(4).max(5000) })).mutation(async ({ ctx, input }) => {
      const database = await getDb();
      if (!database) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      const context = await requireActiveContext(database, ctx.user.id);
      const [request] = await database.select().from(naqla2ReviewerClarificationRequests).innerJoin(naqla2Applications, eq(naqla2ReviewerClarificationRequests.applicationId, naqla2Applications.id)).where(and(eq(naqla2ReviewerClarificationRequests.id, input.clarificationRequestId), eq(naqla2ReviewerClarificationRequests.status, "sent"), eq(naqla2Applications.applicantUserId, ctx.user.id), eq(naqla2Applications.tenantId, context.organizationId))).limit(1);
      if (!request) throw new TRPCError({ code: "FORBIDDEN", message: "Clarification is not available to this applicant" });
      const [response] = await database.insert(naqla2ApplicantClarificationResponses).values({ clarificationRequestId: input.clarificationRequestId, applicantUserId: ctx.user.id, responseText: redactCopilotText(input.responseText), status: "draft" }).$returningId();
      await logAudit(database, ctx.user.id, "create", "naqla2_applicant_clarification_draft", response.id, { clarificationRequestId: input.clarificationRequestId });
      return { responseId: response.id, status: "draft" };
    }),
    submitResponse: protectedProcedure.input(z.object({ responseId: z.number().int().positive() })).mutation(async ({ ctx, input }) => {
      const database = await getDb();
      if (!database) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      await requireActiveContext(database, ctx.user.id);
      const result = await database.update(naqla2ApplicantClarificationResponses).set({ status: "submitted", submittedAt: nowSql() }).where(and(eq(naqla2ApplicantClarificationResponses.id, input.responseId), eq(naqla2ApplicantClarificationResponses.applicantUserId, ctx.user.id), eq(naqla2ApplicantClarificationResponses.status, "draft")));
      if (!hasAffectedRow(result)) throw new TRPCError({ code: "FORBIDDEN", message: "Only the applicant may explicitly submit a draft response" });
      await logAudit(database, ctx.user.id, "submit", "naqla2_applicant_clarification_response", input.responseId, {});
      return { responseId: input.responseId, status: "submitted" };
    }),
    createDraftFromSuggestion: protectedProcedure.input(z.object({ applicationId: z.number().int().positive(), baseApplicationVersionId: z.number().int().positive(), suggestionId: z.number().int().positive(), content: z.string().trim().min(10).max(5000) })).mutation(async ({ ctx, input }) => {
      const database = await getDb();
      if (!database) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      const context = await requireActiveContext(database, ctx.user.id);
      await resolveApplicantApplication(database, ctx.user.id, context.organizationId, input.applicationId);
      await resolveVersion(database, input.applicationId, input.baseApplicationVersionId);
      const [suggestion] = await database.select().from(naqla2CopilotSuggestions).innerJoin(naqla2CopilotRuns, eq(naqla2CopilotSuggestions.copilotRunId, naqla2CopilotRuns.id)).where(and(eq(naqla2CopilotSuggestions.id, input.suggestionId), eq(naqla2CopilotRuns.actorId, ctx.user.id), eq(naqla2CopilotRuns.mode, "applicant_assist"))).limit(1);
      if (!suggestion) throw new TRPCError({ code: "FORBIDDEN", message: "Suggestion is not available to this applicant" });
      const [draft] = await database.insert(naqla2ApplicantCopilotDrafts).values({ applicationId: input.applicationId, applicantUserId: ctx.user.id, baseApplicationVersionId: input.baseApplicationVersionId, suggestionId: input.suggestionId, content: redactCopilotText(input.content), status: "draft" }).$returningId();
      await database.update(naqla2CopilotSuggestions).set({ status: "accepted_as_draft", actionedAt: nowSql() }).where(eq(naqla2CopilotSuggestions.id, input.suggestionId));
      await logAudit(database, ctx.user.id, "create", "naqla2_applicant_copilot_draft", draft.id, { applicationId: input.applicationId, suggestionId: input.suggestionId });
      return { draftId: draft.id, status: "draft" };
    }),
    submitDraftAsVersion: protectedProcedure.input(z.object({ draftId: z.number().int().positive() })).mutation(async ({ ctx, input }) => {
      const database = await getDb();
      if (!database) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      const context = await requireActiveContext(database, ctx.user.id);
      const [draft] = await database.select().from(naqla2ApplicantCopilotDrafts).where(and(eq(naqla2ApplicantCopilotDrafts.id, input.draftId), eq(naqla2ApplicantCopilotDrafts.applicantUserId, ctx.user.id), eq(naqla2ApplicantCopilotDrafts.status, "draft"))).limit(1);
      if (!draft) throw new TRPCError({ code: "FORBIDDEN", message: "Only the applicant may explicitly submit a draft" });
      const application = await resolveApplicantApplication(database, ctx.user.id, context.organizationId, draft.applicationId);
      const baseVersion = await resolveVersion(database, application.id, draft.baseApplicationVersionId);
      const baseEvidence = await authorizedEvidenceForVersion(database, baseVersion.id, ctx.user.id, false);
      const evidenceReferences = baseEvidence.filter((item) => item.authorizationStatus === "authorized").map((item) => ({ evidenceId: item.evidenceId, shareWithReviewer: item.allowReviewer }));
      const versions = await database.select({ id: naqla2ApplicationVersions.id }).from(naqla2ApplicationVersions).where(eq(naqla2ApplicationVersions.applicationId, application.id));
      const snapshot = { applicationId: application.id, applicantUserId: ctx.user.id, summary: draft.content, source: "applicant_copilot_draft", evidenceIds: evidenceReferences.map((reference) => reference.evidenceId) };
      const payloadSha256 = createHash("sha256").update(JSON.stringify(snapshot)).digest("hex");
      const [version] = await database.insert(naqla2ApplicationVersions).values({ applicationId: application.id, versionNumber: versions.length + 1, payloadSha256, snapshot, actorId: ctx.user.id, submittedAt: nowSql(), requirementSnapshot: baseVersion.requirementSnapshot ?? { required: ["summary", "authorized_evidence"] }, evidenceReferences, provenance: { source: "applicant_copilot_draft", draftId: draft.id, baseVersionId: baseVersion.id } }).$returningId();
      if (evidenceReferences.length) await database.insert(naqla2ApplicationEvidenceReferences).values(evidenceReferences.map((reference) => ({ applicationVersionId: version.id, evidenceId: reference.evidenceId, applicantUserId: ctx.user.id, allowReviewer: reference.shareWithReviewer ? 1 : 0 })));
      await database.update(naqla2ApplicantCopilotDrafts).set({ status: "submitted", submittedAt: nowSql() }).where(eq(naqla2ApplicantCopilotDrafts.id, draft.id));
      await logAudit(database, ctx.user.id, "submit", "naqla2_application_version", version.id, { applicationId: application.id, sourceDraftId: draft.id });
      return { versionId: version.id, versionNumber: versions.length + 1, disclaimer: "A new immutable version was created. No application decision or eligibility changed." };
    }),
  }),
});
