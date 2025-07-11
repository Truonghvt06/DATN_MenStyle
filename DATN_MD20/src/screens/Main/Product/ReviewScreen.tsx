// screens/ReviewScreen.tsx
import React from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';

import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useRoute} from '@react-navigation/native';
import ContainerView from '../../../components/layout/ContainerView';
import Header from '../../../components/dataDisplay/Header';
import ReviewItem from '../../../components/dataDisplay/ReviewItem';
import {dataProduct} from '../../../constants/data';

const ReviewScreen = () => {
  const {top} = useSafeAreaInsets();
  const route = useRoute();
  //   const {reviews} = route.params as {reviews: any[]};

  return (
    <ContainerView>
      <Header label="Tất cả đánh giá" paddingTop={top} />
      <FlatList
        data={dataProduct}
        keyExtractor={(item, index) => `review-full-${index}`}
        renderItem={({item}) => (
          //   <ReviewItem star={item.star} name={item.name} review={item.review} />
          <ReviewItem
            star={item.star}
            name="Nguyen Van A"
            review="Sản phẩm chất lượng tốt, vải mềm mại và thoáng mát. Rất hài lòng với lần mua hàng này."
          />
        )}
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
