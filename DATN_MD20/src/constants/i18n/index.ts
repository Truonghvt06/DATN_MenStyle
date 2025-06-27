import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import en from '../locales/en.json';
import vi from '../locales/vi.json';

export type KeyName = keyof typeof vi;
export const LANG_KEY = 'language';

const languageDetector = {
  type: 'languageDetector',
  async: true,
  detect: (callback: (lang: string) => void) => {
    AsyncStorage.getItem(LANG_KEY).then(lang => {
      callback(lang || 'vi');
    });
  },
  init: () => {},
  cacheUserLanguage: (lang: string) => {
    AsyncStorage.setItem(LANG_KEY, lang);
  },
};

i18n
  .use(languageDetector as any)
  .use(initReactI18next)
  .init({
    fallbackLng: 'vi',
    compatibilityJSON: 'v4',
    resources: {
      en: {translation: en},
      vi: {translation: vi},
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
