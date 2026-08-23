import { describe, expect, it } from "vitest";
import { applyDocumentNoStore, DOCUMENT_CACHE_CONTROL } from "./_core/vite";

describe("HTML and SPA cache policy", () => {
  it("marks document responses as no-store while leaving asset policy separate", () => {
    const headers = new Map<string, string>();
    applyDocumentNoStore({
      setHeader(name: string, value: number | string | readonly string[]) {
        headers.set(name, Array.isArray(value) ? value.join(",") : String(value));
        return this as never;
      },
    });

    expect(headers.get("Cache-Control")).toBe(DOCUMENT_CACHE_CONTROL);
    expect(headers.get("Pragma")).toBe("no-cache");
    expect(headers.get("Expires")).toBe("0");
    expect(DOCUMENT_CACHE_CONTROL).toContain("no-store");
  });
});
