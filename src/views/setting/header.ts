import './header.css';

import {Base} from '../../domain/base';
import {sortWinRecords} from '../../domain/histories';
import service from '../../domain/service';
import {gameStore} from '../../index';
import type {WinRecord} from '../../storage/record';
import {clearFooterLog} from '../footer/footer';
import {renderNewGame} from '../main/main';
import type {View} from '../view';
import * as utils from './../utils';

const onClickStart = () => {
  renderGame();
};

const startButton = utils.renderView<HTMLButtonElement>(
  utils.createView<HTMLButtonElement>('button.button.header-button', {
    text: 'Start',
    events: {click: onClickStart},
  }),
);

const lengthsCount = service.MAX_SECRET_LENGTH - service.MIN_SECRET_LENGTH + 1;

const lengthOptions: HTMLOptionElement[] = Array.from(
  {length: lengthsCount},
  (_, i) => i + service.MIN_SECRET_LENGTH,
).map((length: number) => {
  const option = utils.renderView<HTMLOptionElement>(
    utils.createView<HTMLOptionElement>('option.option-length', {
      text: String(length),
      attrs: {value: `${length}`},
    }),
  );
  option.selected = length === service.BINARY_MAX_LENGTH;
  if (Number(option.value) > service.BINARY_MAX_LENGTH) {
    option.classList.toggle('deactived', true);
    option.disabled = true;
  }
  return option;
});

const baseOptions = Object.values(Base).map((base: string) => {
  const option = utils.renderView<HTMLOptionElement>(
    utils.createView<HTMLOptionElement>('option.option-base', {
      text: base,
      attrs: {value: base},
    }),
  );

  option.selected = base === Base.bin;
  return option;
});

const baseSelect = utils.renderView<HTMLSelectElement>(
  utils.createView<HTMLSelectElement>('select.select-base', {
    attrs: {id: 'bases'},
    events: {
      change: () => {
        onChangeBase();
        toggleActivedLengthOptions(baseSelect.value !== 'bin');
      },
    },
  })(baseOptions),
);

const lengthSelect = utils.renderView<HTMLSelectElement>(
  utils.createView<HTMLSelectElement>('select.select-length', {
    attrs: {id: 'lengths'},
    events: {
      change: () => onChangeLength(),
    },
  })(lengthOptions),
);

export const historyTableBody = utils.renderView<HTMLTableSectionElement>(
  utils.createView<HTMLTableSectionElement>('tbody.history-body')([createEmptyHistoryRowConfig()]),
);

const historyDropdownConfig = utils.createView<HTMLDetailsElement>('details.history-dropdown')([
  utils.createView<HTMLElement>('summary.history-summary', {text: 'Wins history'}),
  utils.createView<HTMLTableElement>('table.history-table')([
    utils.createView<HTMLTableSectionElement>('thead')([
      utils.createView<HTMLTableRowElement>('tr')([
        utils.createView<HTMLTableCellElement>('th', {text: 'Rating'}),
        utils.createView<HTMLTableCellElement>('th', {text: 'Points'}),
        utils.createView<HTMLTableCellElement>('th', {text: 'Base'}),
        utils.createView<HTMLTableCellElement>('th', {text: 'Length'}),
        utils.createView<HTMLTableCellElement>('th', {text: 'Time'}),
      ]),
    ]),
    historyTableBody,
  ]),
]);

function createEmptyHistoryRowConfig(): View {
  return utils.createView<HTMLTableRowElement>('tr.empty')([
    utils.createView<HTMLTableCellElement>('td', {
      text: 'Побед пока нет',
      attrs: {colspan: '3'},
    }),
  ]);
}

const createHistoryRowConfig = (place: number, record: WinRecord) =>
  utils.createView<HTMLTableRowElement>('tr.history-row')([
    utils.createView<HTMLTableCellElement>('td', {text: `#${place}`}),
    utils.createView<HTMLTableCellElement>('td', {text: String(record.score)}),
    utils.createView<HTMLTableCellElement>('td', {text: String(record.base)}),
    utils.createView<HTMLTableCellElement>('td', {text: String(record.length)}),
    utils.createView<HTMLTableCellElement>('td', {text: `${record.time} sec`}),
  ]);

export function updateStartButtonLabel() {
  const gameState = gameStore.getState();
  const combinations = service.countPossibleSecrets(gameState.currentLength, gameState.currentBase);
  startButton.textContent = `Start (${combinations.toLocaleString('ru-RU')} var.!)`;
}

export function updateWinHistory(records: WinRecord[]) {
  if (!historyTableBody) return;
  if (records.length === 0) {
    const emptyRow = utils.renderView<HTMLTableRowElement>(
      utils.createView<HTMLTableRowElement>('tr.empty')([
        utils.createView<HTMLTableCellElement>('td', {
          text: 'Побед пока нет',
          attrs: {colspan: '3'},
        }),
      ]),
    );
    historyTableBody.replaceChildren(emptyRow);
    return;
  }

  const sortedRecords = sortWinRecords(records);
  const rows = sortedRecords
    .slice(0, 10)
    .map((record: WinRecord, index: number) =>
      utils.renderView<HTMLTableRowElement>(createHistoryRowConfig(index + 1, record)),
    );
  historyTableBody.replaceChildren(...rows);
}

function onChangeBase() {
  gameStore.setCurrentBase(baseOptions?.find((base: HTMLOptionElement) => base.selected)?.value as Base);
  updateStartButtonLabel();
}

function onChangeLength() {
  gameStore.setCurrentLength(
    Number(
      lengthOptions?.find((length: HTMLOptionElement) => {
        return length.selected;
      })?.value,
    ),
  );
  updateStartButtonLabel();
}

const headerConfig = utils.createView<HTMLElement>('header.header')([
  startButton,
  baseSelect,
  lengthSelect,
  historyDropdownConfig,
]);

export const header: HTMLElement = utils.renderView<HTMLElement>(headerConfig);

function toggleActivedLengthOptions(isActived: boolean) {
  lengthOptions.forEach((option: HTMLOptionElement) => {
    if (Number(option.value) > 2) {
      option.classList.toggle('deactived', !isActived);
      option.disabled = !isActived;

      if (!isActived && option.selected) {
        lengthSelect.selectedIndex = 0;
      }
    }
  });
}

function renderGame() {
  toggleSettingLock(true);
  const gameState = gameStore.getState();
  gameStore.start(service.generateSecret(gameState.currentLength, gameState.currentBase));
  renderNewGame();
  clearFooterLog();
}

export function toggleSettingLock(lock: boolean) {
  baseSelect.classList.toggle('lock-click', lock);
  lengthSelect.classList.toggle('lock-click', lock);
  baseSelect.disabled = lock;
  lengthSelect.disabled = lock;
}
