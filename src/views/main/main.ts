import './main.css';

import service from '../../domain/service';
import type {Evaluare} from '../../domain/types';
import {gameStore} from '../../index';
import {addLogItem, addWinRecord} from '../footer/footer';
import {toggleSettingLock} from '../setting/header';
import {showToast} from '../toast';
import * as utils from './../utils';
import {startTimer, stopTimer, timerDisplay} from './timer';

const root = document.querySelector<HTMLBodyElement>('body');
const inputConfig = utils.createView<HTMLInputElement>('input.input', {
  events: {beforeinput: onEditText},
  attrs: {type: 'text', value: ''},
});

const input = utils.renderView<HTMLInputElement>(inputConfig);
export function setMaxLengthInput(newMaxLength: number) {
  input.maxLength = newMaxLength;
}

function onEditText(event: Event) {
  const inputEvent = event as InputEvent;
  const insertedText = inputEvent.data;

  if (!insertedText) return;
  const gameState = gameStore.getState();
  const isValidChar = service.createDigitValidator(gameState.currentBase);
  const validText = insertedText
    .split('')
    .filter((char) => isValidChar(char) && !input.value.toLowerCase().includes(char.toLowerCase()))
    .join('');
  if (validText === insertedText) return;
  event.preventDefault();
  if (validText.length > 0) {
    const input = event.target as HTMLInputElement;
    const start = input.selectionStart ?? input.value.length;
    const end = input.selectionEnd ?? input.value.length;

    input.setRangeText(validText, start, end, 'end');
  }
}

const onClickApprove = () => {
  const gameState = gameStore.getState();
  if (!service.isValidGuess(input.value, gameState.currentLength, gameState.currentBase)) {
    showDialog('error');
    return;
  }
  const currentScore = service.evaluateGuess(gameState.currentSecret ?? '', input.value);
  renderCurrentScore(currentScore);
  sendHistory(input.value, currentScore);
  if (currentScore.bulls === gameState.currentLength) {
    const time = stopTimer();
    showDialog('win');
    input.value = '';
    removeSettingLock();
    toggleAttemptLock(true);
    addWinRecord(time);
  }
};

function sendHistory(guess: string, message: Evaluare) {
  addLogItem({guess: guess, evaluare: message});
}

function showDialog(type: string) {
  if (type === 'error') {
    showToast(`Input Error`);
  } else if (type === 'win') {
    showToast('Win!!!');
  }
}

function removeSettingLock() {
  toggleSettingLock(false);
}

const bullsCount = utils.renderView(utils.createView('span.count', {text: '0'}));
const cowsCount = utils.renderView(utils.createView('span.count', {text: '0'}));

const approveButton = utils.renderView<HTMLButtonElement>(
  utils.createView<HTMLButtonElement>('button.button.approve-button', {
    text: 'approve',
    events: {click: onClickApprove},
  }),
);

export const mainConfig = utils.createView<HTMLElement>('main.main')([
  timerDisplay,
  utils.createView<HTMLHeadingElement>('h2.round-score', {text: 'round score:'})([
    utils.createView('em.title-bulls', {text: 'bulls:'}),
    bullsCount,
    utils.createView('em.title-cows', {text: 'cows:'}),
    cowsCount,
  ]),
  utils.createView<HTMLLabelElement>('label.label', {text: 'Add'}),
  input,
  approveButton,
]);

export function renderNewGame() {
  bullsCount.textContent = '0';
  cowsCount.textContent = '0';
  input.value = '';
  toggleAttemptLock(false);
  startTimer();
}

export function renderCurrentScore(score: Evaluare) {
  bullsCount.textContent = String(score.bulls);
  cowsCount.textContent = String(score.cows);
}

export function toggleAttemptLock(lock: boolean) {
  input.classList.toggle('lock-click', lock);
  approveButton.classList.toggle('lock-click', lock);
}

const main: HTMLElement = utils.renderView<HTMLElement>(mainConfig);

export default {root, main};
