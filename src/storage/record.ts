import type {Base} from 'src/domain/base';

export interface WinRecord {
  readonly score: number;
  readonly time: number;
  readonly base: Base;
  readonly length: number;
}
