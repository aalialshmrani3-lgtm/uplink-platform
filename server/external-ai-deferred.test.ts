import { afterEach, describe, expect, it } from "vitest";
import { invokeExternalModel } from "./routers";

describe("external AI deferred gate", () => {
  const priorValue = process.env.AI_EXTERNAL_PROVIDER_ENABLED;

  afterEach(() => {
    if (priorValue === undefined) delete process.env.AI_EXTERNAL_PROVIDER_ENABLED;
    else process.env.AI_EXTERNAL_PROVIDER_ENABLED = priorValue;
  });

  it("يرفض قبل dispatch عندما تكون البوابة مغلقة", async () => {
    process.env.AI_EXTERNAL_PROVIDER_ENABLED = "false";
    await expect(invokeExternalModel({ messages: [{ role: "user", content: "no dispatch" }] } as never)).rejects.toMatchObject({ code: "PRECONDITION_FAILED", message: "EXTERNAL_AI_DEFERRED" });
  });
});
