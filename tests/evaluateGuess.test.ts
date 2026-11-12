import service from '../src/domain/service';

describe('evaluateGuess', () => {
  test('variable presence', () => {
    expect(typeof service.evaluateGuess).toBe('function');
  });
  describe('TDD: evaluateGuess (FIRST principles)', () => {
    describe('Basic game logic scenarios', () => {
      test('should return 0 bulls and 0 cows for a completely wrong guess', () => {
        const result = service.evaluateGuess('1234', '5678');
        expect(result).toEqual({bulls: 0, cows: 0});
      });

      test('should correctly count perfect matches as bulls', () => {
        const result = service.evaluateGuess('1234', '1234');
        expect(result).toEqual({bulls: 4, cows: 0});
      });

      test('should correctly count misplaced digits as cows', () => {
        const result = service.evaluateGuess('1234', '4321');
        expect(result).toEqual({bulls: 0, cows: 4});
      });

      test('should correctly calculate mixed bulls and cows', () => {
        const result = service.evaluateGuess('1234', '1249');
        expect(result).toEqual({bulls: 2, cows: 1});
      });
    });
    describe('Hexadecimal case-insensitivity requirements', () => {
      test('should count bulls correctly regardless of character case', () => {
        const result = service.evaluateGuess('a2f4', 'A2F9');
        expect(result).toEqual({bulls: 3, cows: 0});
      });

      test('should count cows correctly regardless of character case', () => {
        const result = service.evaluateGuess('abcd', 'B97C');
        expect(result).toEqual({bulls: 0, cows: 2});
      });

      test('should handle completely mixed cases on a full match', () => {
        const result = service.evaluateGuess('abcdef', 'ABCDEF');
        expect(result).toEqual({bulls: 6, cows: 0});
      });
    });
  });
});
