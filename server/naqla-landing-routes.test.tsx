// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { readFile } from "node:fs/promises";
import path from "node:path";
import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/contexts/LanguageContext", () => ({
  useLanguage: () => ({ language: "ar", isRTL: true }),
}));

vi.mock("@/const", () => ({
  getLoginUrl: () => "/login",
}));

vi.mock("@/components/LanguageSwitcher", () => ({
  LanguageSwitcher: () => null,
}));

import Home from "../client/src/pages/Home";

describe("NAQLA landing operational routes", () => {
  it("يربط كل محرك بصفحته متعددة المسارات بدلاً من حصره في مساحة العرض", () => {
    render(<Home />);

    const links = Array.from(screen.getAllByRole("link"));
    const hrefs = links.map((link) => link.getAttribute("href"));

    expect(hrefs).toContain("/naqla1");
    expect(hrefs).toContain("/naqla2");
    expect(hrefs).toContain("/naqla3");
    expect(hrefs).toContain("/dashboard");
    expect(hrefs).toContain("/profile");
    expect(screen.getByRole("link", { name: "فتح مساحة التشغيل" })).toHaveAttribute("href", "/naqla");
  });

  it("لا يستبدل المسار السليم بخطأ مهلة إقلاع", async () => {
    const source = await readFile(path.resolve(process.cwd(), "client/src/components/BootGate.tsx"), "utf8");

    expect(source).toContain('return "ready";');
    expect(source).not.toContain("BOOT_TIMEOUT");
  });

  it("لا يمرر قيمة فارغة إلى Radix Select في واجهات الإدارة", async () => {
    const [chartFilters, auditLogs] = await Promise.all([
      readFile(path.resolve(process.cwd(), "client/src/components/ChartFilters.tsx"), "utf8"),
      readFile(path.resolve(process.cwd(), "client/src/pages/AuditLogs.tsx"), "utf8"),
    ]);

    expect(chartFilters).not.toContain('SelectItem value=""');
    expect(auditLogs).not.toContain('SelectItem value=""');
  });
});
