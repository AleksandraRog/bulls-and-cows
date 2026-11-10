import {Base} from '../src/base';
import service from '../src/domain/service';
import {ALPHABETS} from '../src/domain/types';

describe('generateSecret', () => {
  test('variable presence', () => {
    expect(typeof service.generateSecret).toBe('function');
  });

  test('should throw an error if length is less than 2', () => {
    expect(() => service.generateSecret(1, Base.dec)).toThrow();
    expect(() => service.generateSecret(1, Base.bin)).toThrow();
    expect(() => service.generateSecret(1, Base.hex)).toThrow();
    expect(() => service.generateSecret(1, Base.oct)).toThrow();
  });
  test('should throw an error if length is greater than 6', () => {
    expect(() => service.generateSecret(8, Base.dec)).toThrow();
    expect(() => service.generateSecret(11, Base.bin)).toThrow();
    expect(() => service.generateSecret(25, Base.hex)).toThrow();
    expect(() => service.generateSecret(16, Base.oct)).toThrow();
  });
});

describe('Result Length and String Structure', () => {
  const validLengths: number[] = [2, 3, 4, 5, 6];
  const bases = [Base.bin, Base.oct, Base.dec, Base.hex];

  bases.forEach((base: Base) => {
    validLengths.forEach((length: number) => {
      test(`should return strict string of length ${length} for base ${base}`, () => {
        if (base === Base.bin && length !== 2) {
          expect(() => service.generateSecret(length, base)).toThrow();
        } else {
          const secret = service.generateSecret(length, base);
          expect(secret.length).toBe(length);
          const allowedChars = ALPHABETS[base];
          for (const char of secret) {
            expect(allowedChars).toContain(char);
          }
        }
      });
    });
  });

  test('should generate exact string for Base.bin (length 2) handling repeats', () => {
    const mockRandom = () => parseInt('01', 2) / parseInt('100', 2);
    const result = service.generateSecret(2, Base.bin, mockRandom);
    expect(result).toBe('01');
    expect(result.length).toBe(2);
  });
  test('should generate exact string for Base.oct (length 4)', () => {
    const mockRandom = () => parseInt('5162', 8) / parseInt('10000', 8);
    const result = service.generateSecret(4, Base.oct, mockRandom);

    expect(result).toBe('5162');
    expect(result.length).toBe(4);
  });
  test('should generate exact string for Base.dec (length 5) with a leading zero', () => {
    const mockRandom = () => 0.07392;
    const result = service.generateSecret(5, Base.dec, mockRandom);

    expect(result).toBe('07392');
    expect(result.length).toBe(5);
  });
  test('should generate exact string for Base.hex (length 6)', () => {
    const mockRandom = () => parseInt('af05b9', 16) / parseInt('1000000', 16);

    const result = service.generateSecret(6, Base.hex, mockRandom);

    expect(result).toBe('af05b9');
    expect(result.length).toBe(6);
  });
  test('should correctly skip duplicate random numbers to maintain unique characters for Base.dec', () => {
    const mockRandom = () => parseInt('4227', 10) / parseInt('100000', 10);

    const result = service.generateSecret(5, Base.dec, mockRandom);
    expect(result.length).toBe(5);
    const uniqueChars = new Set(result);
    expect(uniqueChars.size).toBe(5);
  });
});
