import * as utils from './utils';

const toastElement = utils.renderView<HTMLDivElement>(utils.createView<HTMLDivElement>('div.error-toast'));

let hideTimeoutId: number | null = null;

export function showToast(message: string, durationMs = 2500) {
  if (!toastElement.isConnected) {
    document.body.append(toastElement);
  }

  if (hideTimeoutId !== null) {
    clearTimeout(hideTimeoutId);
  }

  toastElement.textContent = message;
  toastElement.classList.add('visible');

  hideTimeoutId = window.setTimeout(() => {
    toastElement.classList.remove('visible');
    hideTimeoutId = null;
  }, durationMs);
}
