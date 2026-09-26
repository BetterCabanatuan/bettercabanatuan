export type LanguageType =
  | 'en' // English
  | 'fil' // Filipino (standardized Tagalog)
  | 'ceb' // Cebuano/Bisaya
  | 'ilo' // Ilocano
  | 'hil' // Hiligaynon/Ilonggo
  | 'war' // Waray
  | 'pam' // Kapampangan
  | 'bcl' // Bikol
  | 'pag' // Pangasinan
  | 'mag' // Maguindanao
  | 'tsg' // Tausug
  | 'mdh'; // Maranao

export interface NavigationItem {
  label: string;
  href: string;
  children?: NavigationItem[];
}

/** A single footer link. `external` marks absolute URLs that leave the SPA. */
export interface NavigationLink {
  label: string;
  href: string;
  external?: boolean;
}
