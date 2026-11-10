import {Base} from '../src/base';
import service from '../src/domain/service';
import {ALPHABETS} from '../src/domain/types';

describe('TDD: createDigitValidator', () => {
  describe('Step 1: Specific verification of a Curried Factory', () => {
    test('FACT 1 (Currying): Should freeze execution and wait for the second argument', () => {
      const partialFunction = service.createDigitValidator(Base.bin);
      expect(typeof partialFunction).toBe('function');
      expect(partialFunction.length).toBe(1);
    });

    test('FACT 2 (Factory): Should produce unique, independent validation instruments', () => {
      const firstHexValidator = service.createDigitValidator(Base.hex);
      const secondHexValidator = service.createDigitValidator(Base.hex);
      expect(firstHexValidator).not.toBe(secondHexValidator);
    });

    test('FACT 3 (Closure & Context): Produced function must remember its configuration context', () => {
      const isBinDigit = service.createDigitValidator(Base.bin);
      const isDecDigit = service.createDigitValidator(Base.dec);
      expect(isBinDigit('5')).toBe(false);
      expect(isDecDigit('5')).toBe(true);
    });
  });

  describe('Step 2: Full alphabet coverage for all bases', () => {
    test('Binary (Base.bin) - should accept ALL valid symbols', () => {
      const isBinDigit = service.createDigitValidator(Base.bin);
      const validBinSymbols = ALPHABETS[Base.bin].split('');

      validBinSymbols.forEach((char) => {
        expect(isBinDigit(char)).toBe(true);
      });
    });

    test('Octal (Base.oct) - should accept ALL valid symbols', () => {
      const isOctDigit = service.createDigitValidator(Base.oct);
      const validOctSymbols = ALPHABETS[Base.oct].split('');

      validOctSymbols.forEach((char) => {
        expect(isOctDigit(char)).toBe(true);
      });
    });

    test('Decimal (Base.dec) - should accept ALL valid symbols', () => {
      const isDecDigit = service.createDigitValidator(Base.dec);
      const validDecSymbols = ALPHABETS[Base.bin].split('');

      validDecSymbols.forEach((char) => {
        expect(isDecDigit(char)).toBe(true);
      });
    });

    test('Hexadecimal (Base.hex) - should accept ALL valid symbols and letters in any case', () => {
      const isHexDigit = service.createDigitValidator(Base.hex);
      const validHexSymbols = (ALPHABETS[Base.hex] + 'ABCDEF').split('');
      validHexSymbols.forEach((char) => expect(isHexDigit(char)).toBe(true));
    });
  });

  describe('Step 3: Edge cases and invalid characters rejection', () => {
    test('should reject invalid boundaries in numeric alphabets', () => {
      const isBinDigit = service.createDigitValidator(Base.bin);
      const isOctDigit = service.createDigitValidator(Base.oct);

      expect(isBinDigit('2')).toBe(false);
      expect(isOctDigit('8')).toBe(false);
      expect(isOctDigit('9')).toBe(false);
    });

    test('should strictly reject letters outside Hex alphabet in any case', () => {
      const isHexDigit = service.createDigitValidator(Base.hex);

      expect(isHexDigit('g')).toBe(false);
      expect(isHexDigit('G')).toBe(false);
      expect(isHexDigit('z')).toBe(false);
      expect(isHexDigit('Z')).toBe(false);
    });

    test('should reject special characters, punctuation, spaces, and empty strings', () => {
      const isDecDigit = service.createDigitValidator(Base.dec);

      expect(isDecDigit('')).toBe(false);
      expect(isDecDigit(' ')).toBe(false);
      expect(isDecDigit('/')).toBe(false);
      expect(isDecDigit(':')).toBe(false);
      expect(isDecDigit('-')).toBe(false);
    });
  });
});
