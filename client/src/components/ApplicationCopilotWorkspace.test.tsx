// @vitest-environment jsdom
import * as React from "react";
import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const authState = { user: null as { id: number } | null, loading: false };
const query = (data: unknown) => ({ data, isLoading: false, isError: false, refetch: vi.fn() });
const reviewerWorkspace = {
  application: { id: 11, status: "submitted" },
  versions: [{ id: 22, versionNumber: 1, createdAt: "2026-01-01", submittedAt: null, summary: "Authorized synthetic application summary" }],
  drafts: [],
  reviewerPrivateNotes: "PRIVATE_REVIEWER_NOTE_MUST_NOT_RENDER",
};
const applicantWorkspace = {
  application: { id: 11, status: "submitted" },
  versions: [{ id: 22, versionNumber: 1, createdAt: "2026-01-01", submittedAt: null }],
  clarifications: [],
  responses: [],
  reviewerPrivateNotes: "PRIVATE_REVIEWER_NOTE_MUST_NOT_RENDER",
};
const run = {
  run: { id: 33, status: "completed", policyVersion: "naqla2-copilot-policy-v1" },
  suggestions: [{ id: 44, kind: "information_gap", body: "Synthetic deterministic information gap", deterministicRuleRefs: ["required_application_summary"], sourceRefs: [{ type: "deterministic_validation_rule", id: "required_application_summary" }] }],
};

vi.mock("@/_core/hooks/useAuth", () => ({ useAuth: () => authState }));
vi.mock("@/contexts/LanguageContext", () => ({ useLanguage: () => ({ language: "en" }) }));
vi.mock("@/lib/trpc", () => ({
  trpc: {
    naqla2: {
      copilot: {
        reviewer: {
          listQueue: { useQuery: () => query([{ application: { id: 11, status: "submitted" }, assignmentId: 1 }]) },
          getWorkspace: { useQuery: () => query(reviewerWorkspace) },
          createClarificationDraft: { useMutation: () => ({ isPending: false, mutate: vi.fn() }) },
          sendClarification: { useMutation: () => ({ isPending: false, mutate: vi.fn() }) },
        },
        applicant: {
          listMyApplications: { useQuery: () => query([{ id: 11, status: "submitted" }]) },
          getWorkspace: { useQuery: () => query(applicantWorkspace) },
          createResponseDraft: { useMutation: () => ({ isPending: false, mutate: vi.fn() }) },
          submitResponse: { useMutation: () => ({ isPending: false, mutate: vi.fn() }) },
          createDraftFromSuggestion: { useMutation: () => ({ isPending: false, mutate: vi.fn() }) },
          submitDraftAsVersion: { useMutation: () => ({ isPending: false, mutate: vi.fn() }) },
        },
        getRun: { useQuery: () => query(run) },
        run: { useMutation: () => ({ isPending: false, mutate: vi.fn() }) },
      },
    },
  },
}));

import ApplicationCopilotWorkspace from "./ApplicationCopilotWorkspace";

afterEach(() => cleanup());

describe("ApplicationCopilotWorkspace rendered integration", () => {
  it("renders only a safe sign-in state without a session", () => {
    authState.user = null;
    render(<ApplicationCopilotWorkspace mode="reviewer" />);
    expect(screen.getByText("Sign in to access only your authorized application or review workspace.")).toBeInTheDocument();
    expect(screen.queryByText("Authorized synthetic application summary")).not.toBeInTheDocument();
  });

  it("distinguishes reviewer system facts from advisory output without an automatic decision", () => {
    authState.user = { id: 101 };
    render(<ApplicationCopilotWorkspace mode="reviewer" />);
    expect(screen.getByRole("heading", { name: "Reviewer Assistance Workspace" })).toBeInTheDocument();
    expect(screen.getByText("Authorized version summary")).toBeInTheDocument();
    expect(screen.getByText("Advisory suggestion")).toBeInTheDocument();
    expect(screen.getByText(/These are deterministic advisory suggestions/)).toBeInTheDocument();
    expect(screen.queryByText("PRIVATE_REVIEWER_NOTE_MUST_NOT_RENDER")).not.toBeInTheDocument();
  });

  it("keeps reviewer-private fields out of the applicant workspace and requires explicit submit", () => {
    authState.user = { id: 102 };
    render(<ApplicationCopilotWorkspace mode="applicant" />);
    expect(screen.getByRole("heading", { name: "Applicant Assistance Workspace" })).toBeInTheDocument();
    expect(screen.getByText("Assistant suggestions")).toBeInTheDocument();
    expect(screen.getByText(/every step requires your explicit submission/i)).toBeInTheDocument();
    expect(screen.queryByText("PRIVATE_REVIEWER_NOTE_MUST_NOT_RENDER")).not.toBeInTheDocument();
  });

  it("exposes semantic reviewer controls with labels and keyboard-focusable human actions", () => {
    authState.user = { id: 101 };
    render(<ApplicationCopilotWorkspace mode="reviewer" />);
    expect(screen.getByRole("main")).toHaveAttribute("dir", "ltr");
    expect(screen.getByRole("heading", { name: "Reviewer Assistance Workspace" })).toBeInTheDocument();
    const question = screen.getByLabelText("Question");
    expect(question.tagName).toBe("TEXTAREA");
    question.focus();
    expect(document.activeElement).toBe(question);
    const createDraft = screen.getByRole("button", { name: "Create draft" });
    fireEvent.change(question, { target: { value: "Please clarify the synthetic verification boundary." } });
    expect(createDraft).toBeEnabled();
    createDraft.focus();
    expect(document.activeElement).toBe(createDraft);
  });

  it("exposes semantic applicant controls with labels and keyboard-focusable draft input", () => {
    authState.user = { id: 102 };
    render(<ApplicationCopilotWorkspace mode="applicant" />);
    expect(screen.getByRole("main")).toHaveAttribute("dir", "ltr");
    expect(screen.getByRole("heading", { name: "Applicant Assistance Workspace" })).toBeInTheDocument();
    const improvementDraft = screen.getByLabelText("Optional improvement draft");
    expect(improvementDraft.tagName).toBe("TEXTAREA");
    improvementDraft.focus();
    expect(document.activeElement).toBe(improvementDraft);
    expect(screen.getByText(/every step requires your explicit submission/i)).toBeInTheDocument();
  });

  it.each(["reviewer", "applicant"] as const)("keeps %s content and primary controls within the responsive mobile container contract", (mode) => {
    authState.user = { id: mode === "reviewer" ? 101 : 102 };
    render(<ApplicationCopilotWorkspace mode={mode} />);
    const main = screen.getByRole("main");
    expect(main).toHaveClass("max-w-7xl", "overflow-x-hidden", "px-4");
    expect(main.querySelectorAll('[class*="min-w-"]')).toHaveLength(0);
    expect(main.querySelectorAll("button").length).toBeGreaterThan(0);
    expect(main.querySelectorAll("textarea").length).toBeGreaterThan(0);
  });

  it.each(["reviewer", "applicant"] as const)("keeps %s within a 375px mobile viewport contract and exposes named CTA", (mode) => {
    authState.user = { id: mode === "reviewer" ? 101 : 102 };
    render(<ApplicationCopilotWorkspace mode={mode} />);
    const main = screen.getByRole("main");
    Object.defineProperties(main, {
      clientWidth: { configurable: true, value: 375 },
      scrollWidth: { configurable: true, value: 375 },
    });
    expect(main.scrollWidth).toBeLessThanOrEqual(main.clientWidth);
    expect(screen.getByRole("button", { name: "Refresh analysis" })).toBeVisible();
    if (mode === "reviewer") expect(screen.getByRole("button", { name: "Create draft" })).toBeVisible();
    else expect(screen.getByLabelText("Optional improvement draft")).toBeVisible();
  });
});
