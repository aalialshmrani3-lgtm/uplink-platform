import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("Deferred administrative task logging", () => {
  it("does not emit child-process output or return it in a failure message", () => {
    const source = readFileSync(resolve(process.cwd(), "server/routers.ts"), "utf8");
    expect(source).toContain('console.log("[A/B Testing] Process output received")');
    expect(source).toContain('console.log("[Retrain] Process output received")');
    expect(source).not.toContain("[A/B Testing] ${data.toString()}");
    expect(source).not.toContain("[Retrain] ${data.toString()}");
    expect(source).not.toContain("${code}: ${errorOutput}");
  });
});
