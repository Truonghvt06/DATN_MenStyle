import {useRoute} from '@react-navigation/native';

import React, {useState, useMemo,useEffect} from 'react';
import {View, Text, TouchableOpacity, FlatList, StyleSheet} from 'react-native';

import React, {useState, useMemo, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';

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

import {useAppDispatch, useAppSelector} from '../../../redux/store';
import {fetchProductsByCategory} from '../../../redux/actions/product';
import {Product} from '../../../redux/reducers/product/type';
import navigation from '../../../navigation/navigation';
import {clearProCate} from '../../../redux/reducers/product';
import ScreenName from '../../../navigation/ScreenName';
import {fetchFavorites, toggleFavorite} from '../../../redux/actions/favorite';
import Toast from 'react-native-toast-message';
import configToast from '../../../components/utils/configToast';


const CategoryScreen = () => {
  const route = useRoute();
  const {getTranslation} = useLanguage();
  const theme = useAppTheme();
  const {top} = useSafeAreaInsets();

  const {name, title} = route.params as {name: string; title: string};


  const {title, type} = route.params as {
    title: string;
    type: string;
  }; //từ home
  const [dataProCate, setDataProCate] = useState<Product[]>([]);

  const [selectedTab, setSelectedTab] = useState(getTranslation('tat_ca'));
  const [isReady, setIsReady] = useState(false);

  const dispatch = useAppDispatch();
  const {productCate} = useAppSelector(state => state.product);
  const {listFavoriteIds} = useAppSelector(state => state.favorite);
  const {token} = useAppSelector(state => state.auth);

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

  // console.log('ID----', type);

  // console.log('AAAA----', dataProCate);

  useEffect(() => {
    if (type) dispatch(fetchProductsByCategory(type));
  }, [type]);
  useEffect(() => {
    setDataProCate(productCate);
    const timeout = setTimeout(() => {
      setIsReady(true);
    }, 500);

    return () => clearTimeout(timeout);
  }, [productCate]);

  //Nhấn tab

  const handleTabPress = (tab: string) => {
    setSelectedTab(tab);
  };

  //Nhấn item Pro
  const handleProDetail = (id: string) => {
    navigation.navigate(ScreenName.Main.ProductDetail, {id: id});
  };
  //Yêu thích
  const handleFavorite = async (productId: string) => {
    await dispatch(toggleFavorite(productId));
    dispatch(fetchFavorites());
  };

  const handleLogin = () => {
    Alert.alert(
      getTranslation('thong_bao'),
      'Hãy đăng nhập để sử dụng',
      [
        {
          text: getTranslation('huy'),
          onPress: () => console.log('Đã huỷ'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            navigation.navigate(ScreenName.Auth.AuthStack, {
              screen: ScreenName.Auth.Login,
              params: {
                nameScreen: '',
              },
            });
          },
        },
      ],
      {cancelable: true},
    );
  };
  // data lọc
  const filteredProducts = useMemo(() => {

    const productsByCategory = allProducts.filter(p => p.category === name);

    if (!dataProCate) return [];

    switch (selectedTab) {
      case getTranslation('moi_nhat'):
        return [...dataProCate].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
      case getTranslation('ban_chay'):
        return [...dataProCate].sort((a, b) => b.sold_count - a.sold_count);
      case getTranslation('gia'):
        return [...dataProCate].sort((a, b) => a.price - b.price);
      case getTranslation('tat_ca'):
      default:
        return dataProCate;
    }
  }, [selectedTab, dataProCate]);

  const renderTab = (tab: string) => (
    <View
      key={tab}
      style={[{width: '25%', flexDirection: 'row', justifyContent: 'center'}]}>
      <TouchableOpacity
        activeOpacity={0.9}
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
    </View>
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

    <ContainerView>
      {!isReady ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size={'large'} />
        </View>
      ) : (
        <>
          <Header
            label={title}
            paddingTop={top}
            onPressLeft={() => {
              dispatch(clearProCate());
              navigation.goBack();
            }}
          />
          <View style={[styles.tab]}>{tabs.map(renderTab)}</View>

          <Toast config={configToast} />
          <Block padH={8} flex1>
            {dataProCate.length === 0 ? (
              <Block flex1 alignCT justifyCT>
                <TextMedium color={colors.gray}>
                  Chưa có sản phẩm loại này!
                </TextMedium>
              </Block>
            ) : (
              <ListProduct
                data={filteredProducts}
                isColums
                columNumber={2}
                favoriteId={listFavoriteIds}
                onPress={id => {
                  handleProDetail(id);
                }}
                onPressFavorite={id =>
                  token ? handleFavorite(id) : handleLogin()
                }
              />
            )}
          </Block>
        </>
      )}

    </ContainerView>
  );
};

export default CategoryScreen;

const styles = StyleSheet.create({
  itemtab: {
    width: '100%',
    paddingVertical: 8,
    borderBottomWidth: 2,
    alignItems: 'center',
  },
  tab: {
    width: '100%',
    flexDirection: 'row',
    borderBottomWidth: 0.3,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});
