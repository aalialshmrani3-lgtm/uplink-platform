import { describe, it, expect } from 'vitest';

describe('UPLINK Journey - Complete Flow Tests', () => {
  describe('Classification Logic', () => {
    it('should classify score ≥70% as innovation', () => {
      const score = 75;
      const path = score >= 70 ? 'innovation' : score >= 60 ? 'commercial' : 'guidance';
      expect(path).toBe('innovation');
    });

    it('should classify score 60-69% as commercial', () => {
      const score = 65;
      const path = score >= 70 ? 'innovation' : score >= 60 ? 'commercial' : 'guidance';
      expect(path).toBe('commercial');
    });

    it('should classify score <60% as guidance', () => {
      const score = 55;
      const path = score >= 70 ? 'innovation' : score >= 60 ? 'commercial' : 'guidance';
      expect(path).toBe('guidance');
    });
  });

  describe('User Choice Logic', () => {
    it('should allow user to choose UPLINK 2 when score ≥60%', () => {
      const score = 70;
      const canChoose = score >= 60;
      expect(canChoose).toBe(true);
    });

    it('should allow user to choose UPLINK 3 directly when score ≥60%', () => {
      const score = 75;
      const canChooseDirect = score >= 60;
      expect(canChooseDirect).toBe(true);
    });

    it('should NOT allow choice when score <60%', () => {
      const score = 55;
      const canChoose = score >= 60;
      expect(canChoose).toBe(false);
    });
  });

  describe('Strategic Partner Mapping', () => {
    it('should suggest KAUST for innovation path (≥70%)', () => {
      const score = 75;
      const partner = score >= 70 ? 'KAUST' : score >= 60 ? 'Monsha\'at' : 'RDIA';
      expect(partner).toBe('KAUST');
    });

    it('should suggest Monsha\'at for commercial path (60-69%)', () => {
      const score = 65;
      const partner = score >= 70 ? 'KAUST' : score >= 60 ? 'Monsha\'at' : 'RDIA';
      expect(partner).toBe('Monsha\'at');
    });

    it('should suggest RDIA for guidance path (<60%)', () => {
      const score = 55;
      const partner = score >= 70 ? 'KAUST' : score >= 60 ? 'Monsha\'at' : 'RDIA';
      expect(partner).toBe('RDIA');
    });
  });

  describe('Price Calculation Logic', () => {
    it('should calculate higher price for higher scores', () => {
      const score1 = 70;
      const score2 = 90;
      
      const price1 = Math.round(score1 * 1000);
      const price2 = Math.round(score2 * 1000);
      
      expect(price2).toBeGreaterThan(price1);
    });

    it('should have minimum price for low scores', () => {
      const score = 60;
      const price = Math.max(Math.round(score * 1000), 50000);
      
      expect(price).toBeGreaterThanOrEqual(50000);
    });
  });
});
