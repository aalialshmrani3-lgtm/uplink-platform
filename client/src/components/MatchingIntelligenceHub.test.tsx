// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";

const authState = { user: null as { id: number } | null, loading: false };
const queryState = {
  requests: { data: [{ id: 71, title: "Synthetic energy request" }], isLoading: false, isError: false, refetch: vi.fn() },
  runs: { data: { items: [{ id: 81, ruleVersion: "naqla2-deterministic-v2" }] }, isLoading: false, isError: false, refetch: vi.fn() },
  detail: {
    data: {
      run: { ruleVersion: "naqla2-deterministic-v2", candidateCount: 1 },
      candidates: [{ id: 91, listingId: 92, title: "Synthetic energy teaser", summary: "Synthetic teaser-only opportunity.", score: 75, rankBand: "high", evidenceConfidence: "teaser_only", status: "published", disclosureScope: "teaser_only", factors: [{ factorId: "result_explanation", value: "matched_terms:energy" }] }],
      exclusions: [{ listingId: 93, reasonCode: "self_owned" }],
    },
    isLoading: false,
    isError: false,
    refetch: vi.fn(),
  },
};

vi.mock("@/_core/hooks/useAuth", () => ({ useAuth: () => authState }));
vi.mock("@/contexts/LanguageContext", () => ({ useLanguage: () => ({ language: "en" }) }));
vi.mock("@/lib/trpc", () => ({
  trpc: {
    naqla2: {
      matching: {
        getMyMatches: { useQuery: () => queryState.requests },
        request: { useMutation: () => ({ isPending: false, mutate: vi.fn() }) },
      },
      deterministicMatching: {
        listRuns: { useQuery: () => queryState.runs },
        getRun: { useQuery: () => queryState.detail },
        createRun: { useMutation: () => ({ isPending: false, mutate: vi.fn() }) },
      },
      marketplace: { requestPurchase: { useMutation: () => ({ isPending: false, mutate: vi.fn() }) } },
    },
  },
}));

import MatchingIntelligenceHub from "./MatchingIntelligenceHub";

describe("MatchingIntelligenceHub rendered integration", () => {
  it("shows only a safe sign-in state when no synthetic test user is present", () => {
    authState.user = null;
    render(<MatchingIntelligenceHub />);
    expect(screen.getByText("Sign in to access only your owned matching requests and results.")).toBeInTheDocument();
    expect(screen.queryByText("Synthetic energy teaser")).not.toBeInTheDocument();
  });

  it("renders an explainable synthetic teaser result without a human session", () => {
    authState.user = { id: 777001 };
    window.history.replaceState({}, "", "/naqla2/matching-hub?run=81");
    render(<MatchingIntelligenceHub />);
    expect(screen.getByRole("heading", { name: "Matching Intelligence Hub" })).toBeInTheDocument();
    expect(screen.getByText("Synthetic energy teaser")).toBeInTheDocument();
    expect(screen.getByText("Rule version")).toBeInTheDocument();
    expect(screen.getByText("Recorded exclusions")).toBeInTheDocument();
    expect(screen.queryByText("Interest was recorded for owner review. It does not create an engagement or pilot automatically.")).not.toBeInTheDocument();
  });
});
