import {Base} from '../base';
import {ALPHABETS, Evaluare} from './types';

const MIN_SECRET_LENGTH = 2;
const MAX_SECRET_LENGTH = 6;
const BINARY_MAX_LENGTH = 2;

interface CacheInterface {
  (length: number, base: Base, count?: number | null): number;
  cache?: Record<string, number>;
}

const countPossibleSecrets: CacheInterface = (length: number, base: Base, count: number | null = null): number => {
  if (!count && (length < MIN_SECRET_LENGTH || length > MAX_SECRET_LENGTH)) throw new RangeError('Error parameter');
  if (!countPossibleSecrets.cache) {
    countPossibleSecrets.cache = {};
  }
  const cacheKey = `${length}-${base}`;
  if (!count && countPossibleSecrets.cache[cacheKey] !== undefined) {
    return countPossibleSecrets.cache[cacheKey];
  }
  const newCount = count ?? 1;
  if (length === 0) return newCount;

  const newLength = length - 1;
  const totalCombinations = countPossibleSecrets(newLength, base, newCount * (ALPHABETS[base].length - newLength));
  if (!count) {
    countPossibleSecrets.cache[cacheKey] = totalCombinations;
  }
  return totalCombinations;
};

function createDigitValidator(base: Base): (char: string) => boolean {
  const digitValidator = (char: string) => {
    if (!char) return false;
    return ALPHABETS[base].includes(char.toLowerCase());
  };
  return digitValidator;
}

function evaluateGuess(secret: string, guess: string): Evaluare {
  const secretSet = new Set(secret);
  return guess.split('').reduce(
    (acc: Evaluare, v: string, i: number) => {
      const char = v.toLowerCase();
      const isBulls = char === secret[i];
      return {bulls: acc.bulls + (isBulls ? 1 : 0), cows: acc.cows + (!isBulls && secretSet.has(char) ? 1 : 0)};
    },
    {bulls: 0, cows: 0},
  );
}

function generateSecret(length: number, base: Base, random: () => number = Math.random): string {
  if (length < MIN_SECRET_LENGTH || length > MAX_SECRET_LENGTH) throw new RangeError('Error parameter');
  if (base === Base.bin && length > BINARY_MAX_LENGTH) throw new RangeError('Error parameter');

  const seed = random();

  if (base === Base.bin) {
    return seed < 0.5 ? '01' : '10';
  }

  let baseRandomString = seed.toString(ALPHABETS[base].length);

  if (baseRandomString.startsWith('0.')) {
    baseRandomString = baseRandomString.slice(2);
  }
  baseRandomString = baseRandomString.slice(0, length);
  if (isValidGuess(baseRandomString, length, base)) return baseRandomString;
  let uniqueCharsSecret = Array.from(new Set(baseRandomString)).join('');
  const freeAlphabet = ALPHABETS[base].split('').filter((v: string) => !uniqueCharsSecret.includes(v));
  while (uniqueCharsSecret.length < length) {
    uniqueCharsSecret = uniqueCharsSecret + freeAlphabet.pop();
  }

  return uniqueCharsSecret;
}

function isValidGuess(guess: string, length: number, base: Base): boolean {
  const isValidChar = createDigitValidator(base);
  if (guess.length < MIN_SECRET_LENGTH || guess.length > MAX_SECRET_LENGTH) return false;
  if (base === Base.bin && guess.length > BINARY_MAX_LENGTH) return false;
  if (new Set(guess.toLowerCase()).size !== length) return false;
  return guess.split('').every((char: string) => isValidChar(char));
}

export default {
  countPossibleSecrets,
  createDigitValidator,
  evaluateGuess,
  generateSecret,
  isValidGuess,
};
