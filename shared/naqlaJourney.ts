export type NaqlaPersona = "innovator" | "researcher" | "startup" | "university" | "company" | "investor" | "government" | "reviewer" | "program_manager" | "admin";

export type JourneyStage =
  | "understand"
  | "evidence"
  | "evaluate"
  | "improve"
  | "qualify"
  | "route"
  | "discover"
  | "match"
  | "apply"
  | "pilot"
  | "prepare"
  | "diligence"
  | "contract"
  | "execute"
  | "scale";

export type JourneyState = {
  stage: JourneyStage;
  completed: JourneyStage[];
  nextBestAction: string;
  recordVersion: number;
  evaluationCompleted: boolean;
  gapsAddressed: boolean;
  qualified: boolean;
  matchRunGenerated: boolean;
  interestAccepted: boolean;
  engagementEstablished: boolean;
  route: "connect" | "commercialize" | null;
  evidenceAuthorized: boolean;
  applicationVersion: number;
  pilotReady: boolean;
  commercialAssetPrepared: boolean;
  commercialTransactionStarted: boolean;
  auditTrail: string[];
};

export const JOURNEY_STAGES: JourneyStage[] = [
  "understand", "evidence", "evaluate", "improve", "qualify", "route",
  "discover", "match", "apply", "pilot", "prepare", "diligence", "contract", "execute", "scale",
];

export const INITIAL_JOURNEY_STATE: JourneyState = {
  stage: "understand",
  completed: [],
  nextBestAction: "Document the innovation problem in the synthetic workspace.",
  recordVersion: 0,
  evaluationCompleted: false,
  gapsAddressed: false,
  qualified: false,
  matchRunGenerated: false,
  interestAccepted: false,
  engagementEstablished: false,
  route: null,
  evidenceAuthorized: false,
  applicationVersion: 0,
  pilotReady: false,
  commercialAssetPrepared: false,
  commercialTransactionStarted: false,
  auditTrail: ["SYNTHETIC_JOURNEY_CREATED"],
};

const nextAction: Record<JourneyStage, string> = {
  understand: "Attach an authorized synthetic evidence item.",
  evidence: "Run the deterministic readiness evaluation.",
  evaluate: "Address the documented gap before qualification.",
  improve: "Confirm the deterministic qualification outcome.",
  qualify: "Route the qualified record to a suitable demand path.",
  route: "Review the opportunity teaser without exposing evidence.",
  discover: "Run the explainable deterministic match.",
  match: "Create an immutable synthetic application version.",
  apply: "Review eligibility and move the engagement to pilot planning.",
  pilot: "Prepare a commercial asset scope; no legal conclusion is produced.",
  prepare: "Complete due-diligence checklist items with authorized evidence only.",
  diligence: "Record a contract-ready decision for human review.",
  contract: "Start execution only after the human-owned contract process.",
  execute: "Record scale readiness without creating an automated transaction.",
  scale: "Journey completed. Keep evidence authorization and audit history intact.",
};

export function canAdvanceJourney(state: JourneyState): boolean {
  if (state.stage === "understand") return state.recordVersion > 0;
  if (state.stage === "evidence") return state.evidenceAuthorized;
  if (state.stage === "evaluate") return state.evaluationCompleted;
  if (state.stage === "improve") return state.gapsAddressed;
  if (state.stage === "qualify") return state.qualified;
  if (state.stage === "match") return state.matchRunGenerated;
  if (state.stage === "apply") return state.applicationVersion > 0;
  if (state.stage === "pilot") return state.applicationVersion > 0 && state.interestAccepted && state.engagementEstablished && state.pilotReady;
  if (state.stage === "diligence") return state.commercialAssetPrepared;
  if (state.stage === "contract") return state.commercialTransactionStarted;
  return state.stage !== "scale";
}

export function advanceJourney(state: JourneyState): JourneyState {
  if (!canAdvanceJourney(state)) return state;
  const currentIndex = JOURNEY_STAGES.indexOf(state.stage);
  const stage = JOURNEY_STAGES[Math.min(currentIndex + 1, JOURNEY_STAGES.length - 1)];
  return {
    ...state,
    stage,
    completed: state.completed.includes(state.stage) ? state.completed : [...state.completed, state.stage],
    nextBestAction: nextAction[stage],
    route: state.stage === "qualify" ? "connect" : state.route,
  };
}

export function applyJourneyControl(state: JourneyState, control: "save_record_version" | "authorize_evidence" | "revoke_evidence" | "evaluate_readiness" | "address_gaps" | "qualify_record" | "generate_match_run" | "create_application_version" | "accept_interest" | "establish_engagement" | "ready_for_pilot" | "prepare_asset" | "start_transaction"): JourneyState {
  switch (control) {
    case "save_record_version":
      return { ...state, recordVersion: state.recordVersion + 1, nextBestAction: "A synthetic record version is ready for evidence authorization.", auditTrail: [...state.auditTrail, "RECORD_VERSION_SAVED"] };
    case "authorize_evidence":
      return { ...state, evidenceAuthorized: true, nextBestAction: "Evidence authorization is recorded for this synthetic journey only.", auditTrail: [...state.auditTrail, "EVIDENCE_AUTHORIZED"] };
    case "revoke_evidence":
      return { ...state, evidenceAuthorized: false, nextBestAction: "Evidence authorization is revoked. Dependent work remains blocked until a new authorization exists.", auditTrail: [...state.auditTrail, "EVIDENCE_REVOKED"] };
    case "evaluate_readiness":
      return { ...state, evaluationCompleted: true, nextBestAction: "The deterministic readiness evaluation has recorded documented gaps.", auditTrail: [...state.auditTrail, "READINESS_EVALUATED"] };
    case "address_gaps":
      return { ...state, gapsAddressed: true, nextBestAction: "Documented gaps are addressed and ready for deterministic qualification.", auditTrail: [...state.auditTrail, "GAPS_ADDRESSED"] };
    case "qualify_record":
      return { ...state, qualified: true, nextBestAction: "The record is qualified for an explainable opportunity path.", auditTrail: [...state.auditTrail, "RECORD_QUALIFIED"] };
    case "generate_match_run":
      return { ...state, matchRunGenerated: true, nextBestAction: "The deterministic match run has recorded factors and a rank band without exposing evidence.", auditTrail: [...state.auditTrail, "MATCH_RUN_GENERATED"] };
    case "create_application_version":
      return { ...state, applicationVersion: state.applicationVersion + 1, nextBestAction: "The immutable application version is ready for eligibility review.", auditTrail: [...state.auditTrail, "APPLICATION_VERSION_CREATED"] };
    case "accept_interest":
      return { ...state, interestAccepted: true, nextBestAction: "Interest is accepted for this synthetic journey; no evidence right is granted.", auditTrail: [...state.auditTrail, "INTEREST_ACCEPTED"] };
    case "establish_engagement":
      return { ...state, engagementEstablished: true, nextBestAction: "Engagement is established within the active context and can be planned for pilot.", auditTrail: [...state.auditTrail, "ENGAGEMENT_ESTABLISHED"] };
    case "ready_for_pilot":
      return { ...state, pilotReady: true, nextBestAction: "Pilot planning can proceed under the selected organization context.", auditTrail: [...state.auditTrail, "PILOT_READY"] };
    case "prepare_asset":
      return { ...state, commercialAssetPrepared: true, nextBestAction: "Commercial asset scope is prepared; human due diligence remains required.", auditTrail: [...state.auditTrail, "COMMERCIAL_ASSET_PREPARED"] };
    case "start_transaction":
      return { ...state, commercialTransactionStarted: true, nextBestAction: "Commercial transaction tracking is enabled; no payment or contract is automated.", auditTrail: [...state.auditTrail, "COMMERCIAL_TRANSACTION_TRACKING_STARTED"] };
  }
}

export function personaCanReviewEvidence(persona: NaqlaPersona): boolean {
  return persona === "innovator" || persona === "researcher" || persona === "startup" || persona === "university" || persona === "company" || persona === "reviewer" || persona === "program_manager";
}
