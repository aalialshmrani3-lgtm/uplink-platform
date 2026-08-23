import { describe, expect, it } from "vitest";
import type { TrpcContext } from "./_core/context";
import { appRouter } from "./routers";

function context(): TrpcContext {
  return {
    user: { id: 5, openId: "contract-test-user", email: "contract@example.com", name: "Contract Test", loginMethod: "manus", role: "user", createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("NAQLA3 contract placeholder routes", () => {
  it("يرفض إنشاء عقد بدل إرجاع نجاح وهمي", async () => {
    const caller = appRouter.createCaller(context());
    await expect(caller.naqla3.contracts.create({ title: "اتفاق تجريبي", description: "وصف تجريبي يفي بحد الطول للتحقق فقط.", partyB: 9, totalAmount: "100", currency: "SAR" })).rejects.toMatchObject({ code: "PRECONDITION_FAILED" });
  });

  it("يرفض قراءة سجل عقد غير مهيأ بدل إرجاع قائمة فارغة مضللة", async () => {
    const caller = appRouter.createCaller(context());
    await expect(caller.naqla3.contracts.getMyContracts()).rejects.toMatchObject({ code: "PRECONDITION_FAILED" });
  });
});
