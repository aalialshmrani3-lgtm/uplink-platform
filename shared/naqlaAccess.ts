import type { NaqlaPersona } from "./naqlaJourney";

export type Membership = {
  organization: string;
  persona: NaqlaPersona;
  status: "active" | "invited" | "revoked";
};

export type EvidenceGrant = {
  organization: string;
  recipientPersona: NaqlaPersona;
  status: "active" | "revoked";
};

export type InvitationStatus = "draft" | "invited" | "accepted" | "revoked";

export function resolveActiveContext(memberships: Membership[], organization: string): Membership | null {
  return memberships.find((membership) => membership.organization === organization && membership.status === "active") ?? null;
}

export function canAccessEvidence(activeContext: Membership | null, grant: EvidenceGrant | null): boolean {
  if (!activeContext || !grant) return false;
  return grant.status === "active"
    && grant.organization === activeContext.organization
    && grant.recipientPersona === activeContext.persona;
}

export function canManageInvitation(activeContext: Membership | null): boolean {
  if (!activeContext) return false;
  return activeContext.persona === "program_manager" || activeContext.persona === "company" || activeContext.persona === "university";
}

export function transitionInvitation(current: InvitationStatus, action: "send" | "accept" | "revoke"): InvitationStatus {
  if (action === "send" && current === "draft") return "invited";
  if (action === "accept" && current === "invited") return "accepted";
  if (action === "revoke" && (current === "draft" || current === "invited")) return "revoked";
  return current;
}
