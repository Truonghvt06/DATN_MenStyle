import React from 'react';
import {ScrollView, StyleSheet, Text} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import Header from '../../../../components/dataDisplay/Header';
import ContainerView from '../../../../components/layout/ContainerView';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useAppTheme} from '../../../../themes/ThemeContext';
import useLanguage from '../../../../hooks/useLanguage';
import {TextMedium, TextSmall} from '../../../../components/dataEntry/TextBase';

const ChinhSach = () => {
  const {top} = useSafeAreaInsets();
  const theme = useAppTheme();
  const {getTranslation} = useLanguage();

  return (
    <ContainerView>
      <Header label={getTranslation('chinh_sach_rieng_tu')} paddingTop={top} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={{paddingBottom: 40}}>
        <TextMedium bold style={[styles.title]}>
          1. {getTranslation('thu_thap_thong_tin')}:
        </TextMedium>
        <TextSmall style={[styles.text, {color: theme.text}]}>
          {getTranslation('noi_dung_thu_thap')}
        </TextSmall>

        <TextMedium bold style={[styles.title]}>
          2. {getTranslation('su_dung_thong_tin')}:
        </TextMedium>
        <TextSmall style={[styles.text, {color: theme.text}]}>
          {getTranslation('noi_dung_su_dung')}
        </TextSmall>

        <TextMedium bold style={[styles.title]}>
          3. {getTranslation('bao_mat')}:
        </TextMedium>
        <TextSmall style={[styles.text, {color: theme.text}]}>
          {getTranslation('noi_dung_bao_mat')}
        </TextSmall>
      </ScrollView>
    </ContainerView>
  );
};

export default ChinhSach;

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
