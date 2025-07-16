import React from 'react';
import {ScrollView, StyleSheet, Text} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Header from '../../../../components/dataDisplay/Header';
import ContainerView from '../../../../components/layout/ContainerView';
import {useAppTheme} from '../../../../themes/ThemeContext';
import useLanguage from '../../../../hooks/useLanguage';

const DieuKhoanVaDieuKien = () => {
  const {top} = useSafeAreaInsets();
  const theme = useAppTheme();
  const {getTranslation} = useLanguage();

  return (
    <ContainerView
      containerStyle={{backgroundColor: theme.background, paddingTop: top}}>
      <Header
        label={getTranslation('dieu_khoan_va_dieu_kien')}
        paddingTop={top}
        backgroundColor={theme.background}
        textColor={theme.text}
      />
      <ScrollView style={[styles.container]}>
        <Text style={[styles.title, {color: theme.text}]}>
          {getTranslation('gioi_thieu')}
        </Text>
        <Text style={[styles.text, {color: theme.text}]}>
          {getTranslation('noi_dung_gioi_thieu')}
        </Text>

        <Text style={[styles.title, {color: theme.text}]}>
          {getTranslation('trach_nhiem_nguoi_dung')}
        </Text>
        <Text style={[styles.text, {color: theme.text}]}>
          {getTranslation('noi_dung_trach_nhiem')}
        </Text>

        <Text style={[styles.title, {color: theme.text}]}>
          {getTranslation('sua_doi_dieu_khoan')}
        </Text>
        <Text style={[styles.text, {color: theme.text}]}>
          {getTranslation('noi_dung_sua_doi')}
        </Text>
      </ScrollView>
    </ContainerView>
  );
};

export default DieuKhoanVaDieuKien;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 6,
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
  },
});
