import React from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useRoute} from '@react-navigation/native';

import ContainerView from '../../../components/layout/ContainerView';
import Header from '../../../components/dataDisplay/Header';
import ReviewItem from '../../../components/dataDisplay/ReviewItem';
import {dataProduct} from '../../../constants/data';
import {useAppTheme} from '../../../themes/ThemeContext';

const ReviewScreen = () => {
  const {top} = useSafeAreaInsets();
  const route = useRoute<any>();
  const {reviews} = route.params || [];
  const theme = useAppTheme();
  console.log('Reviews:', reviews);

  return (
    <ContainerView containerStyle={{backgroundColor: theme.background}}>
      <Header
        label="Tất cả đánh giá"
        paddingTop={top}
        backgroundColor={theme.background}
        labelColor={theme.text}
      />
      <FlatList
        data={reviews}
        keyExtractor={(item, index) => `review-full-${index}`}
        renderItem={({item}) => {
          const variant = item.product_id?.variants?.find(
            (v: any) => v._id.toString() === item.product_variant_id.toString(),
          );
          return (
            <ReviewItem
              avatar={item.user_id?.avatar}
              star={item.rating}
              name={item.user_id?.name || 'Người dùng'}
              review={item.comment}
              date={item.createdAt}
              size={variant?.size}
              color={variant?.color}
            />
          );
        }}
        contentContainerStyle={{
          paddingBottom: 50,
          paddingHorizontal: 8,
          paddingTop: 10,
        }}
      />
    </ContainerView>
  );
};

export default ReviewScreen;

const styles = StyleSheet.create({});
