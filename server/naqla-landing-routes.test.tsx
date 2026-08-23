// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { readFile } from "node:fs/promises";
import path from "node:path";
import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { LanguageProvider } from "../client/src/contexts/LanguageContext";

vi.mock("@/const", () => ({
  getLoginUrl: () => "/login",
}));

vi.mock("@/components/LanguageSwitcher", () => ({
  LanguageSwitcher: () => null,
}));

vi.mock("@/components/SEOHead", () => ({ default: () => null }));
vi.mock("@/components/NotificationCenter", () => ({ NotificationCenter: () => null }));
vi.mock("@/components/ImprovedFooter", () => ({ default: () => null }));
vi.mock("@/components/InnovationHubsSection", () => ({ InnovationHubsSection: () => null }));
vi.mock("@/components/ClassificationPathsSection", () => ({ ClassificationPathsSection: () => null }));
vi.mock("@/components/StrategicPartnersSection", () => ({ StrategicPartnersSection: () => null }));
vi.mock("@/components/ValueFootprintsSection", () => ({ ValueFootprintsSection: () => null }));

vi.mock("@/_core/hooks/useAuth", () => ({
  useAuth: () => ({ user: null, loading: false, isAuthenticated: false, logout: vi.fn() }),
}));

import Home from "../client/src/pages/Home";
import { shouldUsePlatformShell } from "../client/src/lib/platformRoutes";

describe("NAQLA landing operational routes", () => {
  it("يربط كل محرك بصفحته متعددة المسارات بدلاً من حصره في مساحة العرض", () => {
    render(<LanguageProvider><Home /></LanguageProvider>);

    const links = Array.from(screen.getAllByRole("link"));
    const hrefs = links.map((link) => link.getAttribute("href"));

    expect(hrefs).toContain("/naqla1");
    expect(hrefs).toContain("/naqla2");
    expect(hrefs).toContain("/naqla3");
    expect(hrefs).toContain("/dashboard");
    expect(hrefs).toContain("/profile");
    expect(hrefs).toContain("/unified-dashboard");
    expect(hrefs).toContain("/innovation-pipeline");
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

  it("يحمّل landing المرجعية الكاملة ويغلف المسارات التشغيلية بـshell داخلي", async () => {
    const [home, app, sidebar, platformShell, dashboardLayout] = await Promise.all([
      readFile(path.resolve(process.cwd(), "client/src/pages/Home.tsx"), "utf8"),
      readFile(path.resolve(process.cwd(), "client/src/App.tsx"), "utf8"),
      readFile(path.resolve(process.cwd(), "client/src/components/InternalSidebar.tsx"), "utf8"),
      readFile(path.resolve(process.cwd(), "client/src/components/PlatformShell.tsx"), "utf8"),
      readFile(path.resolve(process.cwd(), "client/src/components/DashboardLayout.tsx"), "utf8"),
    ]);

    expect(home).toContain("<InnovationHubsSection />");
    expect(home).toContain('href="/unified-dashboard"');
    expect(app).toContain("<PlatformShell>{routes}</PlatformShell>");
    expect(platformShell).toContain("<ReferenceDashboardShell>");
    expect(dashboardLayout).toContain("export function ReferenceDashboardShell");
    expect(sidebar).toContain('href: "/naqla1"');
    expect(sidebar).toContain('href: "/naqla2"');
    expect(sidebar).toContain('href: "/naqla3"');
    expect(sidebar).toContain('href: "/admin/dashboard"');
  });

  it("يغلف shell كل المسارات الداخلية الأساسية ولا يغلف صفحات الدخول والتسويق", () => {
    [
      "/dashboard", "/organizations/dashboard", "/admin/dashboard", "/admin/audit-logs", "/user/settings",
      "/naqla", "/naqla1", "/naqla1/passport", "/naqla2", "/naqla2/matching-hub", "/naqla3", "/naqla3/marketplace",
    ].forEach((pathName) => expect(shouldUsePlatformShell(pathName)).toBe(true));

    ["/", "/login", "/register/innovator", "/privacy", "/three-engines"].forEach((pathName) => {
      expect(shouldUsePlatformShell(pathName)).toBe(false);
    });
  });
});
