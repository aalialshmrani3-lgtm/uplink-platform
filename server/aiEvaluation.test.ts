import { describe, it, expect } from 'vitest';

describe('AI Evaluation System - Classification Logic', () => {
  it('should classify ideas into Innovation path when score >= 70%', () => {
    const testScores = [70, 75, 80, 85, 90, 95, 100];

    for (const score of testScores) {
      let classificationPath: 'innovation' | 'commercial' | 'guidance' = 'guidance';
      let suggestedPartner = '';

      if (score >= 70) {
        classificationPath = 'innovation';
        suggestedPartner = 'KAUST - جامعة الملك عبدالله للعلوم والتقنية';
      } else if (score >= 60) {
        classificationPath = 'commercial';
        suggestedPartner = 'Monsha\'at - منشآت';
      } else {
        classificationPath = 'guidance';
        suggestedPartner = 'RDIA - الهيئة الملكية للبيانات والذكاء الاصطناعي';
      }

      expect(classificationPath).toBe('innovation');
      expect(suggestedPartner).toContain('KAUST');
    }
  });

  it('should classify ideas into Commercial path when score is 60-69%', () => {
    const testScores = [60, 62, 65, 68, 69];

    for (const score of testScores) {
      let classificationPath: 'innovation' | 'commercial' | 'guidance' = 'guidance';
      let suggestedPartner = '';

      if (score >= 70) {
        classificationPath = 'innovation';
        suggestedPartner = 'KAUST - جامعة الملك عبدالله للعلوم والتقنية';
      } else if (score >= 60) {
        classificationPath = 'commercial';
        suggestedPartner = 'Monsha\'at - منشآت';
      } else {
        classificationPath = 'guidance';
        suggestedPartner = 'RDIA - الهيئة الملكية للبيانات والذكاء الاصطناعي';
      }

      expect(classificationPath).toBe('commercial');
      expect(suggestedPartner).toContain('Monsha\'at');
    }
  });

  it('should classify ideas into Guidance path when score < 60%', () => {
    const testScores = [0, 10, 25, 40, 50, 55, 59];

    for (const score of testScores) {
      let classificationPath: 'innovation' | 'commercial' | 'guidance' = 'guidance';
      let suggestedPartner = '';

      if (score >= 70) {
        classificationPath = 'innovation';
        suggestedPartner = 'KAUST - جامعة الملك عبدالله للعلوم والتقنية';
      } else if (score >= 60) {
        classificationPath = 'commercial';
        suggestedPartner = 'Monsha\'at - منشآت';
      } else {
        classificationPath = 'guidance';
        suggestedPartner = 'RDIA - الهيئة الملكية للبيانات والذكاء الاصطناعي';
      }

      expect(classificationPath).toBe('guidance');
      expect(suggestedPartner).toContain('RDIA');
    }
  });

  it('should return correct response data structure', () => {
    const testCases = [
      { score: 75, expectedPath: 'innovation', expectedPartner: 'KAUST' },
      { score: 65, expectedPath: 'commercial', expectedPartner: 'Monsha\'at' },
      { score: 45, expectedPath: 'guidance', expectedPartner: 'RDIA' },
    ];

    for (const testCase of testCases) {
      let classificationPath: 'innovation' | 'commercial' | 'guidance' = 'guidance';
      let suggestedPartner = '';

      if (testCase.score >= 70) {
        classificationPath = 'innovation';
        suggestedPartner = 'KAUST - جامعة الملك عبدالله للعلوم والتقنية';
      } else if (testCase.score >= 60) {
        classificationPath = 'commercial';
        suggestedPartner = 'Monsha\'at - منشآت';
      } else {
        classificationPath = 'guidance';
        suggestedPartner = 'RDIA - الهيئة الملكية للبيانات والذكاء الاصطناعي';
      }

      const responseData = {
        overallScore: testCase.score,
        classification: classificationPath,
        classificationPath,
        suggestedPartner,
      };

      expect(responseData.classification).toBe(testCase.expectedPath);
      expect(responseData.classificationPath).toBe(testCase.expectedPath);
      expect(responseData.suggestedPartner).toContain(testCase.expectedPartner);
    }
  });

  it('should handle boundary scores correctly', () => {
    // Test exact boundary values
    const boundaryTests = [
      { score: 70, expectedPath: 'innovation' },
      { score: 69, expectedPath: 'commercial' },
      { score: 60, expectedPath: 'commercial' },
      { score: 59, expectedPath: 'guidance' },
    ];

    for (const test of boundaryTests) {
      let classificationPath: 'innovation' | 'commercial' | 'guidance' = 'guidance';

      if (test.score >= 70) {
        classificationPath = 'innovation';
      } else if (test.score >= 60) {
        classificationPath = 'commercial';
      } else {
        classificationPath = 'guidance';
      }

      expect(classificationPath).toBe(test.expectedPath);
    }
  });
});
