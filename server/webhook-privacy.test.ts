import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("Webhook operational logging", () => {
  it("uses a bounded error code instead of raw remote error text", () => {
    const source = readFileSync(resolve(process.cwd(), "server/webhook_service.ts"), "utf8");
    expect(source).toContain("const errorMessage = 'delivery_failed'");
    expect(source).not.toContain("error.response?.data?.message || error.message");
    expect(source).toContain("[Webhooks] Unable to schedule webhook delivery");
  });
});
