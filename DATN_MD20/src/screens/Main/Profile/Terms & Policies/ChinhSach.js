import React from 'react';
import {ScrollView, StyleSheet, Text} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import Header from '../../../../components/dataDisplay/Header';
import ContainerView from '../../../../components/layout/ContainerView';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useAppTheme} from '../../../../themes/ThemeContext';
import useLanguage from '../../../../hooks/useLanguage';

const ChinhSach = () => {
  const {top} = useSafeAreaInsets();
  const theme = useAppTheme();
  const {getTranslation} = useLanguage();

  return (
    <ContainerView
      containerStyle={{
        backgroundColor: theme.background,
        paddingTop: top,
      }}>
      <Header
        label={getTranslation('chinh_sach_rieng_tu')}
        paddingTop={top}
        backgroundColor={theme.background}
        textColor={theme.text}
      />
      <ScrollView
        style={styles.container}
        contentContainerStyle={{paddingBottom: 40}}>
        <Text style={[styles.title, {color: theme.text}]}>
          1. {getTranslation('thu_thap_thong_tin')}
        </Text>
        <Text style={[styles.text, {color: theme.text}]}>
          {getTranslation('noi_dung_thu_thap')}
        </Text>

        <Text style={[styles.title, {color: theme.text}]}>
          2. {getTranslation('su_dung_thong_tin')}
        </Text>
        <Text style={[styles.text, {color: theme.text}]}>
          {getTranslation('noi_dung_su_dung')}
        </Text>

        <Text style={[styles.title, {color: theme.text}]}>
          3. {getTranslation('bao_mat')}
        </Text>
        <Text style={[styles.text, {color: theme.text}]}>
          {getTranslation('noi_dung_bao_mat')}
        </Text>
      </ScrollView>
    </ContainerView>
  );
};

export default ChinhSach;

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
