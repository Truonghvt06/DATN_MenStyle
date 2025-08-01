import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';
import productService from '../../services/products/productService';
import {useAppTheme} from '../../themes/ThemeContext';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ListProduct from '../../components/dataDisplay/ListProduct';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import ModalCenter from '../../components/dataDisplay/Modal/ModalCenter';
import {fetchFavorites, toggleFavorite} from '../../redux/actions/favorite';
import ScreenName from '../../navigation/ScreenName';
import ContainerView from '../../components/layout/ContainerView';
import metrics from '../../constants/metrics';
import {IconSRC} from '../../constants/icons';
import InputBase from '../../components/dataEntry/Input/InputBase';
import {TextMedium, TextSmall} from '../../components/dataEntry/TextBase';
import TouchIcon from '../../components/dataEntry/Button/TouchIcon';
import useLanguage from '../../hooks/useLanguage';
import Block from '../../components/layout/Block';
import ModalBottom from '../../components/dataDisplay/Modal/ModalBottom';
import {colors} from '../../themes/colors';
import navigation from '../../navigation/navigation';

const filters = ['Liên quan', 'Mới nhất', 'Bán chạy', 'Giá'];

const priceRanges = [
  {label: 'Dưới 100k', min: 0, max: 100000},
  {label: '100k - 300k', min: 100000, max: 300000},
  {label: '300k - 500k', min: 300000, max: 500000},
  {label: 'Trên 500k', min: 500000, max: Infinity},
];

const categories = [
  'Áo thun',
  'Áo khoác',
  'Áo sơ mi',
  'Áo polo',
  'Áo thể thao',
  'Áo hoodie',
];

const SearchSplitScreen = () => {
  const {top} = useSafeAreaInsets();
  const route = useRoute<any>();
  const {getTranslation} = useLanguage();
  const theme = useAppTheme();

  const {keyword} = route.params;
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('Liên quan');
  const [sortByPriceAsc, setSortByPriceAsc] = useState<boolean | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string | null>(
    null,
  );
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const [isOpenCheck, setIsOpenCheck] = useState(false);
  const dispatch = useAppDispatch();
  const {token} = useAppSelector(state => state.auth);
  const {listFavoriteIds} = useAppSelector(state => state.favorite);

  const tabs = [
    'Liên quan',
    getTranslation('moi_nhat'),
    getTranslation('ban_chay'),
    getTranslation('gia'),
  ];

  const handleFilterPress = (filter: string) => {
    if (filter === 'Giá') {
      if (activeFilter === 'Giá') {
        setSortByPriceAsc(prev => (prev === null ? true : !prev));
      } else {
        setSortByPriceAsc(true);
      }
    } else {
      setSortByPriceAsc(null);
    }
    setActiveFilter(filter);
  };

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await productService.getProducts();
        const all = Array.isArray(res?.data) ? res.data : [];

        const normalizeText = (text: string) =>
          text
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');

        const normKeyword = normalizeText(keyword);

        const exactMatches = all.filter(
          (product: any) =>
            product?.name && normalizeText(product.name).includes(normKeyword),
        );

        const others = all.filter(
          (product: any) =>
            product?.name && !normalizeText(product.name).includes(normKeyword),
        );

        const merged = [...exactMatches, ...others];
        setAllProducts(merged);
      } catch (err) {
        console.log('Fetch all error', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [keyword]);

  const applyFilters = (data: any[]) => {
    let filtered = [...data];

    if (selectedPriceRange) {
      const range = priceRanges.find(p => p.label === selectedPriceRange);
      if (range) {
        filtered = filtered.filter(
          p => p.price >= range.min && p.price < range.max,
        );
      }
    }

    if (selectedCategory) {
      filtered = filtered.filter(p =>
        p.name?.toLowerCase()?.includes(selectedCategory.toLowerCase()),
      );
    }

    // 🧠 Sắp xếp theo bộ lọc
    if (activeFilter === getTranslation('gia') && sortByPriceAsc !== null) {
      filtered.sort((a, b) =>
        sortByPriceAsc ? a.price - b.price : b.price - a.price,
      );
    } else if (activeFilter === getTranslation('moi_nhat')) {
      filtered.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    } else if (activeFilter === getTranslation('ban_chay')) {
      filtered.sort((a, b) => (b.sold || 0) - (a.sold || 0));
    }

    return filtered;
  };

  if (loading) {
    return (
      <Block flex1 alignCT justifyCT>
        <ActivityIndicator size="large" color={theme.text} />
      </Block>
    );
  }

  ////////////////////
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

  const handleProDetail = (id: string) => {
    navigation.navigate(ScreenName.Main.ProductDetail, {id});
  };
  //////////////////////

  return (
    <ContainerView
      containerStyle={{
        paddingTop: top,
        paddingHorizontal: metrics.space,
      }}>
      {/*  Search Header */}
      <View style={styles.searchRow}>
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
          inputStyle={[styles.searchInput, {color: theme.text}]}
          value={keyword}
          placeholder="Tìm kiếm sản phẩm..."
          onFocus={() => navigation.goBack()}
          containerStyle={{flex: 1, marginHorizontal: 10}}
        />
        <TouchableOpacity
          style={{flexDirection: 'row', alignItems: 'center'}}
          onPress={() => setModalVisible(true)}>
          <Image
            source={IconSRC.icon_sort}
            style={{width: 16, height: 16, tintColor: theme.icon}}
          />
          <TextSmall> Lọc</TextSmall>
        </TouchableOpacity>
      </View>

      {/*  Filter Buttons */}
      <Block row>
        {tabs.map(tab => (
          <View
            key={tab}
            style={{
              width: '25%',
              flexDirection: 'row',
              justifyContent: 'center',
            }}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => handleFilterPress(tab)}
              style={[
                styles.itemtab,
                {
                  backgroundColor: theme.background,
                  borderBottomColor:
                    activeFilter === tab ? theme.primary : 'transparent',
                },
              ]}>
              <TextSmall
                style={{
                  color: activeFilter === tab ? theme.primary : theme.text,
                }}>
                {tab}
                {tab === getTranslation('gia') &&
                  activeFilter === getTranslation('gia') &&
                  (sortByPriceAsc ? ' ↑' : ' ↓')}
              </TextSmall>
            </TouchableOpacity>
          </View>
        ))}
      </Block>

      {/* 📦 Unified Product List */}
      {/* {renderProductList(allProducts)} */}

      {/* SAN PHAM  */}
      <ListProduct
        data={applyFilters(allProducts)}
        isColums
        columNumber={2}
        favoriteId={listFavoriteIds}
        onPress={idnew => {
          handleProDetail(idnew);
        }}
        onPressFavorite={id =>
          token ? handleFavorite(id) : setIsOpenCheck(true)
        }
      />

      {/* Modal Sort */}
      <ModalBottom
        visible={modalVisible}
        header
        label="Lọc sản phẩm"
        heightModal={520}
        onClose={() => setModalVisible(false)}
        children={
          <Block flex1 padH={10} padT={15}>
            <ScrollView>
              <TextMedium medium>Khoảng Giá</TextMedium>

              <Block row marT={8} flexWrap="wrap" gap={10}>
                {priceRanges.map(p => (
                  <TouchableOpacity
                    key={p.label}
                    style={[
                      styles.optionBtn,
                      selectedPriceRange === p.label && styles.optionBtnActive,
                    ]}
                    onPress={() =>
                      setSelectedPriceRange(
                        selectedPriceRange === p.label ? null : p.label,
                      )
                    }>
                    <TextSmall
                      color={
                        selectedPriceRange === p.label
                          ? colors.while
                          : colors.black
                      }>
                      {p.label}
                    </TextSmall>
                  </TouchableOpacity>
                ))}
              </Block>

              <TextMedium style={{marginTop: 20}}>Loại Sản Phẩm</TextMedium>
              <Block row marT={8} flexWrap="wrap" gap={10}>
                {categories.map(c => (
                  <TouchableOpacity
                    key={c}
                    style={[
                      styles.optionBtn,
                      selectedCategory === c && styles.optionBtnActive,
                    ]}
                    onPress={() =>
                      setSelectedCategory(selectedCategory === c ? null : c)
                    }>
                    <TextSmall
                      color={
                        selectedPriceRange === c ? colors.while : colors.black
                      }>
                      {c}
                    </TextSmall>
                  </TouchableOpacity>
                ))}
              </Block>
            </ScrollView>

            <Block flex1 row containerStyle={styles.btnSort}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.resetBtn}
                onPress={() => {
                  setSelectedCategory(null);
                  setSelectedPriceRange(null);
                }}>
                <TextMedium color={colors.primary}>Thiết lập lại</TextMedium>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.applyBtn}
                onPress={() => setModalVisible(false)}>
                <TextMedium color="white">Áp dụng</TextMedium>
              </TouchableOpacity>
            </Block>
          </Block>
        }
      />

      <ModalCenter
        visible={isOpenCheck}
        content={'Hãy đăng nhập để sử dụng'}
        onClose={() => setIsOpenCheck(false)}
        onPress={() => {
          handleLogin();
        }}
      />
    </ContainerView>
  );
};

export default SearchSplitScreen;

const styles = StyleSheet.create({
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  searchInput: {
    height: 35,
  },

  optionBtn: {
    width: 125,
    paddingVertical: 6.5,
    borderRadius: 10,
    backgroundColor: colors.gray2,
    alignItems: 'center',
    gap: 10,
  },
  optionBtnActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },

  resetBtn: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderColor: colors.primary,
    borderWidth: 2,
    alignItems: 'center',
    marginRight: 10,
  },
  applyBtn: {
    flex: 1,
    padding: 10,
    backgroundColor: colors.primary,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnSort: {
    position: 'absolute',
    bottom: 45,
    alignSelf: 'center',
  },

  /////
  image: {
    width: 25,
    height: 25,
  },
  btnLeft: {
    height: 40,
    width: 40,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemtab: {
    width: '100%',
    paddingVertical: 8,
    borderBottomWidth: 2,
    alignItems: 'center',
  },
  tab: {
    width: '100%',
    flexDirection: 'row',
    borderBottomWidth: 0.2,
  },
});
