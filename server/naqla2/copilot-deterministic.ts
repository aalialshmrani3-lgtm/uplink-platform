import { createHash } from "node:crypto";

export const COPILOT_POLICY_VERSION = "naqla2-copilot-policy-v1";
export const COPILOT_SCHEMA_VERSION = "naqla2-copilot-schema-v1";

export type CopilotMode = "reviewer_assist" | "applicant_assist";
export type CopilotAudience = "reviewer" | "applicant";
export type CopilotSuggestionKind = "information_gap" | "evidence_gap" | "clarification_draft" | "improvement_draft" | "next_best_action" | "limitation";

export type AuthorizedEvidence = {
  evidenceId: number;
  label: string;
  authorizationStatus: "authorized" | "revoked";
  allowReviewer: boolean;
};

export type DeterministicSuggestion = {
  audience: CopilotAudience;
  kind: CopilotSuggestionKind;
  body: string;
  deterministicRuleRefs: string[];
  sourceRefs: Array<{ type: "application_version_field" | "evidence_reference" | "deterministic_validation_rule"; id: string }>;
};

const sensitivePattern = /(?:api[_-]?key|password|secret|token|authorization|bearer)\s*[:=]\s*[^\s,;]+/gi;
const emailPattern = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;
const injectionPattern = /ignore\s+(?:all\s+)?previous\s+instructions|reveal\s+confidential\s+information|system\s+prompt/gi;

export function redactCopilotText(value: string): string {
  return value
    .replace(sensitivePattern, "[REDACTED_SENSITIVE_VALUE]")
    .replace(emailPattern, "[REDACTED_EMAIL]")
    .replace(injectionPattern, "[UNTRUSTED_INSTRUCTION_TEXT]");
}

export function createCopilotSourceSnapshotHash(input: { applicationVersionId: number; summary: string; evidence: AuthorizedEvidence[]; requirementSnapshot: unknown }): string {
  const stable = JSON.stringify({
    applicationVersionId: input.applicationVersionId,
    summary: redactCopilotText(input.summary),
    evidence: [...input.evidence].sort((a, b) => a.evidenceId - b.evidenceId).map(({ evidenceId, authorizationStatus, allowReviewer }) => ({ evidenceId, authorizationStatus, allowReviewer })),
    requirementSnapshot: input.requirementSnapshot,
  });
  return createHash("sha256").update(stable).digest("hex");
}

export function createCopilotIdempotencyKey(input: { mode: CopilotMode; actorId: number; activeContextId: number; applicationVersionId: number; sourceSnapshotHash: string }): string {
  return createHash("sha256")
    .update([input.mode, input.actorId, input.activeContextId, input.applicationVersionId, COPILOT_POLICY_VERSION, input.sourceSnapshotHash].join(":"))
    .digest("hex");
}

export function analyzeCopilotGaps(input: { mode: CopilotMode; summary: string; evidence: AuthorizedEvidence[] }): DeterministicSuggestion[] {
  const audience: CopilotAudience = input.mode === "reviewer_assist" ? "reviewer" : "applicant";
  const suggestions: DeterministicSuggestion[] = [];
  const summary = redactCopilotText(input.summary).trim();
  const sourceField = [{ type: "application_version_field" as const, id: "snapshot.summary" }];

  if (!summary) {
    suggestions.push({
      audience,
      kind: "information_gap",
      body: audience === "reviewer" ? "معلومة ناقصة: لا تحتوي النسخة الحالية على ملخص قابل للمراجعة. اطلب توضيحاً من المتقدم." : "معلومة ناقصة: أضف ملخصاً واضحاً للطلب قبل إنشاء نسخة جديدة.",
      deterministicRuleRefs: ["required_application_summary"],
      sourceRefs: sourceField,
    });
  }

  if (/\b(?:tbd|unknown|not sure|غير محدد|لاحقاً|غير واضح)\b/i.test(summary)) {
    suggestions.push({
      audience,
      kind: audience === "reviewer" ? "clarification_draft" : "improvement_draft",
      body: audience === "reviewer" ? "سؤال مقترح: يرجى استبدال العبارات غير المحددة بشرح محدد وقابل للتحقق ضمن نسخة جديدة أو رد توضيحي." : "اقتراح مسودة: استبدل العبارات غير المحددة بشرح محدد يوضح النطاق والخطوة التالية القابلة للتحقق.",
      deterministicRuleRefs: ["ambiguous_placeholder_terms"],
      sourceRefs: sourceField,
    });
  }

  const authorizedEvidence = input.evidence.filter((item) => item.authorizationStatus === "authorized");
  if (authorizedEvidence.length === 0) {
    suggestions.push({
      audience,
      kind: "evidence_gap",
      body: audience === "reviewer" ? "معلومة ناقصة: لا توجد إحالات أدلة مصرح بها متاحة لهذه النسخة. راجع المتقدم قبل اتخاذ أي قرار بشري." : "دليل مطلوب: أضف دليلاً مصرحاً به وشارك فقط ما تسمح به سياسة الطلب للمراجعة.",
      deterministicRuleRefs: ["authorized_evidence_reference_required"],
      sourceRefs: [{ type: "deterministic_validation_rule", id: "authorized_evidence_reference_required" }],
    });
  }

  const revokedEvidence = input.evidence.filter((item) => item.authorizationStatus === "revoked");
  if (revokedEvidence.length > 0) {
    suggestions.push({
      audience,
      kind: "limitation",
      body: "حدود المصدر: توجد إحالات أدلة ملغاة؛ لا تُستخدم هذه الإحالات في أي استنتاج أو قرار، ويستلزم الأمر إعادة التحقق من المصدر المصرح به.",
      deterministicRuleRefs: ["evidence_revocation_requires_reauthorization"],
      sourceRefs: revokedEvidence.map((item) => ({ type: "evidence_reference" as const, id: String(item.evidenceId) })),
    });
  }

  if (suggestions.length === 0) {
    suggestions.push({
      audience,
      kind: "next_best_action",
      body: audience === "reviewer" ? "يبدو أن الحقول المطلوبة وإحالات الأدلة المصرح بها مكتملة وفق القواعد الحتمية. تبقى المراجعة والقرار مسؤولية بشرية مخولة." : "تبدو الحقول المطلوبة وإحالات الأدلة المصرح بها مكتملة وفق القواعد الحتمية. راجع النص بنفسك قبل الإرسال الصريح.",
      deterministicRuleRefs: ["required_application_summary", "authorized_evidence_reference_required"],
      sourceRefs: sourceField,
    });
  }

  return suggestions;
}
