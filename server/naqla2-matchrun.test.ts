import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TrpcContext } from "./_core/context";

const { getDb } = vi.hoisted(() => ({ getDb: vi.fn() }));
vi.mock("./db", () => ({ getDb }));

import { appRouter, createDeterministicTeaserMatch } from "./routers";

function contextFor(id: number): TrpcContext {
  return { user: { id, openId: `match-user-${id}`, email: `match${id}@example.com`, name: `Match ${id}`, loginMethod: "manus", role: "user", createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() }, req: { protocol: "https", headers: {} } as TrpcContext["req"], res: {} as TrpcContext["res"] };
}

function resolvedBuilder<T>(value: T) {
  const builder: any = { from: () => builder, where: () => builder, limit: () => builder, offset: () => Promise.resolve(value), orderBy: () => builder, innerJoin: () => builder, then: (resolve: (input: T) => unknown, reject?: (reason: unknown) => unknown) => Promise.resolve(value).then(resolve, reject) };
  return builder;
}

describe("NAQLA2 deterministic MatchRun factors", () => {
  beforeEach(() => vi.clearAllMocks());
  it("ينتج عوامل قابلة للتفسير من teaser فقط دون ثقة دليل مستنتجة", () => {
    const result = createDeterministicTeaserMatch("energy optimization", "Energy optimization", "Synthetic teaser only");
    expect(result.score).toBe(100);
    expect(result.rankBand).toBe("high");
    expect(result.factors).toEqual(expect.arrayContaining([
      expect.objectContaining({ factorId: "query_term_overlap", method: "deterministic_exact_term_overlap", matchedTerms: ["energy", "optimization"] }),
      expect.objectContaining({ factorId: "disclosure_boundary", value: "teaser_only" }),
      expect.objectContaining({ factorId: "evidence_confidence", value: "not_evaluated_from_teaser" }),
    ]));
  });

  it("لا يرفع رتبة المطابقة عند غياب التقاطع النصي", () => {
    const result = createDeterministicTeaserMatch("water agriculture", "Energy platform", "Synthetic teaser only");
    expect(result.score).toBe(0);
    expect(result.rankBand).toBe("low");
  });

  it("يحفظ مرشحي teaser فقط ويستبعد قائمة المالك من MatchRun", async () => {
    const firstInsert = { values: vi.fn(() => ({ $returningId: vi.fn().mockResolvedValue([{ id: 31 }]) })) };
    const secondInsert = { values: vi.fn(() => Promise.resolve()) };
    const thirdInsert = { values: vi.fn(() => Promise.resolve()) };
    const auditInsert = { values: vi.fn(() => Promise.resolve()) };
    const select = vi.fn()
      .mockReturnValueOnce(resolvedBuilder([{ organizationId: 6 }]))
      .mockReturnValueOnce(resolvedBuilder([{ id: 601 }]))
      .mockReturnValueOnce(resolvedBuilder([{ id: 50, title: "Energy need", description: "energy optimization" }]))
      .mockReturnValueOnce(resolvedBuilder([]))
      .mockReturnValueOnce(resolvedBuilder([
        { id: 7, ownerUserId: 1, title: "My private scope", summary: "not a candidate", disclosureScope: "teaser_only", status: "published" },
        { id: 8, ownerUserId: 2, title: "Energy optimization", summary: "Published teaser only", disclosureScope: "teaser_only", status: "published" },
        { id: 9, ownerUserId: 3, title: "Restricted details", summary: "Must not enter candidates", disclosureScope: "authorized_disclosure", status: "published" },
      ]));
    getDb.mockResolvedValue({
      select,
      insert: vi.fn().mockReturnValueOnce(firstInsert).mockReturnValueOnce(secondInsert).mockReturnValueOnce(thirdInsert).mockReturnValueOnce(auditInsert),
    });
    const caller = appRouter.createCaller(contextFor(1));
    await expect(caller.naqla2.deterministicMatching.createRun({ requestId: 50 })).resolves.toMatchObject({ runId: 31, candidateCount: 1, method: "deterministic_teaser_term_overlap" });
    expect(firstInsert.values).toHaveBeenCalledWith(expect.objectContaining({ matchingRequestId: 50, activeContextId: 6, ruleVersion: "naqla2-deterministic-v2", queryText: "Energy need energy optimization" }));
    expect(secondInsert.values).toHaveBeenCalledWith([expect.objectContaining({ matchRunId: 31, listingId: 8, evidenceConfidence: "teaser_only", rankBand: "high" })]);
    expect(secondInsert.values).not.toHaveBeenCalledWith(expect.arrayContaining([expect.objectContaining({ listingId: 9 })]));
  });

  it("يرفض قراءة MatchRun غير المملوكة للحساب", async () => {
    getDb.mockResolvedValue({ select: vi.fn(() => resolvedBuilder([])) });
    const caller = appRouter.createCaller(contextFor(1));
    await expect(caller.naqla2.deterministicMatching.getRun({ runId: 99 })).rejects.toMatchObject({ code: "NOT_FOUND" });
  });

  it("يرفض تشغيل MatchRun عند غياب ملكية طلب المطابقة", async () => {
    const select = vi.fn().mockReturnValueOnce(resolvedBuilder([{ organizationId: 6 }])).mockReturnValueOnce(resolvedBuilder([{ id: 601 }])).mockReturnValueOnce(resolvedBuilder([]));
    getDb.mockResolvedValue({ select });
    const caller = appRouter.createCaller(contextFor(1));
    await expect(caller.naqla2.deterministicMatching.createRun({ requestId: 77 })).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("يقسم قائمة MatchRun داخل ActiveContext المملوك مع حد آمن", async () => {
    const select = vi.fn().mockReturnValueOnce(resolvedBuilder([{ organizationId: 6 }])).mockReturnValueOnce(resolvedBuilder([{ id: 601 }])).mockReturnValueOnce(resolvedBuilder([{ id: 31 }, { id: 30 }]));
    getDb.mockResolvedValue({ select });
    const caller = appRouter.createCaller(contextFor(1));
    await expect(caller.naqla2.deterministicMatching.listRuns({ page: 1, limit: 1, sort: "newest" })).resolves.toMatchObject({ page: 1, limit: 1, hasNextPage: true, items: [{ id: 31 }] });
  });

  it("يغطي رحلة مصادق عليها: Discovery ثم MatchRun ثم Interest فـEngagement وPilot بلا قبول أو عقد تلقائي", async () => {
    const requester = appRouter.createCaller(contextFor(1));
    const owner = appRouter.createCaller(contextFor(2));

    getDb.mockResolvedValue({ select: vi.fn(() => resolvedBuilder([{ id: 8, title: "Synthetic energy teaser", summary: "Published teaser", disclosureScope: "teaser_only", createdAt: new Date() }])) });
    await expect(requester.naqla2.discovery.getOpportunityTeasers()).resolves.toHaveLength(1);

    const requestInsert = { values: vi.fn(() => ({ $returningId: vi.fn().mockResolvedValue([{ id: 70 }]) })) };
    getDb.mockResolvedValue({ insert: vi.fn(() => requestInsert) });
    await expect(requester.naqla2.matching.request({ seekingType: "partner", requirements: "Synthetic governed energy optimisation pilot request." })).resolves.toMatchObject({ requestId: 70, status: "active" });

    const runInsert = { values: vi.fn(() => ({ $returningId: vi.fn().mockResolvedValue([{ id: 71 }]) })) };
    const candidateInsert = { values: vi.fn(() => Promise.resolve()) };
    const exclusionInsert = { values: vi.fn(() => Promise.resolve()) };
    const auditInsert = { values: vi.fn(() => Promise.resolve()) };
    getDb.mockResolvedValue({
      select: vi.fn()
        .mockReturnValueOnce(resolvedBuilder([{ organizationId: 6 }]))
        .mockReturnValueOnce(resolvedBuilder([{ id: 601 }]))
        .mockReturnValueOnce(resolvedBuilder([{ id: 70, title: "Synthetic energy need", description: "energy optimisation" }]))
        .mockReturnValueOnce(resolvedBuilder([]))
        .mockReturnValueOnce(resolvedBuilder([{ id: 8, ownerUserId: 2, title: "Energy optimisation", summary: "Synthetic published teaser", disclosureScope: "teaser_only", status: "published" }])),
      insert: vi.fn().mockReturnValueOnce(runInsert).mockReturnValueOnce(candidateInsert).mockReturnValueOnce(exclusionInsert).mockReturnValueOnce(auditInsert),
    });
    await expect(requester.naqla2.deterministicMatching.createRun({ requestId: 70 })).resolves.toMatchObject({ runId: 71, candidateCount: 1, reused: false });

    const interestInsert = { values: vi.fn(() => ({ $returningId: vi.fn().mockResolvedValue([{ id: 72 }]) })) };
    getDb.mockResolvedValue({ select: vi.fn(() => resolvedBuilder([{ id: 8, ownerUserId: 2, status: "published" }])), insert: vi.fn(() => interestInsert) });
    await expect(requester.naqla2.marketplace.requestPurchase({ listingId: 8, message: "Synthetic interest for a governed pilot review." })).resolves.toMatchObject({ interestId: 72, status: "submitted" });

    getDb.mockResolvedValue({ select: vi.fn(() => resolvedBuilder([{ ownerUserId: 2, requesterUserId: 1, status: "submitted" }])), update: vi.fn(() => ({ set: () => ({ where: () => ({ affectedRows: 1 }) }) })) });
    await expect(owner.naqla2.engagements.setInterestStatus({ interestRequestId: 72, status: "accepted" })).resolves.toEqual({ status: "accepted" });

    const engagementInsert = { values: vi.fn(() => ({ $returningId: vi.fn().mockResolvedValue([{ id: 73 }]) })) };
    getDb.mockResolvedValue({ select: vi.fn(() => resolvedBuilder([{ id: 72, ownerUserId: 2, requesterUserId: 1, status: "accepted" }])), insert: vi.fn(() => engagementInsert) });
    await expect(owner.naqla2.engagements.establish({ interestRequestId: 72 })).resolves.toMatchObject({ engagementId: 73, status: "established" });

    const pilotInsert = { values: vi.fn(() => ({ $returningId: vi.fn().mockResolvedValue([{ id: 74 }]) })) };
    getDb.mockResolvedValue({ select: vi.fn(() => resolvedBuilder([{ id: 73, ownerUserId: 2, requesterUserId: 1, status: "established" }])), insert: vi.fn(() => pilotInsert) });
    await expect(owner.naqla2.engagements.createPilot({ engagementId: 73, scope: "Synthetic pilot scope remains subject to governed human review." })).resolves.toMatchObject({ pilotId: 74, status: "planned" });
  });

  it("يرفض MatchRun عندما تصبح عضوية ActiveContext ملغاة", async () => {
    const select = vi.fn()
      .mockReturnValueOnce(resolvedBuilder([{ organizationId: 6 }]))
      .mockReturnValueOnce(resolvedBuilder([]));
    getDb.mockResolvedValue({ select });
    const caller = appRouter.createCaller(contextFor(1));
    await expect(caller.naqla2.deterministicMatching.createRun({ requestId: 77 })).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
});
