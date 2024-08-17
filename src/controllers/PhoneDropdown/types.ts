import type { CountriesData } from '../../types';

export interface DropdownOptions {
  defaultCountryCode?: string;
  countryCodeInput?: HTMLInputElement | null;
}

export interface DropdownItem {
  element: HTMLElement;
  countriesData: CountriesData;
}
