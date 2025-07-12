"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildParlayCombos = exports.calculateEdge = exports.impliedProbabilityFromOdds = void 0;
/**
 * Convert American odds to implied win probability.
 * Formula: negative odds => -odds / (-odds + 100); positive => 100 / (odds + 100)
 */
const impliedProbabilityFromOdds = (odds) => {
    return odds < 0 ? -odds / (-odds + 100) : 100 / (odds + 100);
};
exports.impliedProbabilityFromOdds = impliedProbabilityFromOdds;
const calculateEdge = (fair, implied) => fair - implied;
exports.calculateEdge = calculateEdge;
// simple recursive combination builder to avoid external deps
const combinations = (arr, k, start = 0, combo = [], res = []) => {
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
const buildParlayCombos = (legs, maxLegs = 3) => {
    const allParlays = [];
    for (let comboSize = 2; comboSize <= maxLegs; comboSize++) {
        const combos = combinations(legs, comboSize);
        for (const legsCombo of combos) {
            const implied = legsCombo.reduce((acc, leg) => acc * (0, exports.impliedProbabilityFromOdds)(leg.odds), 1);
            const fair = legsCombo.reduce((acc, leg) => acc * leg.winProbability, 1);
            const edge = (0, exports.calculateEdge)(fair, implied);
            allParlays.push({ legs: legsCombo, impliedProbability: implied, fairProbability: fair, edge });
        }
    }
    return allParlays.sort((a, b) => b.edge - a.edge);
};
exports.buildParlayCombos = buildParlayCombos;
