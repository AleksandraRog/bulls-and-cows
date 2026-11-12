import type {AllHTMLElements, View, ViewBuilder} from './view';

export function renderView<T extends AllHTMLElements>(view: View): T {
  const {tag = 'div'} = view;
  const element: T = document.createElement(tag) as T;

  view.classList?.forEach((className: string) => {
    element.classList.add(className);
  });

  if (view.text) {
    element.textContent = view.text;
  }
  if (view.attrs) {
    Object.entries(view.attrs).forEach(([k, v]) => element.setAttribute(k, v));
  }

  if (view.value && 'value' in element) {
    element.value = view.value;
  }

  if (view.events) {
    Object.entries(view.events).forEach(([eventName, handler]) => {
      if (typeof handler === 'function') {
        element.addEventListener(eventName, handler as EventListener);
      }
    });
  }

  view.inners?.forEach((innerElement: View | HTMLElement) => {
    if (innerElement instanceof HTMLElement) {
      element.appendChild(innerElement);
    } else {
      element.appendChild(renderView(innerElement));
    }
  });

  return element;
}

export function createView<T extends HTMLElement>(
  tagAndClasses: string,
  config?: Omit<View, 'tag' | 'classList' | 'inners'>,
): ViewBuilder<T> {
  let targetString = tagAndClasses?.trim() ?? 'div';
  if (targetString.startsWith('.')) targetString = 'div' + targetString;

  const parts = targetString.split('.');
  const tag = parts[0] || 'div';
  const classNames = parts.slice(1);

  const baseConfig: View = {...config, tag};
  if (classNames.length > 0) baseConfig.classList = classNames;

  const builder = function (children: (View | HTMLElement)[]): View {
    return {...baseConfig, inners: [...(baseConfig.inners || []), ...(children.length > 0 ? children : [])]};
  };
  Object.assign(builder, baseConfig);
  return builder as unknown as ViewBuilder<T>;
}

export default {
  renderView,
  createView,
};
