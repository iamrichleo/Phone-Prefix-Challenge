import { PhoneDropdown } from './controllers';
import { getElementByDataAttribute } from './utils';
import { COUNTRY_CODE_SELECTOR, DATA_ELEMENT_MAP } from './webflow';

function initializePhoneDropdown() {
  const dropdownElement = getElementByDataAttribute(document, DATA_ELEMENT_MAP.dropdown);

  if (!dropdownElement) return;

  const parentForm = dropdownElement.parentElement as HTMLFormElement | null;

  if (!parentForm) return;

  const countryCodeInputElement = parentForm.querySelector<HTMLInputElement>(COUNTRY_CODE_SELECTOR);

  new PhoneDropdown(dropdownElement, {
    countryCodeInput: countryCodeInputElement,
    defaultCountryCode: 'US',
  });
}

window.Webflow || (window.Webflow = []);
window.Webflow.push(initializePhoneDropdown);
