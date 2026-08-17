import { describe, expect, it } from 'vitest';
import { CR01_TYPE_CONFIG, deriveQualificationOutcome, evaluateTrlEvidence } from './naqla1-cr01';

describe('CR-01 submission configuration', () => {
  it('يوجه التحدي والجهة والفعالية مباشرة إلى NAQLA 2 دون تطبيق TRL', () => {
    expect(CR01_TYPE_CONFIG.challenge).toEqual({ trlApplicable: false, route: 'naqla2_direct' });
    expect(CR01_TYPE_CONFIG.organization).toEqual({ trlApplicable: false, route: 'naqla2_direct' });
    expect(CR01_TYPE_CONFIG.event).toEqual({ trlApplicable: false, route: 'naqla2_direct' });
  });

  it('يبقي TRL منطبقاً على الابتكار التقني والأصل الجاهز', () => {
    expect(CR01_TYPE_CONFIG.technical_innovation.trlApplicable).toBe(true);
    expect(CR01_TYPE_CONFIG.ready_asset.route).toBe('naqla3_direct');
  });
});

describe('CR-01 TRL evidence engine', () => {
  it('يقدّر TRL 4 من نموذج أولي وتقرير اختبار مختبري ولا يرفعه إلى TRL المعلن بلا دليل', () => {
    const result = evaluateTrlEvidence([
      { evidenceType: 'prototype', supportedTrl: 4, evidenceStrength: 'high' },
      { evidenceType: 'lab_test_report', supportedTrl: 4, evidenceStrength: 'high' },
    ]);
    expect(result.estimatedTrl).toBe(4);
    expect(result.evidenceConfidence).toBeGreaterThanOrEqual(80);
    expect(result.nextLevelEvidence.join(' ')).toContain('بيئة ذات صلة');
  });

  it('يبقي التقدير فارغاً عندما لا يوجد دليل مناسب ويطلب إضافة دليل', () => {
    const result = evaluateTrlEvidence([{ evidenceType: 'pitch_deck', evidenceStrength: 'medium' }]);
    expect(result.estimatedTrl).toBeNull();
    expect(result.evidenceConfidence).toBe(0);
    expect(result.missingEvidence).toHaveLength(1);
  });
});

describe('CR-01 qualification outcomes', () => {
  it('يصنف المشروع التجاري المؤهل تجارياً كفرصة تجارية دون خلطه بمؤهل الابتكار', () => {
    expect(deriveQualificationOutcome('commercial_solution', 80, 65)).toBe('commercial_potential');
  });

  it('يصنف الابتكار الذي تجاوز مؤشره 70 كمؤهل ابتكارياً', () => {
    expect(deriveQualificationOutcome('technical_innovation', 78, 61)).toBe('qualified_innovation');
  });
});
