import {
  FlatList,
  Image,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {colors} from '../../themes/colors';
import navigation from '../../navigation/navigation';
import {IconSRC} from '../../constants/icons';
import InputBase from '../../components/dataEntry/Input/InputBase';
import TouchIcon from '../../components/dataEntry/Button/TouchIcon';
import metrics from '../../constants/metrics';
import productService from '../../services/products/productService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAppTheme} from '../../themes/ThemeContext';
import {useRoute} from '@react-navigation/native';
import Block from '../../components/layout/Block';
import {TextMedium, TextSmall} from '../../components/dataEntry/TextBase';
import useLanguage from '../../hooks/useLanguage';
import ContainerView from '../../components/layout/ContainerView';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {
  fetchBestSellerProducts,
  fetchCategory,
  fetchProducts,
  fetchSearchProduct,
} from '../../redux/actions/product';
import ListProduct from '../../components/dataDisplay/ListProduct';
import ScreenName from '../../navigation/ScreenName';
import {fetchFavorites, toggleFavorite} from '../../redux/actions/favorite';
import ModalCenter from '../../components/dataDisplay/Modal/ModalCenter';

const normalizeText = (text: string) =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s]/g, '');

const HISTORY_KEY = 'search_history';

const SearchDetail = () => {
  const {top} = useSafeAreaInsets();
  const {getTranslation} = useLanguage();
  const theme = useAppTheme();

  const [keyword, setKeyword] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [defaultSuggestions, setDefaultSuggestions] = useState<any[]>([]);
  const [showAllResults, setShowAllResults] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpenCheck, setIsOpenCheck] = useState(false);

  const listSearchHistory = searchHistory.slice(0, 5);
  const dispatch = useAppDispatch();
  const {products, productSearch} = useAppSelector(state => state.product);
  const {token} = useAppSelector(state => state.auth);
  const {listFavoriteIds} = useAppSelector(state => state.favorite);

  const productHot = [...defaultSuggestions]
    .sort((a, b) => b.sold_count - a.sold_count)
    .slice(0, 10);

  useEffect(() => {
    // dispatch(fetchBestSellerProducts(10));
    dispatch(fetchCategory());
    dispatch(fetchProducts());
    loadHistory();
  }, []);

  useEffect(() => {
    setDefaultSuggestions(products);
  }, [products]);

  const handleProDetail = (id: string) => {
    navigation.navigate(ScreenName.Main.ProductDetail, {id});
  };

  const handleFavorite = async (productId: string) => {
    await dispatch(toggleFavorite(productId));
    dispatch(fetchFavorites());
  };

  const handleLogin = () => {
    setIsOpenCheck(false);

    navigation.navigate(ScreenName.Auth.AuthStack, {
      screen: ScreenName.Auth.Login,
      params: {
        nameScreen: '',
      },
    });
  };
  const loadHistory = async () => {
    try {
      const history = await AsyncStorage.getItem(HISTORY_KEY);
      if (history) setSearchHistory(JSON.parse(history));
    } catch (err) {
      console.log('Load history error', err);
    }
  };
  const saveHistory = async (history: string[]) => {
    try {
      await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    } catch {}
  };
  const removeHistory = async () => {
    try {
      await AsyncStorage.removeItem(HISTORY_KEY);
      setSearchHistory([]);
    } catch {
      console.log('Xoá lịch sử tìm kiếm thất bại!');
    }
  };

  const addToSearchHistory = (text: string) => {
    const updated = [text, ...searchHistory.filter(item => item !== text)];
    const limited = updated.slice(0, 10);
    setSearchHistory(limited);
    saveHistory(limited);
  };

  const handleChangeKeyword = async (text: string) => {
    setKeyword(text);

    if (!text.trim()) {
      setSuggestions([]);
      setShowAllResults(false);
      return;
    }

    setLoading(true);

    try {
      dispatch(fetchSearchProduct(text));

      // const res = await productService.searchProducts(text);
      // console.log('🔍 API search response:', res);

      // const data = Array.isArray(res?.products) ? res.products : [];
      // let results = [...data];

      let results = [...productSearch];

      if (results.length < 3) {
        const normKeyword = normalizeText(text);
        const fallback = defaultSuggestions.filter(item =>
          normalizeText(item.name).includes(normKeyword),
        );
        results = [
          ...results,
          ...fallback.filter(f => !results.some(r => r._id === f._id)),
        ];
      }

      setSuggestions(results);
    } catch (err) {
      console.log('❌ Search error:', err);
      setSuggestions([]);
    }

    setLoading(false);
  };

  const handleSelectSuggestion = async (item: any) => {
    try {
      const keyword = item.name;

      addToSearchHistory(keyword);

      const res = await productService.searchProducts(keyword);
      const allResults: {name: string}[] = Array.isArray(res?.products)
        ? res.products
        : [];

      const normalizeText = (text: string) =>
        text
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '');

      const normKeyword = normalizeText(keyword);

      const exactMatches = allResults.filter(
        product =>
          product?.name && normalizeText(product.name).includes(normKeyword),
      );

      const others = allResults.filter(
        product =>
          product?.name && !normalizeText(product.name).includes(normKeyword),
      );

      const sortedResults = [...exactMatches, ...others];

      navigation.navigate('SearchSplitScreen', {
        keyword,
        results: sortedResults,
      });
    } catch (err) {
      console.log('Handle select error:', err);
    }
  };

  const handleSubmitSearch = async () => {
    if (!keyword.trim()) return;

    try {
      const res = await productService.searchProducts(keyword);
      console.log('[🔍 Submit] API response:', res);

      const allResults: {name: string}[] = Array.isArray(res?.products)
        ? res.products
        : [];

      const normalizeText = (text: string) =>
        text
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '');

      const normKeyword = normalizeText(keyword);

      const exactMatches = allResults.filter(
        product =>
          product?.name && normalizeText(product.name).includes(normKeyword),
      );

      const others = allResults.filter(
        product =>
          product?.name && !normalizeText(product.name).includes(normKeyword),
      );

      const sortedResults = [...exactMatches, ...others];

      addToSearchHistory(keyword);

      navigation.navigate('SearchSplitScreen', {
        keyword,
        results: sortedResults,
      });
    } catch (err) {
      console.log('Search submit error:', err);
    }
  };

  const renderProductCard = ({item}: {item: any}) => {
    const imageUri = item.variants?.[0]?.image || '';
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('ProductDetail', {product: item})}>
        <Image
          source={{uri: imageUri}}
          style={styles.productImage}
          resizeMode="cover"
        />
        <Text
          numberOfLines={2}
          style={[styles.productName, {color: theme.text}]}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  const combinedProductList = [
    ...suggestions,
    ...defaultSuggestions.filter(d => !suggestions.some(s => s._id === d._id)),
  ];

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ContainerView paddingTop={top} containerStyle={{paddingHorizontal: 8}}>
        <View style={styles.header}>
          <TouchableOpacity
            activeOpacity={0.9}
            style={[styles.btnLeft]}
            onPress={() => navigation.goBack()}>
            <Image
              style={[styles.image, {tintColor: theme.icon}]}
              source={IconSRC.icon_back_left}
            />
          </TouchableOpacity>
          <InputBase
            autoFocus
            radius={10}
            value={keyword}
            onChangeText={handleChangeKeyword}
            onSubmitEditing={handleSubmitSearch}
            inputStyle={[styles.input, {color: theme.text}]}
            containerStyle={{flex: 1}}
            placeholder="Nhập sản phẩm cần tìm..."
            customRight={
              <Image
                style={[styles.icon_search, {tintColor: theme.icon}]}
                source={IconSRC.icon_search}
              />
            }
          />
          {/* <TouchIcon
            size={30}
            title="Huỷ"
            onPress={() => navigation.goBack()}
          /> */}
        </View>

        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          {keyword.trim() === '' ? (
            <FlatList
              data={listSearchHistory}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item}) => {
                return (
                  <TouchableOpacity
                    style={styles.suggestionItem}
                    onPress={() => {
                      setKeyword(item);
                      handleChangeKeyword(item);
                    }}>
                    <TextSmall>{item}</TextSmall>
                  </TouchableOpacity>
                );
              }}
              scrollEnabled={false}
              ListFooterComponent={() =>
                searchHistory.length > 0 ? (
                  <TouchIcon
                    title={getTranslation('xoa_lich_su_tim_kiem')}
                    colorTitle={colors.gray3}
                    containerStyle={{marginVertical: 16, alignSelf: 'flex-end'}}
                    onPress={() => {
                      removeHistory();
                    }}
                  />
                ) : null
              }
            />
          ) : loading ? (
            <View style={{paddingVertical: 20}}>
              <ActivityIndicator size="small" color={theme.text} />
            </View>
          ) : (
            <>
              {suggestions.length === 0 ? (
                <Text
                  style={[
                    styles.suggestionText,
                    {color: theme.text, textAlign: 'center', marginTop: 10},
                  ]}>
                  Không tìm thấy kết quả.
                </Text>
              ) : (
                suggestions.map(item => (
                  <TouchableOpacity
                    key={item._id}
                    style={styles.suggestionItem}
                    onPress={() => handleSelectSuggestion(item)}>
                    <Text style={[styles.suggestionText, {color: theme.text}]}>
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                ))
              )}
            </>
          )}

          {keyword === '' && (
            <Block marT={searchHistory.length === 0 ? 50 : 30}>
              <TextMedium bold style={{textTransform: 'capitalize'}}>
                Có thể bạn quan tâm
              </TextMedium>
              <ListProduct
                isColums
                scrollEnabled={false}
                columNumber={2}
                data={productHot}
                favoriteId={listFavoriteIds}
                onPress={id => {
                  handleProDetail(id);
                }}
                onPressFavorite={id =>
                  token ? handleFavorite(id) : setIsOpenCheck(true)
                }
              />
              {/* <FlatList
                data={
                  // showAllResults
                  //   ? combinedProductList
                  //   : combinedProductList.slice(0, 6)
                  products
                }
                keyExtractor={item => item._id}
                numColumns={2}
                columnWrapperStyle={{justifyContent: 'space-between'}}
                contentContainerStyle={{
                  paddingBottom: 20,
                  gap: 10,
                  marginTop: 20,
                }}
                renderItem={renderProductCard}
                showsVerticalScrollIndicator={false}
                scrollEnabled={false}
                ListHeaderComponent={
                  <TextMedium bold>Gợi ý tìm kiếm</TextMedium>
                }
                ListEmptyComponent={
                  <TextMedium
                    style={{
                      textAlign: 'center',
                      marginTop: 20,
                    }}>
                    Không tìm thấy sản phẩm nào.
                  </TextMedium>
                }
              />
              {!showAllResults && combinedProductList.length > 6 && (
                <TouchableOpacity
                  style={styles.seeMoreBtn}
                  onPress={() => setShowAllResults(true)}>
                  <Text style={[styles.seeMoreText, {color: theme.text}]}>
                    Xem thêm
                  </Text>
                </TouchableOpacity>
              )} */}
            </Block>
          )}
        </ScrollView>
        <ModalCenter
          visible={isOpenCheck}
          content={'Hãy đăng nhập để sử dụng'}
          onClose={() => setIsOpenCheck(false)}
          onPress={() => {
            handleLogin();
          }}
        />
      </ContainerView>
    </TouchableWithoutFeedback>
  );
};

export default SearchDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: metrics.space * 2,
  },
  btnLeft: {
    height: 40,
    width: 40,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 25,
    height: 25,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 10,
  },
  input: {
    height: 37,
    width: '100%',
    marginLeft: -3,
  },
  icon_search: {
    width: 20,
    height: 20,
    tintColor: colors.black,
    marginRight: 8,
    alignSelf: 'center',
  },
  topPane: {
    flex: 0.4,
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 10,
    marginBottom: 8,
  },
  bottomPane: {
    flex: 0.6,
  },
  suggestionItem: {
    paddingVertical: 12,
    borderBottomWidth: 0.3,
    borderBottomColor: colors.gray3,
  },
  suggestionText: {
    fontSize: 14,
  },
  card: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8,
    borderWidth: 0.5,
    borderColor: colors.gray3,
  },
  productImage: {
    width: '100%',
    height: 120,
    borderRadius: 6,
    marginBottom: 6,
  },
  productName: {
    fontSize: 13,
  },
  seeMoreBtn: {
    alignSelf: 'center',
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: colors.gray2,
    borderRadius: 6,
  },
  seeMoreText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
