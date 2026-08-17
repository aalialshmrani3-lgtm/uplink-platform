import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = process.cwd();
const pageSource = readFileSync(resolve(projectRoot, "client/src/pages/AuditStaging.tsx"), "utf8");
const appSource = readFileSync(resolve(projectRoot, "client/src/App.tsx"), "utf8");

describe("audit staging baseline", () => {
  it("registers the isolated audit route", () => {
    expect(appSource).toContain('const AuditStaging = lazy(() => import("./pages/AuditStaging"))');
    expect(appSource).toContain('<Route path="/audit" component={AuditStaging} />');
  });

  it("includes all six reviewer lenses and the energy demo story", () => {
    ["innovator", "company", "investor", "accelerator", "organizer", "admin"].forEach((role) => {
      expect(pageSource).toContain(`id: "${role}"`);
    });

    expect(pageSource).toContain("حل ذكي لإدارة كفاءة الطاقة");
    expect(pageSource).toContain("AUDIT-ENERGY-001");
    ["42%", "63%", "78%"].forEach((score) => expect(pageSource).toContain(`score: "${score}"`));
  });

  it("keeps the reviewer shell local and free of data mutations", () => {
    expect(pageSource).not.toMatch(/\btrpc\s*\./i);
    expect(pageSource).not.toMatch(/\bfetch\s*\(/i);
    expect(pageSource).not.toMatch(/useMutation/i);
    expect(pageSource).toContain("لا يوجد اتصال كتابة من صفحة التدقيق");
    expect(pageSource).toContain("لا تعرض البيئة أسرارًا");
  });
});
