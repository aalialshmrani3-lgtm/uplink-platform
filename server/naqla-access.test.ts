import { describe, expect, it } from "vitest";
import { canAccessEvidence, canManageInvitation, resolveActiveContext, transitionInvitation } from "../shared/naqlaAccess";

describe("NAQLA active context and evidence authorization", () => {
  const memberships = [
    { organization: "Synthetic Organization", persona: "innovator" as const, status: "active" as const },
    { organization: "Other Organization", persona: "admin" as const, status: "revoked" as const },
  ];

  it("uses explicit active membership and fails closed for a missing or revoked context", () => {
    expect(resolveActiveContext(memberships, "Synthetic Organization")?.persona).toBe("innovator");
    expect(resolveActiveContext(memberships, "Other Organization")).toBeNull();
    expect(resolveActiveContext(memberships, "Unknown Organization")).toBeNull();
  });

  it("does not treat an organization membership or administrator role as evidence authorization", () => {
    const innovator = resolveActiveContext(memberships, "Synthetic Organization");
    expect(canAccessEvidence(innovator, null)).toBe(false);
    expect(canAccessEvidence(innovator, { organization: "Synthetic Organization", recipientPersona: "reviewer", status: "active" })).toBe(false);
    expect(canAccessEvidence(innovator, { organization: "Synthetic Organization", recipientPersona: "innovator", status: "active" })).toBe(true);
  });

  it("permits invitation management only for explicit operating personas", () => {
    expect(canManageInvitation({ organization: "Synthetic Organization", persona: "program_manager", status: "active" })).toBe(true);
    expect(canManageInvitation({ organization: "Synthetic Organization", persona: "admin", status: "active" })).toBe(false);
  });

  it("keeps invitation state transitions explicit and rejects invalid acceptance", () => {
    expect(transitionInvitation("draft", "accept")).toBe("draft");
    expect(transitionInvitation("draft", "send")).toBe("invited");
    expect(transitionInvitation("invited", "accept")).toBe("accepted");
    expect(transitionInvitation("accepted", "revoke")).toBe("accepted");
  });
});
