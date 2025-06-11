import {FlatList, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ContainerView from '../../components/layout/ContainerView';
import Header from '../../components/dataDisplay/Header';
import {dataProduct} from '../../constants/data';
import FavoriteItem from '../../components/dataDisplay/FavoriteItem';

const FavoriteScreen = () => {
  const {top} = useSafeAreaInsets();
  return (
    <ContainerView>
      <Header
        visibleLeft
        label="Yêu thích"
        paddingTop={top}
        containerStyle={{
          alignItems: 'center',
          paddingLeft: 40,
          height: top + 45,
        }}
      />
      <FlatList
        data={dataProduct}
        keyExtractor={item => item.id + 'acs'}
        renderItem={({item}) => {
          return (
            <FavoriteItem
              name={item.name}
              price={item.price}
              image={item.image}
              onPress={() => {}}
            />
          );
        }}
        contentContainerStyle={{paddingBottom: 20}}
      />
    </ContainerView>
  );
};

export default FavoriteScreen;

const styles = StyleSheet.create({});
