import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TrpcContext } from "./_core/context";

const { getDb } = vi.hoisted(() => ({ getDb: vi.fn() }));
vi.mock("./db", () => ({ getDb }));

import { appRouter } from "./routers";

function context(): TrpcContext {
  return {
    user: { id: 8, openId: "listing-owner", email: "listing@example.com", name: "Listing Owner", loginMethod: "manus", role: "user", createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("NAQLA2 listing ownership updates", () => {
  beforeEach(() => vi.clearAllMocks());

  it("يرفض نشر أو سحب قائمة عندما لا تؤثر عبارة الملكية في أي صف", async () => {
    const where = vi.fn().mockResolvedValue({ affectedRows: 0 });
    getDb.mockResolvedValue({ update: vi.fn(() => ({ set: () => ({ where }) })) });
    await expect(appRouter.createCaller(context()).naqla2.marketplace.setListingStatus({ listingId: 31, status: "published" })).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("يسمح بتغيير حالة قائمة مملوكة عندما تؤكد نتيجة MySQL التأثير", async () => {
    const where = vi.fn().mockResolvedValue({ affectedRows: 1 });
    getDb.mockResolvedValue({ update: vi.fn(() => ({ set: () => ({ where }) })) });
    await expect(appRouter.createCaller(context()).naqla2.marketplace.setListingStatus({ listingId: 31, status: "paused" })).resolves.toEqual({ success: true, status: "paused" });
  });
});
