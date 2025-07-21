import {FlatList, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import ContainerView from '../../../../../components/layout/ContainerView';
import Header from '../../../../../components/dataDisplay/Header';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import useLanguage from '../../../../../hooks/useLanguage';
import {useAppTheme} from '../../../../../themes/ThemeContext';
import VoucherItem from './VoucherItem';
import {voucherData} from '../../../../../constants/data';

const VoucherScreen = () => {
  const {top} = useSafeAreaInsets();
  const theme = useAppTheme();
  const {getTranslation} = useLanguage();
  return (
    <ContainerView>
      <Header label={getTranslation('ma_giam_gia')} paddingTop={top} />
      <FlatList
        data={voucherData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => <VoucherItem />}
        contentContainerStyle={{
          paddingHorizontal: 8,
          paddingTop: 10,
          paddingBottom: 16,
        }}
        showsVerticalScrollIndicator={false}
      />
    </ContainerView>
  );
};

export default VoucherScreen;

const styles = StyleSheet.create({});
