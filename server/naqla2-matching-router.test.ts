import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TrpcContext } from "./_core/context";

const { getDb } = vi.hoisted(() => ({ getDb: vi.fn() }));
vi.mock("./db", () => ({ getDb }));

import { appRouter } from "./routers";

function contextFor(id: number): TrpcContext {
  return { user: { id, openId: `request-user-${id}`, email: `request${id}@example.com`, name: `Request ${id}`, loginMethod: "manus", role: "user", createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() }, req: { protocol: "https", headers: {} } as TrpcContext["req"], res: {} as TrpcContext["res"] };
}

describe("NAQLA2 matching request router", () => {
  beforeEach(() => vi.clearAllMocks());

  it("يحفظ طلب المطابقة ولا يعيد مطابقات أو درجات وهمية", async () => {
    const values = vi.fn(() => ({ $returningId: vi.fn().mockResolvedValue([{ id: 41 }]) }));
    getDb.mockResolvedValue({ insert: vi.fn(() => ({ values })) });
    const caller = appRouter.createCaller(contextFor(1));
    await expect(caller.naqla2.matching.request({ seekingType: "partner", requirements: "Need a governed technical partnership for a synthetic pilot." })).resolves.toMatchObject({ requestId: 41, status: "active" });
    await expect(caller.naqla2.matching.getMatches()).resolves.toEqual([]);
  });

  it("يحجب قبول أو رفض المطابقة حتى يوجد Engagement محكوم", async () => {
    const caller = appRouter.createCaller(contextFor(1));
    await expect(caller.naqla2.matching.accept({ matchId: 9 })).rejects.toMatchObject({ code: "PRECONDITION_FAILED" });
    await expect(caller.naqla2.matching.reject({ matchId: 9 })).rejects.toMatchObject({ code: "PRECONDITION_FAILED" });
  });
});
