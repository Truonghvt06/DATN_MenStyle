import {StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ContainerView from '../../../../components/layout/ContainerView';
import Header from '../../../../components/dataDisplay/Header';
import Block from '../../../../components/layout/Block';
import TouchIcon from '../../../../components/dataEntry/Button/TouchIcon';
import {IconSRC} from '../../../../constants/icons';
import {useAppDispatch} from '../../../../redux/store';
import {setChangeLanguage} from '../../../../redux/reducers/application';
import i18n from '../../../../constants/i18n';
import navigation from '../../../../navigation/navigation';
import useLanguage from '../../../../hooks/useLanguage';
import {useAppTheme} from '../../../../themes/ThemeContext';

const LanguageScreen = () => {
  const {top} = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const {getTranslation} = useLanguage();
  const theme = useAppTheme();
  const [selectLanguage, setSelectLanguage] = useState('vi');

  useEffect(() => {
    setSelectLanguage(i18n.language || 'vi');
  }, [i18n.language]);

  const changeLanguage = (lng: string, label: string) => {
    dispatch(setChangeLanguage({label, value: lng}));
    i18n.changeLanguage(lng);
  };

  return (
    <ContainerView
      containerStyle={{
        backgroundColor: theme.background,
        paddingTop: top,
      }}>
      <Header
        label={getTranslation('ngon_ngu')}
        paddingTop={top}
        backgroundColor={theme.background}
        textColor={theme.text}
      />
      <Block
        containerStyle={[
          styles.bo,
          {
            backgroundColor: theme.card,
            shadowColor: theme.shadowColor || theme.text,
          },
        ]}>
        <TouchIcon
          containerStyle={[styles.btn, {borderColor: theme.border}]}
          title={`🇻🇳 ${getTranslation('tieng_viet')}`}
          titleStyle={{color: theme.text}}
          icon={selectLanguage === 'vi' && IconSRC.ic_checksg}
          size={15}
          onPress={() => {
            changeLanguage('vi', 'Tiếng Việt');
            navigation.goBack();
          }}
        />
        <TouchIcon
          containerStyle={[styles.btn, {borderColor: theme.border}]}
          title={`🇺🇸 ${getTranslation('tieng_anh')}`}
          titleStyle={{color: theme.text}}
          icon={selectLanguage === 'en' && IconSRC.ic_checksg}
          size={15}
          onPress={() => {
            changeLanguage('en', 'English');
            navigation.goBack();
          }}
        />
      </Block>
    </ContainerView>
  );
};

export default LanguageScreen;

const styles = StyleSheet.create({
  bo: {
    paddingHorizontal: 8,
    marginHorizontal: 8,
    marginTop: 10,
    borderRadius: 10,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
  },
  btn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 0.3,
    paddingVertical: 15,
    marginRight: 10,
  },
});
