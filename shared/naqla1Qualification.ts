export type Naqla1GapCode = "missing_authorized_evidence" | "missing_immutable_version" | "incomplete_problem_statement" | "incomplete_desired_outcome";
export type Naqla1NextBestAction = "add_authorized_evidence" | "create_immutable_version" | "complete_record" | "route_to_naqla2";

export type Naqla1QualificationInput = {
  title: string;
  problemStatement: string;
  desiredOutcome: string;
  authorizedEvidenceCount: number;
  immutableVersionCount: number;
};

export type Naqla1QualificationResult = {
  criteriaSatisfied: number;
  criteriaTotal: 4;
  readinessLevel: number;
  qualificationStatus: "not_ready" | "qualified";
  nextBestAction: Naqla1NextBestAction;
  gaps: Naqla1GapCode[];
};

function isComplete(value: string) {
  return value.trim().length >= 12;
}

export function evaluateNaqla1Qualification(input: Naqla1QualificationInput): Naqla1QualificationResult {
  const gaps: Naqla1GapCode[] = [];
  if (!isComplete(input.problemStatement)) gaps.push("incomplete_problem_statement");
  if (!isComplete(input.desiredOutcome)) gaps.push("incomplete_desired_outcome");
  if (input.authorizedEvidenceCount < 1) gaps.push("missing_authorized_evidence");
  if (input.immutableVersionCount < 1) gaps.push("missing_immutable_version");

  const criteriaSatisfied = 4 - gaps.length;
  const qualificationStatus = gaps.length === 0 ? "qualified" : "not_ready";
  const nextBestAction: Naqla1NextBestAction = gaps.includes("incomplete_problem_statement") || gaps.includes("incomplete_desired_outcome")
    ? "complete_record"
    : gaps.includes("missing_authorized_evidence")
      ? "add_authorized_evidence"
      : gaps.includes("missing_immutable_version")
        ? "create_immutable_version"
        : "route_to_naqla2";

  return { criteriaSatisfied, criteriaTotal: 4, readinessLevel: Math.max(1, criteriaSatisfied + 1), qualificationStatus, nextBestAction, gaps };
}
