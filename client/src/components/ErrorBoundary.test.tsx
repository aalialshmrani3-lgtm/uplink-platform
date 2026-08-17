import { describe, expect, it } from "vitest";

describe("Boot recovery copy", () => {
  it("uses an actionable Arabic workspace recovery message", async () => {
    const source = await import("node:fs/promises").then((fs) => fs.readFile(new URL("./ErrorBoundary.tsx", import.meta.url), "utf8"));
    expect(source).toContain("تعذر تجهيز مساحة العمل");
    expect(source).toContain("إعادة المحاولة");
    expect(source).toContain("العودة لاختيار السياق");
  });
});
