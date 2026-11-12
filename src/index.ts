import './style.css';

import {Base} from './domain/base';
import service from './domain/service';
import type {GameState} from './state';
import type {History} from './storage/history';
import type {WinRecord} from './storage/record';
import storage from './storage/storage';
import {footer} from './views/footer/footer';
import views, {toggleAttemptLock} from './views/main/main';
import {header, updateStartButtonLabel, updateWinHistory} from './views/setting/header';

function createGameStore(initialState: GameState) {
  let state: GameState = initialState;

  return {
    getState: (): GameState => state,
    start: (currentSecret: string): GameState => {
      state = {
        ...state,
        status: 'playing',
        currentSecret,
        currentLog: [],
      };
      return state;
    },
    addAttempt: (entry: History): GameState => {
      const isWin = entry.guess === state.currentSecret;

      state = {
        ...state,
        status: isWin ? 'won' : 'playing',
        currentLog: [...state.currentLog, entry],
      };
      return state;
    },
    setCurrentBase: (currentBase: Base): GameState => {
      state = {
        ...state,
        currentBase,
      };
      return state;
    },
    setCurrentLength: (currentLength: number): GameState => {
      state = {...state, currentLength};
      return state;
    },
    setWinRecords: (winRecords: WinRecord[]): GameState => {
      state = {...state, winRecords};
      return state;
    },
  };
}

export const gameStore = createGameStore({
  status: 'idle',
  currentBase: Base.bin,
  currentLength: service.MIN_SECRET_LENGTH,
  currentSecret: '',
  currentLog: [],
  winRecords: [],
});

function render() {
  storage
    .getItem('wins')
    .then((data) => {
      const wins: WinRecord[] = Array.isArray(data) ? data : [];
      gameStore.setWinRecords(wins);
      updateWinHistory(wins);
      updateStartButtonLabel();
    })
    .catch(() => {
      gameStore.setWinRecords([]);
      updateWinHistory([]);
      updateStartButtonLabel();
    })
    .finally(() => {
      views.root?.append(header, views.main, footer);
      toggleAttemptLock(true);
    });
}

render();
