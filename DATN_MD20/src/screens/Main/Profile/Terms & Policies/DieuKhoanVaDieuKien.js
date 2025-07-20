import React from 'react';
import {ScrollView, StyleSheet, Text} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Header from '../../../../components/dataDisplay/Header';
import ContainerView from '../../../../components/layout/ContainerView';
import {useAppTheme} from '../../../../themes/ThemeContext';
import useLanguage from '../../../../hooks/useLanguage';
import {TextMedium, TextSmall} from '../../../../components/dataEntry/TextBase';

const DieuKhoanVaDieuKien = () => {
  const {top} = useSafeAreaInsets();
  const theme = useAppTheme();
  const {getTranslation} = useLanguage();

  return (
    <ContainerView>
      <Header
        label={getTranslation('dieu_khoan_va_dieu_kien')}
        paddingTop={top}
      />
      <ScrollView style={[styles.container]}>
        <TextMedium bold style={[styles.title]}>
          1. {getTranslation('gioi_thieu')}:
        </TextMedium>
        <TextSmall style={[styles.text]}>
          {getTranslation('noi_dung_gioi_thieu')}
        </TextSmall>

        <TextMedium bold style={[styles.title]}>
          2. {getTranslation('trach_nhiem_nguoi_dung')}:
        </TextMedium>
        <TextSmall style={[styles.text]}>
          {getTranslation('noi_dung_trach_nhiem')}
        </TextSmall>

        <TextMedium bold style={[styles.title]}>
          3. {getTranslation('sua_doi_dieu_khoan')}:
        </TextMedium>
        <TextSmall style={[styles.text]}>
          {getTranslation('noi_dung_sua_doi')}
        </TextSmall>
      </ScrollView>
    </ContainerView>
  );
};

export default DieuKhoanVaDieuKien;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingTop: 8,
  },
  title: {
    marginTop: 16,
    marginBottom: 6,
  },
  text: {
    lineHeight: 20,
  },
});
