import type {Base} from './domain/base';
import type {History} from './storage/history';
import type {WinRecord} from './storage/record';

export interface GameState {
  currentBase: Base;
  currentLength: number;
  currentSecret?: string | undefined;
  winRecords?: WinRecord[];
  currentLog: History[];
  status?: string;
}
