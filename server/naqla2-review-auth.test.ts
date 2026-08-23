import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TrpcContext } from "./_core/context";

const { getDb } = vi.hoisted(() => ({ getDb: vi.fn() }));
vi.mock("./db", () => ({ getDb }));

import { appRouter } from "./routers";

function contextFor(id: number): TrpcContext {
  return {
    user: { id, openId: `review-user-${id}`, email: `reviewer${id}@example.com`, name: `Reviewer ${id}`, loginMethod: "manus", role: "user", createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

function resolvedBuilder<T>(value: T) {
  const builder: any = { from: () => builder, where: () => builder, limit: () => Promise.resolve(value), orderBy: () => Promise.resolve(value), innerJoin: () => builder, then: (resolve: (value: T) => unknown, reject?: (reason: unknown) => unknown) => Promise.resolve(value).then(resolve, reject) };
  return builder;
}

describe("NAQLA2 review authorization", () => {
  beforeEach(() => vi.clearAllMocks());

  it("يرفض تسجيل مراجعة دون إسناد مراجع نشط", async () => {
    getDb.mockResolvedValue({ select: vi.fn(() => resolvedBuilder([])) });
    const caller = appRouter.createCaller(contextFor(8));
    await expect(caller.naqla2.vetting.submitReview({ ipRegistrationId: 71, recommendation: "approve", comments: "مراجعة بشرية موثقة كافية للاختبار." })).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("يسمح للمالك بإسناد مراجع آخر ولا يسمح بإسناد نفسه", async () => {
    const returningId = vi.fn().mockResolvedValue([{ id: 14 }]);
    const values = vi.fn(() => ({ $returningId: returningId }));
    getDb.mockResolvedValue({ select: vi.fn(() => resolvedBuilder([{ id: 71 }])), insert: vi.fn(() => ({ values })) });
    const owner = appRouter.createCaller(contextFor(4));
    await expect(owner.naqla2.vetting.assignReviewer({ ipRegistrationId: 71, reviewerUserId: 8 })).resolves.toEqual({ assignmentId: 14, status: "active" });
    await expect(owner.naqla2.vetting.assignReviewer({ ipRegistrationId: 71, reviewerUserId: 4 })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });
});
