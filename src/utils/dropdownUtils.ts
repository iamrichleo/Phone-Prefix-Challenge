import { cloneNode, CURRENT_CSS_CLASS, DROPDOWN_CSS_CLASSES } from '@finsweet/ts-utils';

import type { DropdownItem } from '../controllers';
import type { CountriesData, Flags, IDD } from '../types';
import { DATA_ELEMENT_MAP } from '../webflow';
import { getElementByDataAttribute, setAttribute } from './domUtils';

function prepareDropdownElement(
  dropdownItem: HTMLElement,
  { name: { common: countryName } }: CountriesData
): HTMLElement {
  const element = cloneNode(dropdownItem);

  element.classList.remove(CURRENT_CSS_CLASS);

  setAttribute(element, 'title', countryName);
  setAttribute(element, 'aria-label', countryName);

  return element;
}

function getDropdownElements(targetElement: HTMLElement) {
  const flagElement = <HTMLImageElement>(
    getElementByDataAttribute(targetElement, DATA_ELEMENT_MAP.flag)
  );
  const valueElement = <HTMLElement>(
    getElementByDataAttribute(targetElement, DATA_ELEMENT_MAP.value)
  );

  if (!flagElement || !valueElement) return null;

  return { flagElement, valueElement };
}

function setFlagAttributes(flagElement: HTMLImageElement, countryName: string, flags: Flags) {
  flagElement.src = flags.svg || flags.png;
  flagElement.alt = `Flag of ${countryName}`;
}

function getDropdownValue(targetElement: HTMLElement, idd: IDD, cca2: string) {
  const isDropdownToggle = targetElement.classList.contains(DROPDOWN_CSS_CLASSES.dropdownToggle);
  return isDropdownToggle ? `${idd.root}${idd.suffixes.length === 1 ? idd.suffixes[0] : ''}` : cca2;
}

function toggleSelectionClass(element: HTMLElement, shouldSelect: boolean) {
  element.classList[shouldSelect ? 'add' : 'remove'](CURRENT_CSS_CLASS);
}

export function createDropdownItem(
  countryData: CountriesData,
  dropdownItem: HTMLElement
): HTMLElement {
  const clonedElement = prepareDropdownElement(dropdownItem, countryData);

  updateDropdownDisplay(countryData, clonedElement);

  return clonedElement;
}

export function updateDropdownDisplay(countryData: CountriesData, targetElement: HTMLElement) {
  const { name, flags, idd, cca2 } = countryData;

  const elements = getDropdownElements(targetElement);
  if (!elements) return;

  const { flagElement, valueElement } = elements;

  setFlagAttributes(flagElement, name.common, flags);

  const valueText = getDropdownValue(targetElement, idd, cca2);
  valueElement.textContent = valueText;
}

export function updateSelectionState(dropdownItem: DropdownItem, isSelected: boolean = true) {
  const { element } = dropdownItem;

  toggleSelectionClass(element, isSelected);
  element.setAttribute('aria-selected', `${isSelected}`);
}

export function isDropdownClassMutation(mutation: MutationRecord) {
  return mutation.type === 'attributes' && mutation.attributeName === 'class';
}
