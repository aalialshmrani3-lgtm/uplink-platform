import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TrpcContext } from "./_core/context";

const { getDb } = vi.hoisted(() => ({ getDb: vi.fn() }));
vi.mock("./db", () => ({ getDb }));

import { appRouter, createDeterministicTeaserMatch } from "./routers";

function contextFor(id: number): TrpcContext {
  return { user: { id, openId: `match-user-${id}`, email: `match${id}@example.com`, name: `Match ${id}`, loginMethod: "manus", role: "user", createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() }, req: { protocol: "https", headers: {} } as TrpcContext["req"], res: {} as TrpcContext["res"] };
}

function resolvedBuilder<T>(value: T) {
  const builder: any = { from: () => builder, where: () => builder, limit: () => Promise.resolve(value), orderBy: () => Promise.resolve(value), innerJoin: () => builder, then: (resolve: (input: T) => unknown, reject?: (reason: unknown) => unknown) => Promise.resolve(value).then(resolve, reject) };
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
    const select = vi.fn()
      .mockReturnValueOnce(resolvedBuilder([{ id: 50, title: "Energy need", description: "energy optimization" }]))
      .mockReturnValueOnce(resolvedBuilder([
        { id: 7, ownerUserId: 1, title: "My private scope", summary: "not a candidate", disclosureScope: "teaser_only" },
        { id: 8, ownerUserId: 2, title: "Energy optimization", summary: "Published teaser only", disclosureScope: "teaser_only" },
        { id: 9, ownerUserId: 3, title: "Restricted details", summary: "Must not enter candidates", disclosureScope: "authorized_disclosure" },
      ]));
    getDb.mockResolvedValue({
      select,
      insert: vi.fn().mockReturnValueOnce(firstInsert).mockReturnValueOnce(secondInsert),
    });
    const caller = appRouter.createCaller(contextFor(1));
    await expect(caller.naqla2.deterministicMatching.createRun({ requestId: 50 })).resolves.toMatchObject({ runId: 31, candidateCount: 1, method: "deterministic_teaser_term_overlap" });
    expect(firstInsert.values).toHaveBeenCalledWith(expect.objectContaining({ matchingRequestId: 50, queryText: "Energy need energy optimization" }));
    expect(secondInsert.values).toHaveBeenCalledWith([expect.objectContaining({ matchRunId: 31, listingId: 8, evidenceConfidence: "teaser_only", rankBand: "high" })]);
    expect(secondInsert.values).not.toHaveBeenCalledWith(expect.arrayContaining([expect.objectContaining({ listingId: 9 })]));
  });

  it("يرفض قراءة MatchRun غير المملوكة للحساب", async () => {
    getDb.mockResolvedValue({ select: vi.fn(() => resolvedBuilder([])) });
    const caller = appRouter.createCaller(contextFor(1));
    await expect(caller.naqla2.deterministicMatching.getRun({ runId: 99 })).rejects.toMatchObject({ code: "NOT_FOUND" });
  });

  it("يرفض تشغيل MatchRun عند غياب ملكية طلب المطابقة", async () => {
    getDb.mockResolvedValue({ select: vi.fn(() => resolvedBuilder([])) });
    const caller = appRouter.createCaller(contextFor(1));
    await expect(caller.naqla2.deterministicMatching.createRun({ requestId: 77 })).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
});
