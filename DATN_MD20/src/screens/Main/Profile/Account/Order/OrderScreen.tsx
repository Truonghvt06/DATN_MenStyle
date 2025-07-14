import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useMemo, useRef, useState} from 'react';
import ContainerView from '../../../../../components/layout/ContainerView';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Header from '../../../../../components/dataDisplay/Header';
import {dataItemOrder, dataProduct} from '../../../../../constants/data';
import {colors} from '../../../../../themes/colors';
import Block from '../../../../../components/layout/Block';
import {TextSmall} from '../../../../../components/dataEntry/TextBase';
import metrics from '../../../../../constants/metrics';
import OrderItem from '../../../../../components/dataDisplay/Order/OrderItem';
import navigation from '../../../../../navigation/navigation';
import ScreenName from '../../../../../navigation/ScreenName';
import useLanguage from '../../../../../hooks/useLanguage';
import {useAppTheme} from '../../../../../themes/ThemeContext';

const OrderScreen = () => {
  const {top} = useSafeAreaInsets();
  const {getTranslation} = useLanguage();
  const theme = useAppTheme();

  const [selectedTab, setSelectedTab] = useState(getTranslation('cho_xac_nhan'));

  const dataOrder = [
    {id: 'o1', name: getTranslation('tat_ca')},
    {id: 'o2', name: getTranslation('cho_xac_nhan')},
    {id: 'o3', name: getTranslation('da_xac_nhan')},
    {id: 'o4', name: getTranslation('cho_giao_hang')},
    {id: 'o5', name: getTranslation('da_giao')},
    {id: 'o6', name: getTranslation('da_huy')},
  ];

  const handleTabPress = (tab: string) => {
    setSelectedTab(tab);
  };

  const filteredProducts = useMemo(() => {
    if (selectedTab === getTranslation('tat_ca')) return dataProduct;
    return dataProduct.filter(item => item.status === selectedTab);
  }, [selectedTab]);

  const renderTab = (item: any) => (
    <TouchableOpacity
      key={item.id}
      activeOpacity={0.9}
      onPress={() => handleTabPress(item.name)}
      style={[
        styles.itemtab,
        {
          borderBottomColor:
            selectedTab === item.name ? theme.text : 'transparent',
        },
      ]}>
      <TextSmall
        medium
        style={{
          color: selectedTab === item.name ? theme.text : theme.text + '77',
        }}>
        {item.name}
      </TextSmall>
    </TouchableOpacity>
  );

  return (
    <ContainerView
      containerStyle={{
        backgroundColor: theme.background,
        paddingTop: top,
      }}>
      <Header
        label={getTranslation('don_hang')}
        paddingTop={top}
        backgroundColor={theme.background}
        textColor={theme.text}
      />
      <View style={{backgroundColor: theme.card, paddingHorizontal: 5}}>
        <ScrollView
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tab}
          horizontal>
          {dataOrder.map(renderTab)}
        </ScrollView>
      </View>
      <FlatList
        data={filteredProducts}
        keyExtractor={item => `od-${item.id}`}
        renderItem={({item}) => (
          <OrderItem
            code_order={item.id}
            date={item.createdAt}
            total={item.total}
            status={item.status}
            data={dataItemOrder}
            onPress={() => {
              navigation.navigate(ScreenName.Main.OrderDetail, {orders: item});
            }}
          />
        )}
        ListEmptyComponent={
          <Block alignCT padT={30}>
            <TextSmall color={theme.text}>
              {/* {getTranslation('khong_co_don_hang')} */}
            </TextSmall>
          </Block>
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: 15,
          paddingBottom: 30,
          paddingHorizontal: metrics.space,
        }}
      />
    </ContainerView>
  );
};

export default OrderScreen;

const styles = StyleSheet.create({
  itemtab: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottomWidth: 2,
    alignItems: 'center',
  },
  tab: {
    borderBottomWidth: 0.3,
    borderBottomColor: colors.gray1,
  },
});
