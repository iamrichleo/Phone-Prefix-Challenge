export interface IDD {
  root: string;
  suffixes: string[];
}

export interface Flags {
  svg: string;
  png: string;
  alt?: string;
}

export interface CountriesData {
  name: { common: string };
  cca2: string;
  idd: IDD;
  flags: Flags;
}
