import type {Evaluare} from 'src/domain/types';

export interface History {
  readonly guess: string;
  readonly evaluare: Evaluare;
}
