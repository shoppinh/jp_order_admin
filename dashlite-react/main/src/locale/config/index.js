import en from '../en/translation.json';
import vi from '../vi/translation.json';
import { convertLanguageJsonToObject } from '../translations';

export const translationsJson = {
  en: {
    translation: en,
  },
  vi: {
    translation: vi,
  },
};

convertLanguageJsonToObject(en);
convertLanguageJsonToObject(vi);
