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
import {
  dataItemOrder,
  dataOrder,
  dataProduct,
} from '../../../../../constants/data';
import {colors} from '../../../../../themes/colors';
import Block from '../../../../../components/layout/Block';
import {TextSmall} from '../../../../../components/dataEntry/TextBase';
import metrics from '../../../../../constants/metrics';
import OrderItem from '../../../../../components/dataDisplay/Order/OrderItem';
import navigation from '../../../../../navigation/navigation';
import ScreenName from '../../../../../navigation/ScreenName';

const OrderScreen = () => {
  const {top} = useSafeAreaInsets();
  const [selectedTab, setSelectedTab] = useState('Chờ xác nhận');

  const handleTabPress = (tab: string) => {
    setSelectedTab(tab);
  };
  //   const productsByCategory = dataProduct.filter(p => p.category === name);

  const bg = useRef(null);

  const filteredProducts = useMemo(() => {
    // Sau đó sắp xếp theo tab
    switch (selectedTab) {
      case 'Chờ xác nhận':
        return [...dataProduct].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
      case 'Đã xác nhận':
      // return [...dataProduct].sort((a, b) => b.status - a.sold);
      case 'Chờ giao hàng':
        return [...dataProduct].sort((a, b) => a.price - b.price);
      case 'Đã giao ':
        return [...dataProduct].sort((a, b) => a.price - b.price);
      case 'Đã huỷ':
        return [...dataProduct].sort((a, b) => a.price - b.price);

      case 'Tất cả':
      default:
        return dataProduct;
    }
  }, [selectedTab]);

  const renderTab = (item: any) => (
    <>
      <TouchableOpacity
        activeOpacity={0.9}
        key={item.id}
        onPress={() => handleTabPress(item.name)}
        style={[
          styles.itemtab,
          {
            borderBottomColor:
              selectedTab === item.name ? colors.black : 'transparent',
          },
        ]}>
        <TextSmall
          medium
          style={{
            color: selectedTab === item.name ? colors.black : colors.gray,
          }}>
          {item.name}
        </TextSmall>
      </TouchableOpacity>
    </>
  );
  return (
    <ContainerView>
      <Header label="Đơn hàng" paddingTop={top} />
      <View style={{backgroundColor: colors.while, paddingHorizontal: 5}}>
        <ScrollView
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tab}
          horizontal>
          {dataOrder.map(renderTab)}
        </ScrollView>
      </View>
      <FlatList
        data={filteredProducts}
        keyExtractor={item => `od-${item}`}
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
    backgroundColor: colors.while,
  },
  tab: {
    // height: 40,
    borderBottomWidth: 0.3,
    borderBottomColor: colors.gray1,
    backgroundColor: colors.while,
  },
});
