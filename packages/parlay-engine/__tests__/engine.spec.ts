import { impliedProbabilityFromOdds, calculateEdge, buildParlayCombos, Leg } from '../src/index';

describe('parlay-engine', () => {
  describe('impliedProbabilityFromOdds', () => {
    it('converts positive odds', () => {
      expect(impliedProbabilityFromOdds(150)).toBeCloseTo(100 / 250);
    });
    it('converts negative odds', () => {
      expect(impliedProbabilityFromOdds(-200)).toBeCloseTo(200 / 300);
    });
  });

  describe('calculateEdge', () => {
    it('returns difference between fair and implied', () => {
      expect(calculateEdge(0.6, 0.5)).toBeCloseTo(0.1);
    });
  });

  describe('buildParlayCombos', () => {
    const legs: Leg[] = [
      { id: 'A', odds: -150, winProbability: 0.65 },
      { id: 'B', odds: +120, winProbability: 0.55 },
      { id: 'C', odds: -110, winProbability: 0.57 },
    ];

    it('builds 2 and 3-leg parlays', () => {
      const parlays = buildParlayCombos(legs, 3);
      // C(3,2) + C(3,3) = 3 + 1 = 4
      expect(parlays).toHaveLength(4);
      // ensure parlays sorted by edge desc
      for (let i = 1; i < parlays.length; i++) {
        expect(parlays[i - 1].edge).toBeGreaterThanOrEqual(parlays[i].edge);
      }
    });
  });
});