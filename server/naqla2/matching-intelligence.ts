export const MATCHING_RULE_VERSION = "naqla2-deterministic-v2";
export const MATCHING_WEIGHT_VERSION = "term-overlap-100-v1";

export type MatchExclusionCode = "self_owned" | "not_published" | "disclosure_not_teaser" | "stale_or_ineligible";

export type TeaserMatchFactor =
  | { factorId: "hard_filter"; status: "passed"; ruleVersion: string }
  | { factorId: "query_term_overlap"; method: "deterministic_exact_term_overlap"; weight: 100; matchedTerms: string[]; queryTermCount: number; score: number }
  | { factorId: "evidence_confidence"; value: "not_evaluated_from_teaser"; status: "limited"; evidenceReferences: [] }
  | { factorId: "disclosure_boundary"; value: "teaser_only"; status: "allowed" };

function tokenize(value: string) {
  return Array.from(new Set(value.toLocaleLowerCase().split(/[^a-zA-Z0-9\u0600-\u06FF]+/).filter((term) => term.length >= 3))).sort();
}

export function stableMatchFingerprint(input: { requestId: number; queryText: string; activeContextId: number; ruleVersion?: string; weightVersion?: string }) {
  const canonical = [input.requestId, input.activeContextId, input.ruleVersion ?? MATCHING_RULE_VERSION, input.weightVersion ?? MATCHING_WEIGHT_VERSION, ...tokenize(input.queryText)].join("|");
  let hash = 2166136261;
  for (const char of canonical) hash = Math.imul(hash ^ char.charCodeAt(0), 16777619);
  return `mr2c-${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

export function createDeterministicTeaserMatch(queryText: string, title: string, summary: string) {
  const queryTerms = tokenize(queryText);
  const teaserTerms = new Set(tokenize(`${title} ${summary}`));
  const matchedTerms = queryTerms.filter((term) => teaserTerms.has(term));
  const score = queryTerms.length === 0 ? 0 : Math.round((matchedTerms.length / queryTerms.length) * 100);
  const rankBand: "high" | "medium" | "low" = score >= 67 ? "high" : score >= 34 ? "medium" : "low";
  const factors: TeaserMatchFactor[] = [
    { factorId: "hard_filter", status: "passed", ruleVersion: MATCHING_RULE_VERSION },
    { factorId: "query_term_overlap", method: "deterministic_exact_term_overlap", weight: 100, matchedTerms, queryTermCount: queryTerms.length, score },
    { factorId: "disclosure_boundary", value: "teaser_only", status: "allowed" },
    { factorId: "evidence_confidence", value: "not_evaluated_from_teaser", status: "limited", evidenceReferences: [] },
  ];
  return { score, normalizedScore: score, rankBand, evidenceConfidence: "teaser_only" as const, factors, explanation: matchedTerms.length ? `matched_terms:${matchedTerms.join(",")}` : "no_shared_terms" };
}

export function classifyListingEligibility(input: { ownerUserId: number; requesterUserId: number; status: string; disclosureScope: string }) {
  if (input.ownerUserId === input.requesterUserId) return { eligible: false as const, reasonCode: "self_owned" as const };
  if (input.status !== "published") return { eligible: false as const, reasonCode: "not_published" as const };
  if (input.disclosureScope !== "teaser_only") return { eligible: false as const, reasonCode: "disclosure_not_teaser" as const };
  return { eligible: true as const };
}
