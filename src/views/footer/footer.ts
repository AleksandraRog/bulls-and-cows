import './footer.css';

import {gameStore} from '../../index';
import type {History} from '../../storage/history';
import type {WinRecord} from '../../storage/record';
import storage from '../../storage/storage';
import {updateWinHistory} from '../setting/header';
import {createView, renderView} from '../utils';

const logTable = renderView<HTMLUListElement>(createView<HTMLOListElement>('ol.log-container'));
export function clearFooterLog() {
  logTable.replaceChildren();
}
export const addLogItem = (item: History) => {
  const logli = renderView<HTMLLIElement>(
    createView<HTMLLIElement>('li.log-item')([
      createView<HTMLSpanElement>('span.result', {text: `Attempt: ${item.guess}`}),
      createView<HTMLSpanElement>('span.evaluare', {
        text: `Score: { bulls:${item.evaluare.bulls}, cows:${item.evaluare.cows} }`,
      }),
    ]),
  );
  logTable.appendChild(logli);
  updateStateLog(item);
};

export function addWinRecord(time: number) {
  const logCount = logTable.childElementCount;
  const gameState = gameStore.getState();
  const recordItem: WinRecord = {
    score: logCount,
    time: time,
    base: gameState.currentBase,
    length: gameState.currentLength,
  };
  const historyCache: WinRecord[] = gameState.winRecords ?? [];
  const newState = gameStore.setWinRecords([...historyCache, recordItem]);
  storage.setItem<WinRecord[]>('wins', newState.winRecords);
  updateWinHistory(newState.winRecords!);
}

function updateStateLog(logItem: History) {
  gameStore.addAttempt(logItem);
}

export const footer: HTMLElement = renderView<HTMLElement>(createView<HTMLElement>('footer.footer')([logTable]));
