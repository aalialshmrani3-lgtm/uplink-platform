export const CR01_SUBMISSION_TYPES = [
  'early_idea', 'technical_innovation', 'research_output', 'commercial_solution',
  'digital_ai_product', 'startup', 'ip_asset', 'challenge', 'organization', 'event', 'ready_asset',
] as const;

export type Cr01SubmissionType = typeof CR01_SUBMISSION_TYPES[number];

export const CR01_TYPE_CONFIG: Record<Cr01SubmissionType, { trlApplicable: boolean; route: 'naqla1_development' | 'naqla1_qualification' | 'naqla2_candidate' | 'naqla2_direct' | 'naqla3_direct' }> = {
  early_idea: { trlApplicable: false, route: 'naqla1_development' },
  technical_innovation: { trlApplicable: true, route: 'naqla1_qualification' },
  research_output: { trlApplicable: true, route: 'naqla1_qualification' },
  commercial_solution: { trlApplicable: false, route: 'naqla2_candidate' },
  digital_ai_product: { trlApplicable: true, route: 'naqla1_qualification' },
  startup: { trlApplicable: false, route: 'naqla2_candidate' },
  ip_asset: { trlApplicable: true, route: 'naqla1_qualification' },
  challenge: { trlApplicable: false, route: 'naqla2_direct' },
  organization: { trlApplicable: false, route: 'naqla2_direct' },
  event: { trlApplicable: false, route: 'naqla2_direct' },
  ready_asset: { trlApplicable: true, route: 'naqla3_direct' },
};

const EVIDENCE_TRL: Record<string, number> = {
  research_reference: 1,
  technical_description: 2,
  architecture: 2,
  proof_of_concept: 3,
  prototype: 4,
  lab_test_report: 4,
  relevant_environment_test: 5,
  pilot_data: 6,
  operational_deployment: 7,
  performance_data: 4,
};

const NEXT_EVIDENCE: Record<number, string[]> = {
  1: ['وصف تقني يحدد المفهوم والتطبيق المستهدف.'],
  2: ['نتائج Proof of Concept أو تجربة أولية قابلة للقياس.'],
  3: ['نموذج أولي وتقرير اختبار مختبري وبيانات أداء.'],
  4: ['اختبار موثق في بيئة ذات صلة وبروتوكول اختبار ومؤشرات أداء.'],
  5: ['Pilot prototype وبيانات أداء في بيئة ذات صلة.'],
  6: ['Pilot تشغيلي في موقع حقيقي ونتائج أو قبول جهة مستفيدة.'],
  7: ['نظام مكتمل واختبارات أو شهادات لازمة للغرض المقصود.'],
  8: ['نتائج تشغيل حقيقية موثقة تثبت الأداء في الاستخدام الفعلي.'],
  9: [],
};

export function evaluateTrlEvidence(evidence: Array<{ evidenceType: string; supportedTrl?: number | null; evidenceStrength?: string | null }>) {
  const declared = evidence.filter((item) => item.evidenceStrength !== 'low');
  const estimatedTrl = declared.reduce((highest, item) => Math.max(highest, item.supportedTrl || EVIDENCE_TRL[item.evidenceType] || 0), 0) || null;
  const highStrength = declared.filter((item) => item.evidenceStrength === 'high').length;
  const confidence = estimatedTrl ? Math.min(95, 52 + (declared.length * 8) + (highStrength * 7)) : 0;
  return {
    estimatedTrl,
    evidenceConfidence: confidence,
    missingEvidence: estimatedTrl ? NEXT_EVIDENCE[estimatedTrl] ?? [] : ['أضف وصفاً تقنياً أو دليلاً يوضح المرحلة الحالية للمشروع.'],
    nextLevelEvidence: estimatedTrl ? NEXT_EVIDENCE[estimatedTrl] ?? [] : [],
  };
}

export function deriveQualificationOutcome(type: Cr01SubmissionType, innovationIndex: number, commercialReadiness: number) {
  if (type === 'commercial_solution' || type === 'startup') return commercialReadiness >= 60 ? 'commercial_potential' : 'development_needed';
  if (innovationIndex >= 70) return 'qualified_innovation';
  return 'development_needed';
}
