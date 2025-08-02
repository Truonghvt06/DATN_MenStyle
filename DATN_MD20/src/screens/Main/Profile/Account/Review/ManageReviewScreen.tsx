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

const ManageReviewScreen = () => {
  const {top} = useSafeAreaInsets();
  const theme = useAppTheme();
  const {getTranslation} = useLanguage();
  const [selectedTab, setSelectedTab] = useState('Chưa đánh giá');

  const dispatch = useAppDispatch();
  const {pending, myReviews} = useAppSelector(state => state.review);

  // console.log('ABC', pending);
  // console.log('ABCD', myReviews);

  const tabs = ['Chưa đánh giá', 'Đã đánh giá'];

  useEffect(() => {
    dispatch(fetchPendingReviewItems());
    dispatch(fetchMyReviews());
  }, []);

  // const filteredProducts = useMemo(() => {
  //   if (!pending && !myReviews) return [];
  //   switch (selectedTab) {
  //     case 'Chưa đánh giá':
  //       return [...pending];
  //     case 'Đã đánh giá':
  //       return [...myReviews];

  //     default:
  //       return pending;
  //   }
  // }, [selectedTab, pending, myReviews]);

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
      {/* <Block padH={8} padT={10} padB={30}>
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
      </Block> */}
      <Block padH={8} padT={10} padB={30}>
        {pending.length === 0 || myReviews.length === 0 ? (
          <TextSmall style={{textAlign: 'center'}}>Không có sản phẩm</TextSmall>
        ) : selectedTab === 'Chưa đánh giá' ? (
          <FlatList
            data={pending}
            keyExtractor={index => `pen-${index}`}
            renderItem={({item}) => {
              return (
                <ItemRated
                  name={item.product_name || 'Tên sản phẩm'}
                  image={item.image || ''}
                  id_order={item.order_id}
                  size={item.size || 'N/A'}
                  color={item.color || 'N/A'}
                  deliveredAt={item.deliveredAt}
                  onPress={() => handleReview()}
                />
              );
            }}
          />
        ) : (
          <FlatList
            data={myReviews}
            keyExtractor={index => `pen-${index}`}
            renderItem={({item}) => {
              return (
                <ItemNotRated
                  avatar={item.avatar || ''}
                  nameUser={'Bạn'} // hoặc từ user info
                  namePro={item.product_name}
                  image={item.image || ''}
                  id_order={item.order_id}
                  size={'N/A'}
                  color={'N/A'}
                  star={item.rating.toString()}
                  date={new Date(item.createdAt).toLocaleDateString()}
                  comment={item.comment}
                  onPress={() => handleProductDetail()}
                />
              );
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
