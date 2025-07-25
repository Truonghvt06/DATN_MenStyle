import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useMemo, useState} from 'react';
import ContainerView from '../../../../../components/layout/ContainerView';
import Header from '../../../../../components/dataDisplay/Header';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useAppTheme} from '../../../../../themes/ThemeContext';
import useLanguage from '../../../../../hooks/useLanguage';
import {voucherData} from '../../../../../constants/data';
import {TextSmall} from '../../../../../components/dataEntry/TextBase';
import ButtonBase from '../../../../../components/dataEntry/Button/ButtonBase';
import navigation from '../../../../../navigation/navigation';
import ScreenName from '../../../../../navigation/ScreenName';
import ItemRated from './ItemRated';
import Block from '../../../../../components/layout/Block';
import ItemNotRated from './ItemNotRated';

const ManageReviewScreen = () => {
  const {top} = useSafeAreaInsets();
  const theme = useAppTheme();
  const {getTranslation} = useLanguage();
  const [selectedTab, setSelectedTab] = useState('Chưa đánh giá');

  const tabs = ['Chưa đánh giá', 'Đã đánh giá'];

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

  const handleReview = () => {
    navigation.navigate(ScreenName.Main.AddReview);
  };
  const handleProductDetail = () => {
    // navigation.navigate(ScreenName.Main.AddReview);
  };

  const renderTab = (tab: string) => (
    <View
      key={tab}
      style={{
        width: '50%',
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
      <Header label={'Đánh giá của tôi'} paddingTop={top} />
      <View style={[styles.tab, {borderColor: theme.border_color}]}>
        {tabs.map(renderTab)}
      </View>
      <Block padH={8} padT={10} padB={30}>
        <ItemRated
          name={'Áo Polo Nam Coolmate Premium'}
          image={''}
          id_order={'#54354'}
          size={'L'}
          color={'Đỏ'}
          deliveredAt={'12/12/2024'}
          onPress={() => {
            handleReview();
          }}
        />
      </Block>
      <Block>
        <ItemNotRated
          avatar=""
          nameUser="truong"
          namePro={'Áo Polo Nam Coolmate Premium'}
          image={''}
          id_order={'#54354'}
          size={'L'}
          color={'Đỏ'}
          star={'4'}
          date={'12/12/2024'}
          comment={'đẹp lắm'}
          onPress={() => {
            handleProductDetail();
          }}
        />
        <ItemNotRated
          avatar=""
          nameUser="truong"
          namePro={'Áo Polo Nam Coolmate Premium'}
          image={''}
          id_order={'#54354'}
          size={'L'}
          color={'Đỏ'}
          star={'4'}
          date={'12/12/2024'}
          comment={'đẹp lắm'}
          onPress={() => {
            handleProductDetail();
          }}
        />
      </Block>
    </ContainerView>
  );
};

export default ManageReviewScreen;

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
