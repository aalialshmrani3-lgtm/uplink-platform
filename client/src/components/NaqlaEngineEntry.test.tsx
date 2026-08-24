// @vitest-environment jsdom
import React from "react";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { NaqlaEngineEntry } from "./NaqlaEngineEntry";

const setLocation = vi.fn();
let user: { id: number } | null = null;

vi.mock("wouter", () => ({
  Link: ({ href, children, ...props }: { href: string; children: React.ReactNode }) => <a href={href} {...props}>{children}</a>,
  useLocation: () => ["/", setLocation],
}));
vi.mock("@/_core/hooks/useAuth", () => ({ useAuth: () => ({ user }) }));
vi.mock("@/contexts/LanguageContext", () => ({ useLanguage: () => ({ language: "ar" }) }));
vi.mock("@/const", () => ({ getLoginUrl: () => "/login" }));

afterEach(() => { cleanup(); setLocation.mockReset(); user = null; });

describe("NaqlaEngineEntry", () => {
  it("يعرض حاجز تسجيل دخول آمنًا دون بيانات تجريبية أو إجراء تشغيلي للزائر", () => {
    render(<NaqlaEngineEntry engine="qualify" />);
    expect(screen.getByRole("heading", { name: "سجل الابتكار والأدلة ضمن مساحة مصرح بها." })).not.toBeNull();
    expect(screen.getByText("لا تُعرض بيانات مقيدة أو مؤشرات تجريبية في المدخل العام.")).not.toBeNull();
    expect(screen.getByRole("link", { name: "تسجيل الدخول الآمن" }).getAttribute("href")).toBe("/login");
    expect(screen.queryByText(/إنشاء سجل/)).toBeNull();
    expect(screen.queryByText(/استعرض الأفكار/)).toBeNull();
  });

  it("يحول العضو المصادق فقط إلى المساحة الحاكمة الملائمة للمحرك", async () => {
    user = { id: 42 };
    render(<NaqlaEngineEntry engine="connect" />);
    await waitFor(() => expect(setLocation).toHaveBeenCalledWith("/naqla2/matching-hub"));
  });
});
