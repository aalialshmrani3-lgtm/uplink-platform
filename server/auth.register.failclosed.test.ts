import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

describe("auth.register fail-closed", () => {
  it("يرفض التسجيل غير المنفذ بدلاً من إرجاع نجاح وهمي", async () => {
    const caller = appRouter.createCaller({
      user: null,
      req: { protocol: "https", headers: {} } as TrpcContext["req"],
      res: {} as TrpcContext["res"],
    });

    await expect(caller.auth.register({
      role: "innovator",
      name: "Synthetic User",
      email: "synthetic.user@example.test",
    })).rejects.toMatchObject({
      code: "PRECONDITION_FAILED",
      message: "SELF_SERVICE_REGISTRATION_NOT_AVAILABLE",
    });
  });
});
