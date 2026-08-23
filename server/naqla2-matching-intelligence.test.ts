import { describe, expect, it } from "vitest";
import { MATCHING_RULE_VERSION, classifyListingEligibility, createDeterministicTeaserMatch, stableMatchFingerprint } from "./naqla2/matching-intelligence";

describe("NAQLA2 Phase 2.2C deterministic matching intelligence", () => {
  it("is reproducible for equivalent terms regardless of their input order", () => {
    const first = createDeterministicTeaserMatch("energy optimization", "Energy optimization", "Published teaser");
    const second = createDeterministicTeaserMatch("optimization energy", "Energy optimization", "Published teaser");
    expect(first).toEqual(second);
    expect(first.rankBand).toBe("high");
    expect(first.factors).toEqual(expect.arrayContaining([expect.objectContaining({ factorId: "evidence_confidence", evidenceReferences: [] })]));
  });

  it("keeps rank-band boundaries and zero evidence explicit", () => {
    expect(createDeterministicTeaserMatch("alpha beta gamma delta", "alpha beta", "teaser").rankBand).toBe("medium");
    expect(createDeterministicTeaserMatch("water agriculture", "Energy", "teaser")).toMatchObject({ score: 0, rankBand: "low", evidenceConfidence: "teaser_only" });
  });

  it("returns a stable replay key for one request, context, and frozen rule", () => {
    expect(stableMatchFingerprint({ requestId: 9, activeContextId: 4, queryText: "energy optimization" })).toBe(stableMatchFingerprint({ requestId: 9, activeContextId: 4, queryText: "optimization energy", ruleVersion: MATCHING_RULE_VERSION }));
  });

  it("hard-filters self-owned, stale, and non-teaser listings without making a recommendation", () => {
    expect(classifyListingEligibility({ ownerUserId: 1, requesterUserId: 1, status: "published", disclosureScope: "teaser_only" })).toMatchObject({ eligible: false, reasonCode: "self_owned" });
    expect(classifyListingEligibility({ ownerUserId: 2, requesterUserId: 1, status: "draft", disclosureScope: "teaser_only" })).toMatchObject({ eligible: false, reasonCode: "not_published" });
    expect(classifyListingEligibility({ ownerUserId: 2, requesterUserId: 1, status: "withdrawn", disclosureScope: "teaser_only" })).toMatchObject({ eligible: false, reasonCode: "not_published" });
    expect(classifyListingEligibility({ ownerUserId: 2, requesterUserId: 1, status: "published", disclosureScope: "authorized_disclosure" })).toMatchObject({ eligible: false, reasonCode: "disclosure_not_teaser" });
  });
});
