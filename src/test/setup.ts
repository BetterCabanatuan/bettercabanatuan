import '@testing-library/jest-dom/vitest';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import commonEn from '../../public/locales/en/common.json';
import commonFil from '../../public/locales/fil/common.json';

await i18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  defaultNS: 'common',
  ns: ['common'],
  resources: {
    en: { common: commonEn },
    fil: { common: commonFil },
  },
  interpolation: { escapeValue: false },
});
