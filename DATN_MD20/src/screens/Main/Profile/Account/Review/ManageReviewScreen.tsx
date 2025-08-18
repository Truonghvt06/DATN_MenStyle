import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import ContainerView from '../../../../../components/layout/ContainerView';
import Header from '../../../../../components/dataDisplay/Header';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useAppTheme} from '../../../../../themes/ThemeContext';
import useLanguage from '../../../../../hooks/useLanguage';
import {TextSmall} from '../../../../../components/dataEntry/TextBase';
import ButtonBase from '../../../../../components/dataEntry/Button/ButtonBase';
import navigation from '../../../../../navigation/navigation';
import ScreenName from '../../../../../navigation/ScreenName';
import ItemRated from './ItemRated';
import Block from '../../../../../components/layout/Block';
import ItemNotRated from './ItemNotRated';
import {useAppDispatch, useAppSelector} from '../../../../../redux/store';
import {
  fetchMyReviews,
  fetchPendingReviewItems,
} from '../../../../../redux/actions/review';
import moment from 'moment';

const ManageReviewScreen = () => {
  const {top} = useSafeAreaInsets();
  const theme = useAppTheme();
  const {getTranslation} = useLanguage();
  const [selectedTab, setSelectedTab] = useState('Chưa đánh giá');

  const dispatch = useAppDispatch();
  const {pending, myReviews, loading} = useAppSelector(state => state.review);

  // console.log('ABC', pending);
  console.log('ABCD', myReviews);

  const tabs = ['Chưa đánh giá', 'Đã đánh giá'];

  useEffect(() => {
    dispatch(fetchPendingReviewItems());
    dispatch(fetchMyReviews());
  }, []);

  const handleReview = (items: any) => {
    navigation.navigate(ScreenName.Main.AddReview, {items: items});
  };
  const handleProductDetail = (id: string) => {
    navigation.navigate(ScreenName.Main.ProductDetail, {id: id});
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

      <Block flex1 padH={8} padT={10} padB={30}>
        {selectedTab === 'Chưa đánh giá' ? (
          pending.length === 0 ? (
            <Block flex1 alignCT justifyCT>
              <TextSmall style={{textAlign: 'center'}}>
                Bạn không có sản phẩm nào cần đánh giá
              </TextSmall>
            </Block>
          ) : (
            <FlatList
              data={pending}
              keyExtractor={(item, index) => `pen-${index}`}
              renderItem={({item}) => (
                <ItemRated
                  name={item.product_name}
                  image={item.product_image}
                  id_order={item.order_id}
                  size={item.product_size}
                  color={item.product_color}
                  deliveredAt={moment(item.deliveredAt).format('DD/MM/YYYY')}
                  onPress={() => handleReview(item)}
                />
              )}
              contentContainerStyle={{flexGrow: 1, paddingBottom: 50, gap: 10}}
              showsVerticalScrollIndicator={false}
              refreshing={loading}
              onRefresh={() => {
                dispatch(fetchPendingReviewItems());
              }}
            />
          )
        ) : myReviews.length === 0 ? (
          <Block flex1 alignCT justifyCT>
            <TextSmall style={{textAlign: 'center'}}>
              Bạn chưa đánh giá sản phẩm nào
            </TextSmall>
          </Block>
        ) : (
          <FlatList
            data={myReviews}
            keyExtractor={(item, index) => `rev-${item._id}`}
            renderItem={({item}) => {
              const variant = item.product_id?.variants?.find(
                (v: any) =>
                  v._id.toString() === item.product_variant_id.toString(),
              );
              return (
                <ItemNotRated
                  avatar={item.user_id?.avatar}
                  nameUser={item.user_id?.name}
                  namePro={item.product_id?.name}
                  image={variant.image}
                  size={variant.size}
                  color={variant.color}
                  star={item.rating}
                  date={moment(item.createdAt).format('DD/MM/YYYY')}
                  comment={item.comment}
                  onPress={() => handleProductDetail(item.product_id?._id)}
                />
              );
            }}
            contentContainerStyle={{flexGrow: 1, paddingBottom: 50, gap: 10}}
            showsVerticalScrollIndicator={false}
            refreshing={loading}
            onRefresh={() => {
              dispatch(fetchMyReviews());
            }}
          />
        )}
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
