import { describe, expect, it } from "vitest";
import { isStaleChunkError } from "../shared/staleChunkRecovery";

describe("stale chunk recovery detection", () => {
  it("recognizes stale dynamic imports without treating ordinary errors as cache failures", () => {
    expect(isStaleChunkError(new Error("Failed to fetch dynamically imported module: /assets/Home-old.js"))).toBe(true);
    expect(isStaleChunkError(new Error("Importing a module script failed."))).toBe(true);
    expect(isStaleChunkError(new Error("Validation failed"))).toBe(false);
  });
});
