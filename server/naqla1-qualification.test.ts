import { describe, expect, it } from "vitest";
import { evaluateNaqla1Qualification } from "@shared/naqla1Qualification";

describe("NAQLA1 deterministic qualification", () => {
  it("يعيد فجوات وإجراء تالٍ محدداً عند غياب الدليل والنسخة", () => {
    const result = evaluateNaqla1Qualification({
      title: "Synthetic innovation record",
      problemStatement: "A complete synthetic problem statement for deterministic evaluation.",
      desiredOutcome: "A complete synthetic desired outcome for deterministic evaluation.",
      authorizedEvidenceCount: 0,
      immutableVersionCount: 0,
    });
    expect(result).toMatchObject({ criteriaSatisfied: 2, criteriaTotal: 4, qualificationStatus: "not_ready", nextBestAction: "add_authorized_evidence" });
    expect(result.gaps).toEqual(["missing_authorized_evidence", "missing_immutable_version"]);
  });

  it("يؤهل السجل فقط بعد اكتمال النص والدليل المفوض والنسخة الثابتة", () => {
    const result = evaluateNaqla1Qualification({
      title: "Synthetic innovation record",
      problemStatement: "A complete synthetic problem statement for deterministic evaluation.",
      desiredOutcome: "A complete synthetic desired outcome for deterministic evaluation.",
      authorizedEvidenceCount: 1,
      immutableVersionCount: 1,
    });
    expect(result).toMatchObject({ criteriaSatisfied: 4, qualificationStatus: "qualified", nextBestAction: "route_to_naqla2", readinessLevel: 5, gaps: [] });
  });
});
