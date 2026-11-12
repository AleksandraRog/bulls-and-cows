import * as utils from '../utils';

export const timerDisplay = utils.renderView<HTMLSpanElement>(
  utils.createView<HTMLSpanElement>('span.timer', {text: '00:00'}),
);

let startTime = 0;
let intervalId: number | null = null;
let elapsedSeconds = 0;

export function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export function startTimer() {
  stopTimer();
  elapsedSeconds = 0;
  startTime = Date.now();
  timerDisplay.textContent = '00:00';

  intervalId = window.setInterval(() => {
    elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
    timerDisplay.textContent = formatTime(elapsedSeconds);
  }, 1000);
}

export function stopTimer(): number {
  if (intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
  }
  return elapsedSeconds;
}
