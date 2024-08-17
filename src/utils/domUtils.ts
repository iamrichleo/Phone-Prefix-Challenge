export function getElementByClass(parent: HTMLElement, selector: string): HTMLElement {
  return parent.querySelector(`.${selector}`)!;
}

export function getElementByDataAttribute(
  parent: HTMLElement | Document,
  dataKey: string
): HTMLElement {
  return parent.querySelector(`[data-element="${dataKey}"]`)!;
}

export function setAttribute(element: HTMLElement, name: string, value: string) {
  element.setAttribute(name, value);
}
