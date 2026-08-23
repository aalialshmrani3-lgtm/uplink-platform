import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TrpcContext } from "./_core/context";

const { getDb } = vi.hoisted(() => ({ getDb: vi.fn() }));
vi.mock("./db", () => ({ getDb }));

import { appRouter } from "./routers";

function contextFor(id: number): TrpcContext {
  return { user: { id, openId: `qualification-user-${id}`, email: `qualification${id}@example.com`, name: `Qualification ${id}`, loginMethod: "manus", role: "user", createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() }, req: { protocol: "https", headers: {} } as TrpcContext["req"], res: {} as TrpcContext["res"] };
}

function resolvedBuilder<T>(value: T) {
  const builder: any = { from: () => builder, where: () => builder, limit: () => Promise.resolve(value), orderBy: () => Promise.resolve(value), then: (resolve: (input: T) => unknown, reject?: (reason: unknown) => unknown) => Promise.resolve(value).then(resolve, reject) };
  return builder;
}

describe("NAQLA1 qualification router ownership", () => {
  beforeEach(() => vi.clearAllMocks());

  it("يرفض إضافة دليل أو قراءة جواز لسجل غير مملوك", async () => {
    getDb.mockResolvedValue({ select: vi.fn(() => resolvedBuilder([])) });
    const caller = appRouter.createCaller(contextFor(1));
    await expect(caller.naqla1Qualification.addEvidence({ recordId: 9, label: "Synthetic proof", evidenceType: "synthetic_note", contentSha256: "a".repeat(64) })).rejects.toMatchObject({ code: "NOT_FOUND" });
    await expect(caller.naqla1Qualification.getPassport({ recordId: 9 })).rejects.toMatchObject({ code: "NOT_FOUND" });
  });

  it("ينشئ سجل ابتكار بملكية caller فقط", async () => {
    const values = vi.fn(() => ({ $returningId: vi.fn().mockResolvedValue([{ id: 19 }]) }));
    getDb.mockResolvedValue({ insert: vi.fn(() => ({ values })) });
    await expect(appRouter.createCaller(contextFor(1)).naqla1Qualification.createRecord({ title: "Synthetic qualification record", problemStatement: "A complete synthetic problem statement for qualification.", desiredOutcome: "A complete synthetic desired outcome for qualification." })).resolves.toEqual({ recordId: 19, status: "draft" });
    expect(values).toHaveBeenCalledWith(expect.objectContaining({ ownerUserId: 1 }));
  });

  it("يحفظ دليلاً مفوضاً ونسخة ثابتة للسجل المملوك فقط", async () => {
    const record = { id: 19, ownerUserId: 1, title: "Synthetic qualification record", problemStatement: "A complete synthetic problem statement for qualification.", desiredOutcome: "A complete synthetic desired outcome for qualification." };
    const select = vi.fn().mockReturnValueOnce(resolvedBuilder([record])).mockReturnValueOnce(resolvedBuilder([record])).mockReturnValueOnce(resolvedBuilder([]));
    const evidenceValues = vi.fn(() => ({ $returningId: vi.fn().mockResolvedValue([{ id: 22 }]) }));
    const versionValues = vi.fn(() => ({ $returningId: vi.fn().mockResolvedValue([{ id: 23 }]) }));
    getDb.mockResolvedValue({ select, insert: vi.fn().mockReturnValueOnce({ values: evidenceValues }).mockReturnValueOnce({ values: versionValues }) });
    const caller = appRouter.createCaller(contextFor(1));
    await expect(caller.naqla1Qualification.addEvidence({ recordId: 19, label: "Synthetic evidence metadata", evidenceType: "synthetic_note", contentSha256: "b".repeat(64) })).resolves.toMatchObject({ evidenceId: 22, authorizationStatus: "authorized" });
    await expect(caller.naqla1Qualification.createImmutableVersion({ recordId: 19 })).resolves.toMatchObject({ versionId: 23, versionNumber: 1, snapshotSha256: expect.stringMatching(/^[a-f0-9]{64}$/) });
  });

  it("يكتب تقييماً وجوازاً حتميين بعد استيفاء الدليل والنسخة", async () => {
    const record = { id: 19, ownerUserId: 1, title: "Synthetic qualification record", problemStatement: "A complete synthetic problem statement for qualification.", desiredOutcome: "A complete synthetic desired outcome for qualification." };
    const select = vi.fn().mockReturnValueOnce(resolvedBuilder([record])).mockReturnValueOnce(resolvedBuilder([{ id: 22 }])).mockReturnValueOnce(resolvedBuilder([{ id: 23 }]));
    const assessmentValues = vi.fn(() => ({ $returningId: vi.fn().mockResolvedValue([{ id: 24 }]) }));
    const passportValues = vi.fn(() => ({ onDuplicateKeyUpdate: vi.fn().mockResolvedValue(undefined) }));
    const updateWhere = vi.fn().mockResolvedValue({ affectedRows: 1 });
    getDb.mockResolvedValue({
      select,
      delete: vi.fn(() => ({ where: vi.fn().mockResolvedValue(undefined) })),
      insert: vi.fn().mockReturnValueOnce({ values: assessmentValues }).mockReturnValueOnce({ values: passportValues }),
      update: vi.fn(() => ({ set: vi.fn(() => ({ where: updateWhere })) })),
    });
    await expect(appRouter.createCaller(contextFor(1)).naqla1Qualification.assess({ recordId: 19 })).resolves.toMatchObject({ assessmentId: 24, qualificationStatus: "qualified", nextBestAction: "route_to_naqla2", criteriaSatisfied: 4 });
    expect(passportValues).toHaveBeenCalledWith(expect.objectContaining({ innovationRecordId: 19, currentTrl: 5, lastAssessmentId: 24 }));
  });

  it("يمر عبر السجل والدليل والنسخة والتقييم والجواز ثم يعيد الفجوات بعد revoke", async () => {
    const record = { id: 19, ownerUserId: 1, title: "Synthetic qualification record", problemStatement: "A complete synthetic problem statement for qualification.", desiredOutcome: "A complete synthetic desired outcome for qualification.", status: "draft" };
    const qualifiedPassport = { id: 31, innovationRecordId: 19, ownerUserId: 1, currentTrl: 5, qualificationStatus: "qualified", nextBestAction: "route_to_naqla2", lastAssessmentId: 30, updatedAt: "2026-08-23" };
    const revokedPassport = { ...qualifiedPassport, id: 34, currentTrl: 3, qualificationStatus: "not_ready", nextBestAction: "add_authorized_evidence", lastAssessmentId: 33 };
    const select = vi.fn()
      .mockReturnValueOnce(resolvedBuilder([record])) // addEvidence owner record
      .mockReturnValueOnce(resolvedBuilder([record])) // createVersion owner record
      .mockReturnValueOnce(resolvedBuilder([])) // createVersion existing versions
      .mockReturnValueOnce(resolvedBuilder([record])) // first assess record
      .mockReturnValueOnce(resolvedBuilder([{ id: 21 }])) // first assess authorized evidence
      .mockReturnValueOnce(resolvedBuilder([{ id: 22 }])) // first assess version
      .mockReturnValueOnce(resolvedBuilder([record])) // first passport record
      .mockReturnValueOnce(resolvedBuilder([qualifiedPassport])) // passport row
      .mockReturnValueOnce(resolvedBuilder([])) // first passport gaps
      .mockReturnValueOnce(resolvedBuilder([{ id: 22, versionNumber: 1 }])) // first passport versions
      .mockReturnValueOnce(resolvedBuilder([{ id: 21, label: "Synthetic evidence", evidenceType: "synthetic_note", authorizationStatus: "authorized", createdAt: "2026-08-23" }])) // first passport evidence
      .mockReturnValueOnce(resolvedBuilder([record])) // second assess record
      .mockReturnValueOnce(resolvedBuilder([])) // second assess evidence after revoke
      .mockReturnValueOnce(resolvedBuilder([{ id: 22 }])) // second assess version
      .mockReturnValueOnce(resolvedBuilder([record])) // second passport record
      .mockReturnValueOnce(resolvedBuilder([revokedPassport])) // second passport row
      .mockReturnValueOnce(resolvedBuilder([{ code: "missing_authorized_evidence", status: "open" }])) // second passport gaps
      .mockReturnValueOnce(resolvedBuilder([{ id: 22, versionNumber: 1 }])) // second passport versions
      .mockReturnValueOnce(resolvedBuilder([{ id: 21, label: "Synthetic evidence", evidenceType: "synthetic_note", authorizationStatus: "revoked", createdAt: "2026-08-23" }])); // second passport evidence

    const values = vi.fn()
      .mockReturnValueOnce({ $returningId: vi.fn().mockResolvedValue([{ id: 21 }]) }) // evidence
      .mockReturnValueOnce({ $returningId: vi.fn().mockResolvedValue([{ id: 22 }]) }) // version
      .mockReturnValueOnce({ $returningId: vi.fn().mockResolvedValue([{ id: 30 }]) }) // first assessment
      .mockReturnValueOnce({ onDuplicateKeyUpdate: vi.fn().mockResolvedValue(undefined) }) // first passport
      .mockReturnValueOnce({ $returningId: vi.fn().mockResolvedValue([{ id: 32 }]) }) // second gaps
      .mockReturnValueOnce({ $returningId: vi.fn().mockResolvedValue([{ id: 33 }]) }) // second assessment
      .mockReturnValueOnce({ onDuplicateKeyUpdate: vi.fn().mockResolvedValue(undefined) }); // second passport

    const updateWhere = vi.fn().mockResolvedValue({ affectedRows: 1 });
    getDb.mockResolvedValue({
      select,
      insert: vi.fn(() => ({ values })),
      delete: vi.fn(() => ({ where: vi.fn().mockResolvedValue(undefined) })),
      update: vi.fn(() => ({ set: vi.fn(() => ({ where: updateWhere })) })),
    });

    const caller = appRouter.createCaller(contextFor(1));
    await caller.naqla1Qualification.addEvidence({ recordId: 19, label: "Synthetic evidence", evidenceType: "synthetic_note", contentSha256: "c".repeat(64) });
    await caller.naqla1Qualification.createImmutableVersion({ recordId: 19 });
    await expect(caller.naqla1Qualification.assess({ recordId: 19 })).resolves.toMatchObject({ qualificationStatus: "qualified", nextBestAction: "route_to_naqla2", readinessLevel: 5 });
    await expect(caller.naqla1Qualification.getPassport({ recordId: 19 })).resolves.toMatchObject({ passport: expect.objectContaining({ qualificationStatus: "qualified", currentTrl: 5 }), gaps: [] });
    await caller.naqla1Qualification.revokeEvidence({ evidenceId: 21 });
    await expect(caller.naqla1Qualification.assess({ recordId: 19 })).resolves.toMatchObject({ qualificationStatus: "not_ready", nextBestAction: "add_authorized_evidence", gaps: ["missing_authorized_evidence"] });
    await expect(caller.naqla1Qualification.getPassport({ recordId: 19 })).resolves.toMatchObject({ passport: expect.objectContaining({ qualificationStatus: "not_ready", nextBestAction: "add_authorized_evidence" }), gaps: [expect.objectContaining({ code: "missing_authorized_evidence" })] });
  });
});
