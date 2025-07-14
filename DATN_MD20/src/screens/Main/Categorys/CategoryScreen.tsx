import {useRoute} from '@react-navigation/native';
import React, {useState, useMemo,useEffect} from 'react';
import {View, Text, TouchableOpacity, FlatList, StyleSheet} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ContainerView from '../../../components/layout/ContainerView';
import Header from '../../../components/dataDisplay/Header';
import {TextMedium, TextSmall} from '../../../components/dataEntry/TextBase';
import {allProducts} from '../../../constants/data';
import ListProduct from '../../../components/dataDisplay/ListProduct';
import Block from '../../../components/layout/Block';
import metrics from '../../../constants/metrics';
import useLanguage from '../../../hooks/useLanguage';
import products from '../../../services/products';
import {useAppTheme} from '../../../themes/ThemeContext';

const CategoryScreen = () => {
  const route = useRoute();
  const {getTranslation} = useLanguage();
  const theme = useAppTheme();
  const {top} = useSafeAreaInsets();
  const {name, title} = route.params as {name: string; title: string};

  const [selectedTab, setSelectedTab] = useState(getTranslation('tat_ca'));

  const tabs = [
    getTranslation('tat_ca'),
    getTranslation('moi_nhat'),
    getTranslation('ban_chay'),
    getTranslation('gia'),
  ];
    const [proData, setProData] = useState<any[]>([]);
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await products.getProducts();
        setProData(res.data); // res.data là mảng sản phẩm
      } catch (error) {
        console.error('Lỗi lấy sản phẩm:', error);
      }
    };

    fetchProducts();
  }, []);
  const handleTabPress = (tab: string) => {
    setSelectedTab(tab);
  };

  const filteredProducts = useMemo(() => {
    const productsByCategory = allProducts.filter(p => p.category === name);
    switch (selectedTab) {
      case getTranslation('moi_nhat'):
        return [...productsByCategory].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
      case getTranslation('ban_chay'):
        return [...productsByCategory].sort((a, b) => b.sold - a.sold);
      case getTranslation('gia'):
        return [...productsByCategory].sort((a, b) => a.price - b.price);
      case getTranslation('tat_ca'):
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
              selectedTab === tab ? theme.text : 'transparent',
            backgroundColor: theme.background,
          },
        ]}>
        <TextSmall
          style={{
            color: selectedTab === tab ? theme.text : theme.text + '88', // lighter if not selected
          }}>
          {tab}
        </TextSmall>
      </TouchableOpacity>
      <Block
        borderW={0.5}
        borderColor={theme.text + '44'}
        h={'50%'}
        alignSelf="center"
      />
    </>
  );

  return (
    <ContainerView
      containerStyle={{
        backgroundColor: theme.background,
        paddingTop: top,
      }}>
      <Header
        label={title}
        paddingTop={top}
        backgroundColor={theme.background}
        textColor={theme.text}
      />
      <View style={[styles.tab, {backgroundColor: theme.background, borderBottomColor: theme.text + '33'}]}>
        {tabs.map(renderTab)}
      </View>

      <Block padH={8} flex1>
        <ListProduct
          data={proData}
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
  },
  tab: {
    width: '100%',
    flexDirection: 'row',
    borderBottomWidth: 0.3,
  },
});
