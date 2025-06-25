import {useRoute} from '@react-navigation/native';
import React, {useState, useMemo} from 'react';
import {View, Text, TouchableOpacity, FlatList, StyleSheet} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ContainerView from '../../../components/layout/ContainerView';
import Header from '../../../components/dataDisplay/Header';
import {colors} from '../../../themes/colors';
import {TextMedium, TextSmall} from '../../../components/dataEntry/TextBase';
import {allProducts} from '../../../constants/data';
import ListProduct from '../../../components/dataDisplay/ListProduct';
import Block from '../../../components/layout/Block';
import metrics from '../../../constants/metrics';

const tabs = ['Tất cả', 'Mới nhất', 'Bán chạy', 'Giá'];

// Dữ liệu giả

const CategoryScreen = () => {
  const route = useRoute();
  const {top} = useSafeAreaInsets();
  const {name} = route.params as {name: string}; //từ home
  const [selectedTab, setSelectedTab] = useState('Tất cả');

  const handleTabPress = (tab: string) => {
    setSelectedTab(tab);
  };

  const filteredProducts = useMemo(() => {
    // Lọc sản phẩm đúng loại áo trước
    const productsByCategory = allProducts.filter(p => p.category === name);

    // Sau đó sắp xếp theo tab
    switch (selectedTab) {
      case 'Mới nhất':
        return [...productsByCategory].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
      case 'Bán chạy':
        return [...productsByCategory].sort((a, b) => b.sold - a.sold);
      case 'Giá':
        return [...productsByCategory].sort((a, b) => a.price - b.price);
      case 'Tất cả':
      default:
        return productsByCategory;
    }
  }, [selectedTab, name]);

  const renderTab = (tab: string) => (
    <>
      <TouchableOpacity
        activeOpacity={0.9}
        key={tab}
        onPress={() => handleTabPress(tab)}
        style={[
          styles.itemtab,
          {
            borderBottomColor:
              selectedTab === tab ? colors.black : 'transparent',
          },
        ]}>
        <TextSmall
          style={{color: selectedTab === tab ? colors.black : colors.gray}}>
          {tab}
        </TextSmall>
      </TouchableOpacity>
      <Block
        borderW={0.5}
        borderColor={colors.gray1}
        h={'50%'}
        alignSelf="center"
      />
    </>
  );

  return (
    <ContainerView>
      <Header label={name} paddingTop={top} />
      <View style={[styles.tab]}>{tabs.map(renderTab)}</View>

      <Block padH={8} flex1>
        <ListProduct
          data={filteredProducts}
          isColums
          columNumber={2}
          onPress={() => {}}
        />
      </Block>
    </ContainerView>
  );
};

export default CategoryScreen;

const styles = StyleSheet.create({
  itemtab: {
    width: '25%',
    paddingVertical: 8,
    borderBottomWidth: 2,
    alignItems: 'center',
    backgroundColor: colors.while,
  },
  tab: {
    width: '100%',
    flexDirection: 'row',
    borderBottomWidth: 0.3,
    borderBottomColor: colors.gray1,
    backgroundColor: colors.while,
  },
});
