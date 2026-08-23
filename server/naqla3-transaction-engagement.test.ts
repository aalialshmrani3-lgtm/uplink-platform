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

function selectResult(rows: unknown[]) {
  return { from: () => ({ where: () => ({ limit: vi.fn().mockResolvedValue(rows) }) }) };
}

describe("NAQLA3 transaction engagement authorization", () => {
  beforeEach(() => vi.clearAllMocks());

  it("ينشئ معاملة من Engagement قائمة ويشتق الطرف المقابل بدلاً من قبوله من العميل", async () => {
    const values = vi.fn().mockReturnValue({ $returningId: vi.fn().mockResolvedValue([{ id: 91 }]) });
    const select = vi.fn()
      .mockReturnValueOnce(selectResult([{ id: 30, status: "contract_ready" }]))
      .mockReturnValueOnce(selectResult([{ ownerUserId: 7, requesterUserId: 18, status: "established" }]));
    getDb.mockResolvedValue({ select, insert: vi.fn(() => ({ values })) });

    await expect(appRouter.createCaller(context()).naqla3.commercial.createTransaction({ assetId: 30, engagementId: 44 })).resolves.toMatchObject({ transactionId: 91, engagementId: 44, status: "initiated" });
    expect(values).toHaveBeenCalledWith(expect.objectContaining({ assetId: 30, engagementId: 44, initiatorUserId: 7, counterpartyUserId: 18, status: "initiated" }));
  });

  it("يرفض Engagement لا تخص initiator أو ليست established", async () => {
    const select = vi.fn()
      .mockReturnValueOnce(selectResult([{ id: 30, status: "contract_ready" }]))
      .mockReturnValueOnce(selectResult([{ ownerUserId: 11, requesterUserId: 18, status: "established" }]));
    getDb.mockResolvedValue({ select, insert: vi.fn() });

    await expect(appRouter.createCaller(context()).naqla3.commercial.createTransaction({ assetId: 30, engagementId: 44 })).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
});
