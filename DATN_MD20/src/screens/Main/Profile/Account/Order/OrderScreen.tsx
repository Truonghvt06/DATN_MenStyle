import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import ContainerView from '../../../../../components/layout/ContainerView';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Header from '../../../../../components/dataDisplay/Header';
import {dataItemOrder, dataProduct} from '../../../../../constants/data';
import Block from '../../../../../components/layout/Block';
import {TextSmall} from '../../../../../components/dataEntry/TextBase';
import metrics from '../../../../../constants/metrics';
import OrderItem from '../../../../../components/dataDisplay/Order/OrderItem';
import navigation from '../../../../../navigation/navigation';
import ScreenName from '../../../../../navigation/ScreenName';
import useLanguage from '../../../../../hooks/useLanguage';
import {useAppTheme} from '../../../../../themes/ThemeContext';
import {useAppDispatch, useAppSelector} from '../../../../../redux/store';
import {getOrders} from '../../../../../redux/actions/order';
import moment from 'moment';

const OrderScreen = () => {
  const {top} = useSafeAreaInsets();
  const {getTranslation} = useLanguage();
  const theme = useAppTheme();
  const [selectedTab, setSelectedTab] = useState(getTranslation('tat_ca'));

  const [refreshing, setRefreshing] = useState(false);

  const dispatch = useAppDispatch();
  const {orders, loading} = useAppSelector(state => state.order);
  // console.log('ASS:', orders);

  const dataOrder = [
    {id: 'o1', name: getTranslation('tat_ca')},
    {id: 'o2', name: getTranslation('cho_xac_nhan')},
    {id: 'o3', name: getTranslation('da_xac_nhan')},
    {id: 'o4', name: getTranslation('cho_giao_hang')},
    {id: 'o5', name: getTranslation('da_giao')},
    {id: 'o6', name: getTranslation('da_huy')},
  ];

  ///GET DON HANG
  useEffect(() => {
    dispatch(getOrders());
  }, [dispatch]);
  ///

  // ⭐ Hàm refresh
  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      // Nếu createAsyncThunk: có thể dùng unwrap() để throw lỗi về catch
      await dispatch(getOrders()).unwrap?.();
      // hoặc: unwrapResult(await dispatch(getOrders()));
    } catch (e) {
      console.log('Refresh orders error:', e);
      // TODO: hiện Toast/Alert nếu muốn
    } finally {
      setRefreshing(false);
    }
  }, [dispatch]);

  const handleTabPress = (tab: string) => {
    setSelectedTab(tab);
  };

  const bg = useRef(null);

  const filteredorder = useMemo(() => {
    if (!orders || orders.length === 0) return [];

    switch (selectedTab) {
      case getTranslation('cho_xac_nhan'):
        return orders.filter(order => order.order_status === 'pending');
      case getTranslation('da_xac_nhan'):
        return orders.filter(order => order.order_status === 'confirmed');
      case getTranslation('cho_giao_hang'):
        return orders.filter(order => order.order_status === 'shipping');
      case getTranslation('da_giao'):
        return orders.filter(order => order.order_status === 'delivered');
      case getTranslation('da_huy'):
        return orders.filter(order => order.order_status === 'cancelled');
      case getTranslation('tat_ca'):
      default:
        return orders;
    }
  }, [orders, selectedTab]);

  const renderTab = (item: any) => (
    <TouchableOpacity
      activeOpacity={0.9}
      key={item.id}
      onPress={() => handleTabPress(item.name)}
      style={[
        styles.itemtab,
        {
          borderBottomColor:
            selectedTab === item.name ? theme.primary : 'transparent',
        },
      ]}>
      <TextSmall
        medium
        style={{
          color: selectedTab === item.name ? theme.primary : theme.text,
        }}>
        {item.name}
      </TextSmall>
    </TouchableOpacity>
  );

  return (
    <ContainerView>
      <Header label={getTranslation('don_hang')} paddingTop={top} />
      <View>
        <ScrollView
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[
            styles.tab,
            {
              borderBottomColor: theme.border_color,
            },
          ]}
          horizontal>
          {dataOrder.map(renderTab)}
        </ScrollView>
      </View>
      <FlatList
        data={filteredorder}
        keyExtractor={item => item._id}
        renderItem={({item}) => {
          const formattedItems = item.items.map((item: any) => {
            const variant = item.product_id?.variants.find(
              (v: any) => v._id === item.product_variant_id,
            );
            return {
              ...item,
              image: variant?.image, // FlatList dùng Image source = { uri: ... }
              color: variant?.color,
              size: variant?.size,
            };
          });

          return (
            <OrderItem
              code_order={item.code}
              date={moment(item.createdAt).format('DD/MM/YYYY')}
              total={item.total_amount}
              order_status={item.order_status}
              data={formattedItems}
              onPress={() => {
                navigation.navigate(ScreenName.Main.OrderDetail, {
                  screen: 'order',
                  orderId: item._id,
                });
              }}
            />
          );
        }}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing || loading}
        onRefresh={() => onRefresh()}
        ListEmptyComponent={() => (
          <Block flex1 alignCT justifyCT>
            <TextSmall style={{textAlign: 'center'}}>
              {'Không có đơn hàng nào'}
            </TextSmall>
          </Block>
        )}
        contentContainerStyle={{
          flexGrow: 1,
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
    width: 115,
    paddingVertical: 10,
    // paddingHorizontal: 10,
    borderBottomWidth: 2,
    alignItems: 'center',
  },
  tab: {
    borderBottomWidth: 0.3,
  },
});
