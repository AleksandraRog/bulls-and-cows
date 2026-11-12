import type {WinRecord} from '../storage/record';
import type {Base} from './base';
import service from './service';

export const sortWinRecords = (winRecords: WinRecord[]) => {
  const coefficientCache = new Map<string, number>();

  const getCoefficient = (length: number, base: Base): number => {
    const key = `${length}:${base}`;
    const cached = coefficientCache.get(key);

    if (cached !== undefined) {
      return cached;
    }
    const combinations = service.countPossibleSecrets(length, base);
    const coefficient = 1 / Math.max(1, Math.log2(combinations));
    coefficientCache.set(key, coefficient);
    return coefficient;
  };

  const newRecords = winRecords.sort((a, b) => {
    const scoreA = a.score * getCoefficient(a.length, a.base);
    const scoreB = b.score * getCoefficient(b.length, b.base);

    if (Math.abs(scoreA - scoreB) > 0.0001) {
      return scoreA - scoreB;
    }

    return a.time - b.time;
  });

  return newRecords;
};
