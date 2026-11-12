export interface View {
  tag: string;
  classList?: string[];
  inners?: (View | HTMLElement)[];
  text?: string;
  value?: string;
  attrs?: Record<string, string>;
  events?: {
    [K in keyof HTMLElementEventMap]?: (event: Event) => void;
  };
}

export type ViewBuilder<T extends HTMLElement> = View & {
  (inners: (View | HTMLElement)[]): ViewBuilder<T>;
};

export type AllHTMLElements = HTMLElementTagNameMap[keyof HTMLElementTagNameMap];
