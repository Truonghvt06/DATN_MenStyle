import {changeLanguage} from './../../node_modules/i18next/index.d';
import {useTranslation} from 'react-i18next';
import i18n, {KeyName} from '../constants/i18n';

const useLanguage = () => {
  const {t} = useTranslation();

  const getTranslation = (
    key: KeyName,
    options?: Record<string, string | number>,
  ) => {
    if (options) return t(key, options);
    return t(key);
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };
  return {getTranslation, changeLanguage};
};
export default useLanguage;
