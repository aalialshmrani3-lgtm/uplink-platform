import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TrpcContext } from "./_core/context";

const { getDb } = vi.hoisted(() => ({ getDb: vi.fn() }));
vi.mock("./db", () => ({ getDb }));

import { appRouter } from "./routers";

function contextFor(id: number): TrpcContext {
  return { user: { id, openId: `engagement-user-${id}`, email: `engagement${id}@example.com`, name: `Engagement ${id}`, loginMethod: "manus", role: "user", createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() }, req: { protocol: "https", headers: {} } as TrpcContext["req"], res: {} as TrpcContext["res"] };
}

function resolvedBuilder<T>(value: T) {
  const builder: any = { from: () => builder, where: () => builder, limit: () => Promise.resolve(value), orderBy: () => Promise.resolve(value), then: (resolve: (input: T) => unknown, reject?: (reason: unknown) => unknown) => Promise.resolve(value).then(resolve, reject) };
  return builder;
}

describe("NAQLA2 engagement and pilot authorization", () => {
  beforeEach(() => vi.clearAllMocks());

  it("يرفض إنشاء Engagement دون Interest مقبولة يملكها الطالب", async () => {
    getDb.mockResolvedValue({ select: vi.fn(() => resolvedBuilder([])) });
    await expect(appRouter.createCaller(contextFor(1)).naqla2.engagements.establish({ interestRequestId: 8 })).rejects.toMatchObject({ code: "PRECONDITION_FAILED" });
  });

  it("يرفض إنشاء Pilot لحساب ليس طرفاً في Engagement", async () => {
    getDb.mockResolvedValue({ select: vi.fn(() => resolvedBuilder([{ id: 4, ownerUserId: 2, requesterUserId: 3, status: "established" }])) });
    await expect(appRouter.createCaller(contextFor(1)).naqla2.engagements.createPilot({ engagementId: 4, scope: "Synthetic pilot scope for a governed human review workflow." })).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("يسمح لمالك Interest مقبولة بإنشاء Engagement دون عقد أو دفع", async () => {
    const values = vi.fn(() => ({ $returningId: vi.fn().mockResolvedValue([{ id: 17 }]) }));
    getDb.mockResolvedValue({ select: vi.fn(() => resolvedBuilder([{ id: 8, ownerUserId: 1, requesterUserId: 2, status: "accepted" }])), insert: vi.fn(() => ({ values })) });
    await expect(appRouter.createCaller(contextFor(1)).naqla2.engagements.establish({ interestRequestId: 8 })).resolves.toMatchObject({ engagementId: 17, status: "established" });
  });
});
