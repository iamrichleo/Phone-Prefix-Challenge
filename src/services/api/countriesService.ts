import type { CountriesData } from '../../types';
import fetchRequest from './fetchRequest';

export default async function fetchCountries(): Promise<CountriesData[]> {
  try {
    const restCountriesAPI = 'https://restcountries.com/v3.1/all?fields=name,cca2,idd,flags';

    // Use fetchRequest and specify the response type as 'json'
    const countriesData = await fetchRequest<CountriesData[]>(restCountriesAPI, {
      responseType: 'json',
    });
    return countriesData;
  } catch (error) {
    console.error('Error fetching countries data:', error);
    return [];
  }
}
