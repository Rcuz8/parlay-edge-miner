export interface Leg {
  id: string;
  odds: number; // American odds (e.g., -150 or +120)
  winProbability: number; // Fair win probability from LLM
}

export interface Parlay {
  legs: Leg[];
  impliedProbability: number;
  fairProbability: number;
  edge: number;
}

/**
 * Convert American odds to implied win probability.
 * Formula: negative odds => -odds / (-odds + 100); positive => 100 / (odds + 100)
 */
export const impliedProbabilityFromOdds = (odds: number): number => {
  return odds < 0 ? -odds / (-odds + 100) : 100 / (odds + 100);
};

export const calculateEdge = (fair: number, implied: number): number => fair - implied;

// simple recursive combination builder to avoid external deps
const combinations = <T>(arr: T[], k: number, start = 0, combo: T[] = [], res: T[][] = []): T[][] => {
  if (combo.length === k) {
    res.push([...combo]);
    return res;
  }
  for (let i = start; i < arr.length; i++) {
    combo.push(arr[i]);
    combinations(arr, k, i + 1, combo, res);
    combo.pop();
  }
  return res;
};

export const buildParlayCombos = (legs: Leg[], maxLegs = 3): Parlay[] => {
  const allParlays: Parlay[] = [];
  for (let comboSize = 2; comboSize <= maxLegs; comboSize++) {
    const combos = combinations(legs, comboSize);
    for (const legsCombo of combos) {
      const implied = legsCombo.reduce((acc, leg) => acc * impliedProbabilityFromOdds(leg.odds), 1);
      const fair = legsCombo.reduce((acc, leg) => acc * leg.winProbability, 1);
      const edge = calculateEdge(fair, implied);
      allParlays.push({ legs: legsCombo, impliedProbability: implied, fairProbability: fair, edge });
    }
  }
  return allParlays.sort((a, b) => b.edge - a.edge);
};