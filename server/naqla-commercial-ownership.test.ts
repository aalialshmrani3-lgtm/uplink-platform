import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TrpcContext } from "./_core/context";

const { getDb } = vi.hoisted(() => ({ getDb: vi.fn() }));
vi.mock("./db", () => ({ getDb }));

import { appRouter } from "./routers";

function context(): TrpcContext {
  return {
    user: { id: 7, openId: "commercial-owner", email: "owner@example.com", name: "Commercial Owner", loginMethod: "manus", role: "user", createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("NAQLA commercial ownership updates", () => {
  beforeEach(() => vi.clearAllMocks());

  it("يرفض تحديث أصل تجاري عندما لا تؤثر عبارة الملكية في أي صف", async () => {
    const where = vi.fn().mockResolvedValue({ affectedRows: 0 });
    getDb.mockResolvedValue({ update: vi.fn(() => ({ set: () => ({ where }) })) });
    await expect(appRouter.createCaller(context()).naqla3.commercial.setAssetStatus({ assetId: 17, status: "archived" })).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("يسمح بالتحديث عندما تؤكد نتيجة MySQL أن صف المالك وحده تغير", async () => {
    const where = vi.fn().mockResolvedValue({ affectedRows: 1 });
    getDb.mockResolvedValue({ update: vi.fn(() => ({ set: () => ({ where }) })) });
    await expect(appRouter.createCaller(context()).naqla3.commercial.setAssetStatus({ assetId: 17, status: "archived" })).resolves.toEqual({ success: true, status: "archived" });
  });

  it("يرفض تحديث معاملة عندما لا تؤثر عبارة initiator في أي صف", async () => {
    const where = vi.fn().mockResolvedValue({ rowsAffected: 0 });
    getDb.mockResolvedValue({ update: vi.fn(() => ({ set: () => ({ where }) })) });
    await expect(appRouter.createCaller(context()).naqla3.commercial.setTransactionStatus({ transactionId: 29, status: "cancelled" })).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("يسمح بتحديث معاملة يملكها initiator عندما يتغير صف واحد", async () => {
    const where = vi.fn().mockResolvedValue({ rowsAffected: 1 });
    getDb.mockResolvedValue({ update: vi.fn(() => ({ set: () => ({ where }) })) });
    await expect(appRouter.createCaller(context()).naqla3.commercial.setTransactionStatus({ transactionId: 29, status: "human_review", humanReviewNote: "Manual review only" })).resolves.toMatchObject({ success: true, status: "human_review" });
  });
});
