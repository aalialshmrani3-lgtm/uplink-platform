// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

let contextsResult: { data: unknown[] | undefined; isLoading: boolean; isError: boolean; refetch: ReturnType<typeof vi.fn> };
let activeLanguage: "ar" | "en" = "ar";
const refetch = vi.fn();
const mutation = { isPending: false, mutate: vi.fn() };

vi.mock("@/contexts/LanguageContext", () => ({
  useLanguage: () => ({ language: activeLanguage, isRTL: activeLanguage === "ar", setLanguage: vi.fn() }),
}));

vi.mock("@/_core/hooks/useAuth", () => ({
  useAuth: () => ({ user: { id: 9, name: "Synthetic Tester", email: "tester@example.com" } }),
}));

vi.mock("@/lib/trpc", () => ({
  trpc: {
    organizationContext: {
      myContexts: { useQuery: () => contextsResult },
      myPendingInvitations: { useQuery: () => ({ data: [], isLoading: false, isError: false, refetch }) },
      create: { useMutation: () => mutation },
      setActive: { useMutation: () => mutation },
      invite: { useMutation: () => mutation },
      acceptInvitation: { useMutation: () => mutation },
    },
    cr01: {
      getBundle: { useQuery: () => ({ data: undefined, isLoading: false, isError: false }) },
      createEnergyDemo: { useMutation: () => mutation },
    },
    naqla1Qualification: {
      getMyRecords: { useQuery: () => ({ data: [], isLoading: false, isError: false, refetch }) },
      getPassport: { useQuery: () => ({ data: null, isLoading: false, isError: false, refetch }) },
      createRecord: { useMutation: () => mutation },
      addEvidence: { useMutation: () => mutation },
      createImmutableVersion: { useMutation: () => mutation },
      assess: { useMutation: () => mutation },
    },
    naqla2: {
      marketplace: {
        getApprovedIPs: { useQuery: () => ({ data: [{ id: 1, title: "Synthetic teaser", summary: "A synthetic teaser that discloses no private evidence." }], isLoading: false, isError: false }) },
        requestPurchase: { useMutation: () => mutation },
      },
      deterministicMatching: {
        getMyRuns: { useQuery: () => ({ data: [], isLoading: false, isError: false, refetch }) },
        getRun: { useQuery: () => ({ data: null, isLoading: false, isError: false, refetch }) },
        createRun: { useMutation: () => mutation },
      },
      matching: {
        getMyMatches: { useQuery: () => ({ data: [], isLoading: false, isError: false, refetch }) },
        request: { useMutation: () => mutation },
      },
      applications: {
        getMyApplications: { useQuery: () => ({ data: [], isLoading: false, isError: false, refetch }) },
        create: { useMutation: () => mutation },
        createImmutableVersion: { useMutation: () => mutation },
        submit: { useMutation: () => mutation },
      },
      engagements: {
        getMyInterestRequests: { useQuery: () => ({ data: [], isLoading: false, isError: false, refetch }) },
        getMyEngagements: { useQuery: () => ({ data: [], isLoading: false, isError: false, refetch }) },
        setInterestStatus: { useMutation: () => mutation },
        establish: { useMutation: () => mutation },
        createPilot: { useMutation: () => mutation },
      },
    },
    naqla3: {
      commercial: {
        getMyAssets: { useQuery: () => ({ data: [], isLoading: false, isError: false, refetch }) },
        getMyTransactions: { useQuery: () => ({ data: [], isLoading: false, isError: false }) },
        createAsset: { useMutation: () => mutation },
        setAssetStatus: { useMutation: () => mutation },
      },
    },
  },
}));

import NaqlaJourneyWorkspace from "@/pages/NaqlaJourneyWorkspace";

describe("NAQLA workspace behavioral accessibility", () => {
  beforeEach(() => {
    activeLanguage = "ar";
    contextsResult = { data: [], isLoading: false, isError: false, refetch };
    mutation.mutate.mockReset();
  });

  afterEach(cleanup);

  it("يوفر أسماء وصول ويتحرك بالتركيز من تبديل اللغة إلى اختيار الدور", async () => {
    const user = userEvent.setup();
    render(<NaqlaJourneyWorkspace />);
    const languageButton = screen.getByRole("button", { name: "English" });
    const roleSelect = screen.getByRole("combobox", { name: "دور العرض الاصطناعي" });
    const interestInput = screen.getByRole("textbox", { name: "رسالة اهتمام" });
    expect(interestInput).toBeEnabled();
    for (let index = 0; index < 12 && document.activeElement !== languageButton; index += 1) await user.tab();
    expect(languageButton).toHaveFocus();
    for (let index = 0; index < 12 && document.activeElement !== roleSelect; index += 1) await user.tab();
    expect(roleSelect).toHaveFocus();
  });

  it("يعرض حالات loading وerror وempty الفعلية للسياق الخادمي", () => {
    contextsResult = { data: undefined, isLoading: true, isError: false, refetch };
    const loading = render(<NaqlaJourneyWorkspace />);
    expect(screen.getByText("جار تحميل السياق…")).toBeInTheDocument();
    loading.unmount();

    contextsResult = { data: undefined, isLoading: false, isError: true, refetch };
    const failed = render(<NaqlaJourneyWorkspace />);
    expect(screen.getByText("تعذر تحميل السياق")).toBeInTheDocument();
    failed.unmount();

    contextsResult = { data: [], isLoading: false, isError: false, refetch };
    render(<NaqlaJourneyWorkspace />);
    expect(screen.getByText("لا يوجد سياق خادمي")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "إنشاء سياق عرض خادمي" })).toBeEnabled();
  });

  it("يعرض الواجهة الإنجليزية باتجاه LTR عند اختيار الإنجليزية", () => {
    activeLanguage = "en";
    render(<NaqlaJourneyWorkspace />);
    expect(screen.getByRole("main")).toHaveAttribute("dir", "ltr");
    expect(screen.getByRole("combobox", { name: "Synthetic demo role" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "Create server demo context" })).toBeEnabled();
  });
});
