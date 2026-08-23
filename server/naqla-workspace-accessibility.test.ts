import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("NAQLA workspace accessibility baseline", () => {
  const source = readFileSync(resolve(process.cwd(), "client/src/pages/NaqlaJourneyWorkspace.tsx"), "utf8");

  it("يسمي مدخل الاهتمام ويعرض مرئيات تركيز لعناصر التحكم التفاعلية", () => {
    expect(source).toContain('aria-label={copy("رسالة اهتمام", "Interest message", isArabic)}');
    expect(source).toContain("focus:ring-2");
    expect(source).toContain('type="button"');
  });

  it("يعرض حالات التعطيل أثناء mutation وحالات loading/error/empty للسياق", () => {
    expect(source).toContain("isPending");
    expect(source).toContain("contextsQuery.isLoading");
    expect(source).toContain("contextsQuery.isError");
    expect(source).toContain("لا يوجد سياق خادمي");
  });
});
