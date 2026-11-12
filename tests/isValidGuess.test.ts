import {Base} from '../src/domain/base';
import service from '../src/domain/service';

describe('TDD: isValidGuess', () => {
  test('variable presence', () => {
    expect(typeof service.isValidGuess).toBe('function');
  });

  describe('Rule 1: Guess length must strictly match the expected length (Range 2-6)', () => {
    test('should return false when guess length is less than expected', () => {
      expect(service.isValidGuess('123', 4, Base.dec)).toBe(false);
    });

    test('should return false when guess length is greater than expected', () => {
      expect(service.isValidGuess('101', 2, Base.bin)).toBe(false);
    });

    test('should return true when length matches perfectly on the lower bound (2)', () => {
      expect(service.isValidGuess('12', 2, Base.dec)).toBe(true);
    });

    test('should return true when length matches perfectly on the upper bound (6)', () => {
      expect(service.isValidGuess('123456', 6, Base.dec)).toBe(true);
    });
  });
  describe('Rule 2: All characters must be valid digits for the specified base', () => {
    test('should return false if a binary guess contains non-binary characters', () => {
      expect(service.isValidGuess('12', 2, Base.bin)).toBe(false);
    });

    test('should return false if an octal guess contains non-octal characters', () => {
      expect(service.isValidGuess('1238', 4, Base.oct)).toBe(false);
    });

    test('should return false if a decimal guess contains letters', () => {
      expect(service.isValidGuess('123a', 4, Base.dec)).toBe(false);
    });

    test('should return false if a hexadecimal guess contains characters outside a-f', () => {
      expect(service.isValidGuess('123g', 4, Base.hex)).toBe(false);
    });

    test('should return true for valid hexadecimal characters in lower case', () => {
      expect(service.isValidGuess('12ab', 4, Base.hex)).toBe(true);
    });

    test('should return true for valid hexadecimal characters in upper case (Case-insensitivity)', () => {
      expect(service.isValidGuess('12AB', 4, Base.hex)).toBe(true);
    });
  });
  describe('Rule 3: Characters must not repeat (Strict uniqueness)', () => {
    test('should return false if characters repeat in Base.bin (length 2)', () => {
      expect(service.isValidGuess('11', 2, Base.bin)).toBe(false);
      expect(service.isValidGuess('00', 2, Base.bin)).toBe(false);
    });

    test('should return false if characters repeat in Base.dec', () => {
      expect(service.isValidGuess('1233', 4, Base.dec)).toBe(false);
    });

    test('should return false if characters repeat in Base.hex in the same case', () => {
      expect(service.isValidGuess('12aa', 4, Base.hex)).toBe(false);
    });

    test('should return false if characters repeat in Base.hex in DIFFERENT case', () => {
      expect(service.isValidGuess('aA', 2, Base.hex)).toBe(false);
      expect(service.isValidGuess('12aA', 4, Base.hex)).toBe(false);
      expect(service.isValidGuess('bB34', 4, Base.hex)).toBe(false);
    });
  });
});
