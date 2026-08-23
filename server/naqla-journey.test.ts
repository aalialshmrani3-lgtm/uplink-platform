import { describe, expect, it } from "vitest";
import { INITIAL_JOURNEY_STATE, advanceJourney, applyJourneyControl, canAdvanceJourney, personaCanReviewEvidence } from "../shared/naqlaJourney";

describe("NAQLA deterministic journey", () => {
  it("enforces evidence authorization and immutable application versioning before dependent transitions", () => {
    let state = INITIAL_JOURNEY_STATE;
    expect(canAdvanceJourney(state)).toBe(false);
    state = applyJourneyControl(state, "save_record_version");
    expect(canAdvanceJourney(state)).toBe(true);
    state = advanceJourney(state);
    expect(state.stage).toBe("evidence");
    expect(canAdvanceJourney(state)).toBe(false);

    state = applyJourneyControl(state, "authorize_evidence");
    state = advanceJourney(state);
    expect(state.stage).toBe("evaluate");
    expect(canAdvanceJourney(state)).toBe(false);
    state = applyJourneyControl(state, "evaluate_readiness");
    state = advanceJourney(state);
    expect(state.stage).toBe("improve");
    state = applyJourneyControl(state, "address_gaps");
    state = advanceJourney(state);
    expect(state.stage).toBe("qualify");
    state = applyJourneyControl(state, "qualify_record");
    state = advanceJourney(state);
    expect(state.stage).toBe("route");

    state = { ...state, stage: "match" };
    expect(canAdvanceJourney(state)).toBe(false);
    state = applyJourneyControl(state, "generate_match_run");
    state = advanceJourney(state);
    expect(state.stage).toBe("apply");
    expect(canAdvanceJourney(state)).toBe(false);
    state = applyJourneyControl(state, "create_application_version");
    expect(canAdvanceJourney(state)).toBe(true);
  });

  it("does not grant evidence review to investor or government personas by implication", () => {
    expect(personaCanReviewEvidence("investor")).toBe(false);
    expect(personaCanReviewEvidence("government")).toBe(false);
    expect(personaCanReviewEvidence("reviewer")).toBe(true);
  });

  it("revokes evidence authorization and leaves the dependent stage blocked", () => {
    let state = { ...INITIAL_JOURNEY_STATE, stage: "evidence" as const };
    state = applyJourneyControl(state, "authorize_evidence");
    expect(canAdvanceJourney(state)).toBe(true);
    state = applyJourneyControl(state, "revoke_evidence");
    expect(canAdvanceJourney(state)).toBe(false);
    expect(state.auditTrail.at(-1)).toBe("EVIDENCE_REVOKED");
  });

  it("keeps commercial asset preparation separate from transaction tracking", () => {
    let state = { ...INITIAL_JOURNEY_STATE, stage: "diligence" as const };
    expect(canAdvanceJourney(state)).toBe(false);
    state = applyJourneyControl(state, "prepare_asset");
    expect(canAdvanceJourney(state)).toBe(true);
    state = advanceJourney(state);
    expect(state.stage).toBe("contract");
    expect(state.commercialTransactionStarted).toBe(false);
    expect(canAdvanceJourney(state)).toBe(false);
    state = applyJourneyControl(state, "start_transaction");
    expect(canAdvanceJourney(state)).toBe(true);
  });

  it("requires accepted interest and active engagement before a pilot can advance", () => {
    let state = { ...INITIAL_JOURNEY_STATE, stage: "pilot" as const, applicationVersion: 1 };
    expect(canAdvanceJourney(state)).toBe(false);
    state = applyJourneyControl(state, "accept_interest");
    expect(canAdvanceJourney(state)).toBe(false);
    state = applyJourneyControl(state, "establish_engagement");
    expect(canAdvanceJourney(state)).toBe(false);
    state = applyJourneyControl(state, "ready_for_pilot");
    expect(canAdvanceJourney(state)).toBe(true);
  });

  it("يكمل المسار الاصطناعي الكامل من سجل مؤرخ إلى تتبع معاملة منفصل دون عقد أو دفع تلقائي", () => {
    let state = INITIAL_JOURNEY_STATE;
    state = applyJourneyControl(state, "save_record_version");
    state = advanceJourney(state);
    state = applyJourneyControl(state, "authorize_evidence");
    state = advanceJourney(state);
    state = applyJourneyControl(state, "evaluate_readiness");
    state = advanceJourney(state);
    state = applyJourneyControl(state, "address_gaps");
    state = advanceJourney(state);
    state = applyJourneyControl(state, "qualify_record");
    state = advanceJourney(state);
    state = advanceJourney(state);
    state = advanceJourney(state);
    state = applyJourneyControl(state, "generate_match_run");
    state = advanceJourney(state);
    state = applyJourneyControl(state, "create_application_version");
    state = advanceJourney(state);
    state = applyJourneyControl(state, "accept_interest");
    state = applyJourneyControl(state, "establish_engagement");
    state = applyJourneyControl(state, "ready_for_pilot");
    state = advanceJourney(state);
    state = advanceJourney(state);
    state = applyJourneyControl(state, "prepare_asset");
    state = advanceJourney(state);
    expect(state.stage).toBe("contract");
    expect(state.commercialTransactionStarted).toBe(false);
    state = applyJourneyControl(state, "start_transaction");
    state = advanceJourney(state);
    state = advanceJourney(state);
    state = advanceJourney(state);
    expect(state.stage).toBe("scale");
    expect(state.evidenceAuthorized).toBe(true);
    expect(state.auditTrail).toContain("COMMERCIAL_ASSET_PREPARED");
    expect(state.auditTrail).toContain("COMMERCIAL_TRANSACTION_TRACKING_STARTED");
  });
});
