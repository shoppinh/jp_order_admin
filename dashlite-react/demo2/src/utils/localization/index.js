import i18next from 'i18next';
import { DEFAULT_LOCALE, WEEKSTARTDATE } from './config';

export const fetchCurrentLocale = () => {
  // return localStorage.getItem("i18nextLng") || DEFAULT_LOCALE;
  const currentLocale = i18next.language;
  const twoCharCode = currentLocale.split('-').shift();
  return twoCharCode || i18next.language;
};

export const checkWeekStartsOn = () => {
  const currentLocale = localStorage.getItem('i18nextLng') || DEFAULT_LOCALE;
  return WEEKSTARTDATE[currentLocale];
};

export const filterLanguageCode = (code, languages) => {
  if (!languages.includes(code)) {
    const filterdLA = languages.filter((item) => item.includes(code) || code.includes(item));
    if (filterdLA.length === 0) {
      return DEFAULT_LOCALE;
    } else {
      return filterdLA[0];
    }
  }
  return code;
};
