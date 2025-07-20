import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ContainerView from '../../../../components/layout/ContainerView';
import Header from '../../../../components/dataDisplay/Header';
import {colors} from '../../../../themes/colors';
import Block from '../../../../components/layout/Block';
import TouchIcon from '../../../../components/dataEntry/Button/TouchIcon';
import {IconSRC} from '../../../../constants/icons';
import {useAppDispatch} from '../../../../redux/store';
import {useTranslation} from 'react-i18next';
import {setChangeLanguage} from '../../../../redux/reducers/application';
import i18n from '../../../../constants/i18n';
import navigation from '../../../../navigation/navigation';
import useLanguage from '../../../../hooks/useLanguage';
import {useAppTheme} from '../../../../themes/ThemeContext';

const LanguageScreen = () => {
  const {top} = useSafeAreaInsets();
  const theme = useAppTheme();
  const dispatch = useAppDispatch();
  const {getTranslation} = useLanguage();
  const [selectLanguage, setSelectLanguage] = useState('vi');

  useEffect(() => {
    // Lấy ngôn ngữ đang lưu trong i18n
    setSelectLanguage(i18n.language || 'vi');
  }, [i18n.language]);

  const changeLanguage = (lng: string, label: string) => {
    dispatch(setChangeLanguage({label, value: lng}));
    i18n.changeLanguage(lng);
  };

  return (
    <ContainerView>
      <Header label={getTranslation('ngon_ngu')} paddingTop={top} />
      <Block
        containerStyle={[styles.bo, {backgroundColor: theme.background_item}]}>
        {/* {languages.map(lng => ( */}
        <TouchIcon
          containerStyle={styles.btn}
          title={`🇻🇳 ${getTranslation('tieng_viet')}`}
          icon={selectLanguage === 'vi' && IconSRC.ic_checksg}
          size={15}
          onPress={() => {
            changeLanguage('vi', 'Tiếng Việt');
            navigation.goBack();
          }}
        />
        <TouchIcon
          containerStyle={[styles.btn, {borderBottomWidth: 0}]}
          title={`🇺🇸 ${getTranslation('tieng_anh')}`}
          icon={selectLanguage === 'en' && IconSRC.ic_checksg}
          size={15}
          onPress={() => {
            changeLanguage('en', 'English');
            navigation.goBack();
          }}
        />
        {/* ))} */}
        {/* <TouchIcon containerStyle={styles.btn} title="Tiếng Anh" /> */}
      </Block>
    </ContainerView>
  );
};

export default LanguageScreen;

const styles = StyleSheet.create({
  bo: {
    paddingHorizontal: 8,
    marginHorizontal: 8,
    marginTop: 20,
    borderRadius: 10,
    shadowColor: colors.gray,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  btn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 0.3,
    borderColor: colors.gray,
    paddingVertical: 15,
    marginRight: 10,
  },
});
