import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const pagePath = resolve(process.cwd(), "client/src/pages/AuditStaging.tsx");
const appPath = resolve(process.cwd(), "client/src/App.tsx");

describe("Audit Staging contract", () => {
  const pageSource = readFileSync(pagePath, "utf8");
  const appSource = readFileSync(appPath, "utf8");

  it("registers a dedicated /audit route", () => {
    expect(appSource).toContain('const AuditStaging = lazy(() => import("./pages/AuditStaging"))');
    expect(appSource).toContain('<Route path="/audit" component={AuditStaging} />');
  });

  it("contains the six audit role lenses and the connected energy scenario", () => {
    ["innovator", "company", "investor", "accelerator", "organizer", "admin"].forEach((role) => {
      expect(pageSource).toContain(`id: "${role}"`);
    });

    expect(pageSource).toContain("حل ذكي لإدارة كفاءة الطاقة");
    expect(pageSource).toContain("AUDIT-ENERGY-001");
    expect(pageSource).toContain('score: "42%"');
    expect(pageSource).toContain('score: "63%"');
    expect(pageSource).toContain('score: "78%"');
  });

  it("keeps the staging page read-only and free of production data calls", () => {
    expect(pageSource).not.toMatch(/\btrpc\s*\./i);
    expect(pageSource).not.toMatch(/\bfetch\s*\(/i);
    expect(pageSource).not.toMatch(/useMutation/i);
    expect(pageSource).toContain("لا يوجد اتصال كتابة من صفحة التدقيق");
    expect(pageSource).toContain("لا تعرض البيئة أسرارًا");
  });
});
