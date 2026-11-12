import {Base} from '../src/domain/base';
import service from '../src/domain/service';

describe('TDD: countPossibleSecrets (Strict 2-6 Length Bounds)', () => {
  beforeEach(() => {
    const fn = service.countPossibleSecrets;
    if (fn.cache) {
      fn.cache = {};
    }
  });
  describe('Step 1: Input Bounds Validation', () => {
    test('should throw an error if requested length is outside the global 2-6 range', () => {
      expect(() => service.countPossibleSecrets(1, Base.dec)).toThrow();
      expect(() => service.countPossibleSecrets(7, Base.hex)).toThrow();
    });

    test('should throw an error if length exceeds unique alphabet size (The Rule for bin)', () => {
      expect(() => service.countPossibleSecrets(3, Base.bin)).toThrow();
      expect(() => service.countPossibleSecrets(4, Base.bin)).toThrow();
      expect(() => service.countPossibleSecrets(6, Base.bin)).toThrow();
    });

    test('should throw an error if length exceeds unique alphabet size for other bases (just in case)', () => {
      expect(() => service.countPossibleSecrets(7, Base.oct)).toThrow();
    });
  });

  describe('Step 2: Mathematical correctness for allowed lengths', () => {
    test('should return correct permutations for the minimum allowed length (2)', () => {
      expect(service.countPossibleSecrets(2, Base.bin)).toBe(2 * 1);
      expect(service.countPossibleSecrets(2, Base.dec)).toBe(10 * 9);
    });

    test('should return correct permutations for standard middle length (4)', () => {
      expect(service.countPossibleSecrets(4, Base.oct)).toBe(8 * 7 * 6 * 5);
      expect(service.countPossibleSecrets(4, Base.dec)).toBe(10 * 9 * 8 * 7);
      expect(service.countPossibleSecrets(4, Base.hex)).toBe(16 * 15 * 14 * 13);
    });

    test('should return correct permutations for the maximum allowed length (6)', () => {
      expect(service.countPossibleSecrets(6, Base.hex)).toBe(16 * 15 * 14 * 13 * 12 * 11);
    });
  });
  describe('Step 3: Memoization verification', () => {
    test('should compute result on first call and automatically save it to the cache object', () => {
      const cacheKey = '4-dec';
      const fn = service.countPossibleSecrets;
      expect(fn.cache?.[cacheKey]).toBeUndefined();
      const result = service.countPossibleSecrets(4, Base.dec);
      expect(result).toBe(10 * 9 * 8 * 7);
      expect(fn.cache?.[cacheKey]).toBe(10 * 9 * 8 * 7);
    });
  });
});
