import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("WebSocket operational logging", () => {
  it("does not log client message payloads or user identifiers", () => {
    const source = readFileSync(resolve(process.cwd(), "server/websocket.ts"), "utf8");
    expect(source).not.toContain("Received message:");
    expect(source).not.toContain("for user ${client.userId");
    expect(source).not.toContain("User ${userId");
    expect(source).not.toContain("Sent notification to user ${userId}");
    expect(source).toContain("[WebSocket] Ignored an invalid client message");
  });
});
