import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useMemo, useState} from 'react';
import ContainerView from '../../../../../components/layout/ContainerView';
import Header from '../../../../../components/dataDisplay/Header';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import useLanguage from '../../../../../hooks/useLanguage';
import {useAppTheme} from '../../../../../themes/ThemeContext';
import VoucherItem from './VoucherItem';
import {voucherData} from '../../../../../constants/data';
import {TextSmall} from '../../../../../components/dataEntry/TextBase';
import {ToastAndroid, Platform, Alert} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import Toast from 'react-native-toast-message';
import configToast from '../../../../../components/utils/configToast';

const VoucherScreen = () => {
  const {top} = useSafeAreaInsets();
  const theme = useAppTheme();
  const {getTranslation} = useLanguage();
  const [selectedTab, setSelectedTab] = useState(getTranslation('tat_ca'));

  const tabs = [
    getTranslation('tat_ca'),
    'Voucher Shop',
    'Vận chuyển',
    // getTranslation('moi_nhat'),
    // getTranslation('ban_chay'),
  ];

  const filteredProducts = useMemo(() => {
    if (!voucherData) return [];
    switch (selectedTab) {
      case 'Voucher Shop':
        return [...voucherData].filter(item => item.voucher_scope === 'order');
      case 'Vận chuyển':
        return [...voucherData].filter(
          item => item.voucher_scope === 'shipping',
        );
      case getTranslation('tat_ca'):
        return voucherData;
      default:
        return voucherData;
    }
  }, [selectedTab, voucherData]);

  const handleCoppy = (code: string) => {
    if (code) {
      Clipboard.setString(code);
      // Hiển thị thông báo khi copy thành công
      // if (Platform.OS === 'android') {
      //   ToastAndroid.show('Đã sao chép mã: ' + code, ToastAndroid.SHORT);
      // } else {
      // Alert.alert('Đã sao chép', `Mã voucher ${code} đã được sao chép`);
      Toast.show({
        type: 'notification',
        position: 'top',
        text1: 'Thành công',
        text2: 'Sao chép mã thành công',
        visibilityTime: 1000,
        autoHide: true,
        swipeable: true,
      });
      // }
    }
  };

  const renderTab = (tab: string) => (
    <View
      key={tab}
      style={{
        width: '33.9%',
        flexDirection: 'row',
        justifyContent: 'center',
      }}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => setSelectedTab(tab)}
        style={[
          styles.itemtab,
          {
            backgroundColor: theme.background,
            borderBottomColor:
              selectedTab === tab ? theme.primary : 'transparent',
          },
        ]}>
        <TextSmall
          style={{
            color: selectedTab === tab ? theme.primary : theme.text,
          }}>
          {tab}
        </TextSmall>
      </TouchableOpacity>
    </View>
  );

  return (
    <ContainerView>
      <Header label={getTranslation('ma_giam_gia')} paddingTop={top} />
      <View style={[styles.tab, {borderColor: theme.border_color}]}>
        {tabs.map(renderTab)}
      </View>
      <FlatList
        data={filteredProducts}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => (
          <VoucherItem
            image={item.image}
            title={item.title}
            description={item.description}
            voucher_scope={item.voucher_scope}
            discount_type={item.discount_type}
            max_discount_value={item.max_discount_value}
            discount_value={item.discount_value}
            min_order_amount={item.min_order_amount}
            code={item.code}
            onPress={() => {
              handleCoppy(item.code);
            }}
          />
        )}
        contentContainerStyle={{
          paddingHorizontal: 8,
          paddingTop: 15,
          paddingBottom: 16,
        }}
        showsVerticalScrollIndicator={false}
      />
      {/* <Toast config={configToast} /> */}
    </ContainerView>
  );
};

export default VoucherScreen;

const styles = StyleSheet.create({
  tab: {
    width: '100%',
    flexDirection: 'row',
    borderBottomWidth: 0.2,
    marginTop: 15,
  },
  itemtab: {
    width: '100%',
    paddingBottom: 8,
    borderBottomWidth: 2,
    alignItems: 'center',
  },
});
