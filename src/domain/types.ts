import {Base} from '../base';

export const ALPHABETS: Record<Base, string> = {
  [Base.bin]: '01',
  [Base.oct]: '01234567',
  [Base.dec]: '0123456789',
  [Base.hex]: '0123456789abcdef',
};

export type Evaluare = {bulls: number; cows: number};
