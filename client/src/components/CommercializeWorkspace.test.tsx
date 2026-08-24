// @vitest-environment jsdom
import * as React from "react";
import "@testing-library/jest-dom/vitest";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";

const authState = { user: null as { id: number } | null, loading: false };
const languageState = { language: "en" as "en" | "ar" };
const query = (data: unknown) => ({ data, isLoading: false, isError: false, refetch: vi.fn() });
vi.mock("@/_core/hooks/useAuth", () => ({ useAuth: () => authState }));
vi.mock("@/contexts/LanguageContext", () => ({ useLanguage: () => languageState }));
vi.mock("@/lib/trpc", () => ({ trpc: { naqla3: { commercialize: {
  listEligibleInnovationSources: { useQuery: () => query([]) }, listEligibleEngagements: { useQuery: () => query([]) }, listAssets: { useQuery: () => query([]) }, getTransactionWorkspace: { useQuery: () => query(null) },
  createAsset: { useMutation: () => ({ isPending: false, mutate: vi.fn() }) }, createTransaction: { useMutation: () => ({ isPending: false, mutate: vi.fn() }) }, createDueDiligenceCase: { useMutation: () => ({ isPending: false, mutate: vi.fn() }) }, transitionStage: { useMutation: () => ({ isPending: false, mutate: vi.fn() }) },
} } } }));
import CommercializeWorkspace from "./CommercializeWorkspace";

afterEach(() => cleanup());
describe("CommercializeWorkspace", () => {
  it("keeps commercial data absent behind a safe sign-in boundary", () => { authState.user = null; languageState.language = "en"; render(<CommercializeWorkspace />); expect(screen.getByText("Sign in to access only authorized commercial assets and transactions.")).toBeInTheDocument(); expect(screen.queryByText("Commercialize Workspace")).not.toBeInTheDocument(); });
  it("renders human-governed workspace controls without a legal or automatic claim", () => { authState.user = { id: 1 }; languageState.language = "en"; render(<CommercializeWorkspace />); const main = screen.getByRole("main"); expect(main).toHaveAttribute("dir", "ltr"); expect(screen.getByRole("heading", { name: "Commercialize Workspace" })).toBeInTheDocument(); expect(screen.getByText(/without replacing human judgment/i)).toBeInTheDocument(); expect(screen.getByLabelText("Asset title")).toBeInTheDocument(); });
  it("preserves Arabic RTL and mobile overflow contract", () => { authState.user = { id: 1 }; languageState.language = "ar"; render(<CommercializeWorkspace />); const main = screen.getByRole("main"); expect(main).toHaveAttribute("dir", "rtl"); expect(main).toHaveClass("max-w-7xl", "overflow-x-hidden", "px-4"); expect(screen.getByRole("heading", { name: "مساحة التسويق والتنفيذ التجاري" })).toBeInTheDocument(); });
});
