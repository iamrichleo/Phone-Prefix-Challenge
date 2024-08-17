import { addListener, closeDropdown, DROPDOWN_CSS_CLASSES } from '@finsweet/ts-utils';

import { countriesService, deviceLocationService } from '../../services';
import type { CountriesData } from '../../types';
import {
  createDropdownItem,
  getElementByClass,
  getElementByDataAttribute,
  isDropdownClassMutation,
  setAttribute,
  updateDropdownDisplay,
  updateSelectionState,
} from '../../utils';
import { DATA_ELEMENT_MAP, OPEN_CSS_CLASS } from '../../webflow';
import type { DropdownItem, DropdownOptions } from './types';

export default class PhoneDropdown {
  #items: DropdownItem[] = [];
  #listIsOpen: boolean = false;
  #focusedItem?: DropdownItem;
  #selectedItem?: DropdownItem;
  #dropdownToggle: HTMLDivElement;
  #dropdownList: HTMLElement;
  #list: HTMLElement;
  #countryCodeInput?: HTMLInputElement | null;

  constructor(dropdownElement: HTMLElement, options: DropdownOptions = {}) {
    const { defaultCountryCode: defaultCountryCodeValue, countryCodeInput } = options;

    this.#dropdownToggle = <HTMLDivElement>(
      getElementByClass(dropdownElement, DROPDOWN_CSS_CLASSES.dropdownToggle)
    );
    this.#dropdownList = <HTMLElement>(
      getElementByClass(dropdownElement, DROPDOWN_CSS_CLASSES.dropdownList)
    );
    this.#list = <HTMLElement>getElementByDataAttribute(dropdownElement, DATA_ELEMENT_MAP.list);

    this.#countryCodeInput = countryCodeInput;

    setAttribute(this.#dropdownToggle, 'aria-haspopup', 'listbox');

    this.#initializeDropdown(defaultCountryCodeValue);
  }

  async #initializeDropdown(defaultCountryCode?: string) {
    const countriesData = await countriesService();
    countriesData.sort((a, b) => a.cca2.localeCompare(b.cca2));

    this.#populateDropdown(countriesData);
    this.#registerEventHandlers();
    this.#watchDropdownChanges();

    const deviceCountryCode = await deviceLocationService();

    if (deviceCountryCode) {
      defaultCountryCode = deviceCountryCode;
    }

    const selectedItem = this.#items.find(
      (item) => item?.countriesData?.cca2 === defaultCountryCode
    );

    if (selectedItem) {
      this.#selectDropdownItem(selectedItem);
    }
  }

  #populateDropdown(countriesData: CountriesData[]) {
    const dropdownItem = <HTMLElement>getElementByDataAttribute(this.#list, DATA_ELEMENT_MAP.item)!;

    if (!dropdownItem) return;

    this.#items = countriesData.map((countryData) => {
      const dropdownItemToAdd = <HTMLElement>createDropdownItem(countryData, dropdownItem);

      this.#list.append(dropdownItemToAdd);

      return {
        countriesData: Object.assign({}, countryData),
        element: dropdownItemToAdd,
      };
    });

    this.#list.removeChild(dropdownItem);
  }

  #registerEventHandlers() {
    addListener(this.#dropdownList, 'keydown', (event) => {
      this.#filterItemsByKeypress(event);
      this.#navigateWithKeyboard(event);
    });

    this.#items.forEach((item) => {
      const { element } = item;
      addListener(element, 'click', () => this.#selectDropdownItem(item));
      addListener(element, 'focusin', () => {
        this.#focusedItem = item;
      });
      addListener(element, 'focusout', () => {
        this.#focusedItem = undefined;
      });
    });
  }

  #watchDropdownChanges() {
    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (isDropdownClassMutation(mutation)) {
          this.#handleDropdownStateChange();
        }
      }
    });

    observer.observe(this.#dropdownList, {
      attributes: true,
      attributeFilter: ['class'],
    });
  }

  #handleDropdownStateChange() {
    this.#listIsOpen = this.#dropdownList.classList.contains(OPEN_CSS_CLASS);

    if (this.#listIsOpen) {
      (this.#selectedItem || this.#items[0]).element.focus();
    }
  }

  #filterItemsByKeypress(event: KeyboardEvent) {
    if (this.#listIsOpen) {
      const keyPressed = event.key.toLowerCase();

      const matchedItem = this.#items.find(({ countriesData }) =>
        countriesData?.cca2.toLowerCase().startsWith(keyPressed)
      );

      matchedItem?.element.focus();
    }
  }

  #navigateWithKeyboard(event: KeyboardEvent) {
    const keyHandlers: Record<string, () => void> = {
      ' ': () => this.#focusedItem?.element.click(),
      Tab: () => {
        event.preventDefault();
        closeDropdown(this.#dropdownToggle, event.shiftKey);
      },
      ArrowUp: () => this.#moveFocusInList(-1),
      ArrowDown: () => this.#moveFocusInList(1),
    };

    keyHandlers[event.key]?.();
  }

  #moveFocusInList(direction: 1 | -1) {
    const currentIndex = this.#items.findIndex((item) => item === this.#focusedItem);
    if (currentIndex < 0) return;

    const nextItem = this.#items[currentIndex + direction];
    if (nextItem) {
      nextItem.element.focus();
    }
  }

  #selectDropdownItem(selectedItem: DropdownItem) {
    if (this.#selectedItem === selectedItem) return;
    if (this.#selectedItem) updateSelectionState(this.#selectedItem, false);

    updateSelectionState(selectedItem, true);
    this.#selectedItem = selectedItem;
    updateDropdownDisplay(this.#selectedItem.countriesData, this.#dropdownToggle);

    if (this.#countryCodeInput) {
      this.#countryCodeInput.value = this.#selectedItem.countriesData?.cca2 ?? '';
    }

    if (this.#listIsOpen) {
      closeDropdown(this.#dropdownToggle);
    }
  }
}
