// @vitest-environment jsdom
import * as React from "react";
import "@testing-library/jest-dom/vitest";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";

const authState = { user: null as { id: number } | null, loading: false };
const languageState = { language: "en" as "en" | "ar" };
const workspaceState = { data: null as any };
const query = (data: unknown) => ({ data, isLoading: false, isError: false, refetch: vi.fn() });
vi.mock("@/_core/hooks/useAuth", () => ({ useAuth: () => authState }));
vi.mock("@/contexts/LanguageContext", () => ({ useLanguage: () => languageState }));
vi.mock("@/lib/trpc", () => ({ trpc: { naqla3: { commercialize: {
  listEligibleInnovationSources: { useQuery: () => query([]) }, listEligibleEngagements: { useQuery: () => query([]) }, listAssets: { useQuery: () => query([]) }, getTransactionWorkspace: { useQuery: () => query(workspaceState.data) }, listTransactionParticipants: { useQuery: () => query([{ userId: 2, organizationId: 3, role: "counterparty" }]) },
  createAsset: { useMutation: () => ({ isPending: false, mutate: vi.fn() }) }, createTransaction: { useMutation: () => ({ isPending: false, mutate: vi.fn() }) }, createDueDiligenceCase: { useMutation: () => ({ isPending: false, mutate: vi.fn() }) }, createDueDiligenceRequest: { useMutation: () => ({ isPending: false, mutate: vi.fn() }) }, completeDueDiligence: { useMutation: () => ({ isPending: false, mutate: vi.fn() }) }, transitionStage: { useMutation: () => ({ isPending: false, mutate: vi.fn() }) }, createTermSheet: { useMutation: () => ({ isPending: false, mutate: vi.fn() }) }, createAgreementRecord: { useMutation: () => ({ isPending: false, mutate: vi.fn() }) }, createExecutionPlan: { useMutation: () => ({ isPending: false, mutate: vi.fn() }) }, recordScaleDecision: { useMutation: () => ({ isPending: false, mutate: vi.fn() }) },
} } } }));
import CommercializeWorkspace from "./CommercializeWorkspace";

afterEach(() => cleanup());
describe("CommercializeWorkspace", () => {
  it("keeps commercial data absent behind a safe sign-in boundary", () => { authState.user = null; languageState.language = "en"; render(<CommercializeWorkspace />); expect(screen.getByText("Sign in to access only authorized commercial assets and transactions.")).toBeInTheDocument(); expect(screen.queryByText("Commercialize Workspace")).not.toBeInTheDocument(); });
  it("renders human-governed workspace controls without a legal or automatic claim", () => { authState.user = { id: 1 }; languageState.language = "en"; render(<CommercializeWorkspace />); const main = screen.getByRole("main"); expect(main).toHaveAttribute("dir", "ltr"); expect(screen.getByRole("heading", { name: "Commercialize Workspace" })).toBeInTheDocument(); expect(screen.getByText(/without replacing human judgment/i)).toBeInTheDocument(); expect(screen.getByLabelText("Asset title")).toBeInTheDocument(); });
  it("preserves Arabic RTL and mobile overflow contract", () => { authState.user = { id: 1 }; languageState.language = "ar"; render(<CommercializeWorkspace />); const main = screen.getByRole("main"); expect(main).toHaveAttribute("dir", "rtl"); expect(main).toHaveClass("max-w-7xl", "overflow-x-hidden", "px-4"); expect(screen.getByRole("heading", { name: "مساحة التسويق والتنفيذ التجاري" })).toBeInTheDocument(); });
  it("mounts human contract actions inside an authorized transaction workspace", () => { authState.user = { id: 1 }; languageState.language = "en"; workspaceState.data = { transaction: { stage: "contract", transitionVersion: 3 }, participant: { capabilities: ["manage_due_diligence"] }, dueDiligence: { id: 1 }, termSheet: { id: 2 } }; window.history.pushState({}, "", "/naqla3/transactions/77"); render(<CommercializeWorkspace />); expect(screen.getByRole("heading", { name: "Contract" })).toBeInTheDocument(); expect(screen.getByRole("button", { name: "Save term draft" })).toBeInTheDocument(); expect(screen.getByText(/creates no automatic contract/i)).toBeInTheDocument(); workspaceState.data = null; });
  it("mounts participant-bound Due Diligence actions inside an authorized transaction workspace", () => { authState.user = { id: 1 }; languageState.language = "en"; workspaceState.data = { transaction: { stage: "due_diligence", transitionVersion: 2 }, participant: { capabilities: ["request_information"] }, dueDiligence: { id: 1 }, termSheet: null }; window.history.pushState({}, "", "/naqla3/transactions/77"); render(<CommercializeWorkspace />); expect(screen.getByRole("heading", { name: "Due Diligence" })).toBeInTheDocument(); expect(screen.getByLabelText("Authorized recipient")).toBeInTheDocument(); expect(screen.getByRole("button", { name: "Send information request" })).toBeInTheDocument(); workspaceState.data = null; });
});
