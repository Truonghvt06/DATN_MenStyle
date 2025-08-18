// import {StyleSheet, Text, View} from 'react-native';
// import React from 'react';

// const ListSearchScreen = () => {
//   return (
//     <View>
//       <Text>ListSearchScreen</Text>
//     </View>
//   );
// };

// export default ListSearchScreen;

// const styles = StyleSheet.create({});

import {useRoute} from '@react-navigation/native';
import type React from 'react';
import {useState, useEffect, useMemo} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  FlatList,
  StatusBar,
  SafeAreaView,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {Product} from '../../../redux/reducers/product/type';
import useLanguage from '../../../hooks/useLanguage';
import {useAppTheme} from '../../../themes/ThemeContext';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useAppDispatch, useAppSelector} from '../../../redux/store';
import {fetchFavorites, toggleFavorite} from '../../../redux/actions/favorite';
import navigation from '../../../navigation/navigation';
import ScreenName from '../../../navigation/ScreenName';
import {TextMedium, TextSmall} from '../../../components/dataEntry/TextBase';
import ContainerView from '../../../components/layout/ContainerView';
import metrics from '../../../constants/metrics';
import Block from '../../../components/layout/Block';
import InputBase from '../../../components/dataEntry/Input/InputBase';
import {IconSRC} from '../../../constants/icons';
import ListProduct from '../../../components/dataDisplay/ListProduct';
import ModalCenter from '../../../components/dataDisplay/Modal/ModalCenter';
import {colors} from '../../../themes/colors';
import ModalBottom from '../../../components/dataDisplay/Modal/ModalBottom';
import {
  fetchCategory,
  fetchSearchProduct,
  searchCategory,
} from '../../../redux/actions/product';

const priceRanges = [
  {label: 'Dưới 100k', min: 0, max: 100000},
  {label: '100k - 300k', min: 100000, max: 300000},
  {label: '300k - 500k', min: 300000, max: 500000},
  {label: 'Trên 500k', min: 500000, max: Infinity},
];

const normalizeText = (text: string) => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // xoá dấu
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s]/g, '');
};

const ListSearchScreen = () => {
  const route = useRoute();
  const {top} = useSafeAreaInsets();
  const {getTranslation} = useLanguage();
  const theme = useAppTheme();

  const {searchQuery} = route.params as {searchQuery: string};
  const [selectedTab, setSelectedTab] = useState(getTranslation('tat_ca'));
  const [proData, setProData] = useState<Product[]>([]);

  const [isOpenCheck, setIsOpenCheck] = useState(false);
  const [sortByPriceAsc, setSortByPriceAsc] = useState<boolean | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [keyword, setKeyword] = useState(searchQuery || '');
  const [committedQuery, setCommittedQuery] = useState(searchQuery); // query đang hiển thị chính thức
  const [isEditing, setIsEditing] = useState(false);

  // state áp dụng thực sự
  const [appliedPriceRange, setAppliedPriceRange] = useState<string | null>(
    null,
  );
  const [appliedCategoryID, setAppliedCategoryID] = useState<string | null>(
    null,
  );
  const [appliedCategory, setAppliedCategory] = useState<string | null>(null);

  // state tạm trong modal
  const [tempPriceRange, setTempPriceRange] = useState<string | null>(null);
  const [tempCategory, setTempCategory] = useState<string | null>(null);
  const [tempCategoryID, setTempCategoryID] = useState<string | null>(null);

  const dispatch = useAppDispatch();
  const {productSearch, categories, categorieSearch} = useAppSelector(
    state => state.product,
  );
  const {token} = useAppSelector(state => state.auth);
  const {listFavoriteIds} = useAppSelector(state => state.favorite);

  const listSearchProduct = productSearch.slice(0, 8);

  const tabs = [
    // 'Liên quan',
    getTranslation('tat_ca'),
    getTranslation('moi_nhat'),
    getTranslation('ban_chay'),
    getTranslation('gia'),
  ];

  // mỗi lần mở modal thì sync temp từ applied
  useEffect(() => {
    if (modalVisible) {
      setTempPriceRange(appliedPriceRange);
      setTempCategory(appliedCategory);
      setTempCategoryID(appliedCategoryID);
    }
  }, [modalVisible]);

  /// tìm kiếm tiếp
  useEffect(() => {
    setIsEditing(keyword !== committedQuery);
  }, [keyword, committedQuery]);

  useEffect(() => {
    if (keyword === committedQuery) {
      // reset tạm
      setTempPriceRange(null);
      setTempCategory(null);
      setTempCategoryID(null);
      // reset áp dụng luôn nếu muốn search hoàn toàn mới
      setAppliedPriceRange(null);
      setAppliedCategory(null);
      setAppliedCategoryID(null);
    }
  }, [committedQuery]);
  ////

  useEffect(() => {
    dispatch(fetchCategory());
  }, []);

  useEffect(() => {
    setProData(productSearch);
  }, [productSearch]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const normalized = normalizeText(keyword.trim());
      if (normalized) {
        dispatch(searchCategory(normalized));
        dispatch(fetchSearchProduct(normalized));
      }
    }, 300); // debounce 300ms

    return () => clearTimeout(delayDebounce);
  }, [keyword]);
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

  //   CHON TAB
  const handleSelectedTab = (tab: string) => {
    const priceTabLabel = getTranslation('gia');

    if (tab === priceTabLabel) {
      if (selectedTab === priceTabLabel) {
        setSortByPriceAsc(prev => (prev === null ? true : !prev));
      } else {
        setSortByPriceAsc(true);
      }
    } else {
      setSortByPriceAsc(null);
    }

    setSelectedTab(tab);
  };

  //   LIST SORT

  const filteredProducts = useMemo(() => {
    if (!proData) return [];

    let filtered = [...proData];

    if (appliedPriceRange) {
      const range = priceRanges.find(r => r.label === appliedPriceRange);
      if (range) {
        filtered = filtered.filter(
          p => p.price >= range.min && p.price <= range.max,
        );
      }
    }

    if (appliedCategoryID) {
      filtered = filtered.filter(p => p.type === appliedCategoryID);
    }

    switch (selectedTab) {
      case getTranslation('moi_nhat'):
        return filtered.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
      case getTranslation('ban_chay'):
        return filtered.sort((a, b) => b.sold_count - a.sold_count);
      case getTranslation('gia'):
        return filtered.sort((a, b) =>
          sortByPriceAsc ? a.price - b.price : b.price - a.price,
        );
      default:
        return filtered;
    }
  }, [
    selectedTab,
    proData,
    sortByPriceAsc,
    appliedPriceRange,
    appliedCategoryID,
  ]);

  const handleSearchCategory = async (name: string) => {
    setKeyword(name);
    setCommittedQuery(name);
    // gọi search theo từ khóa mới
    const normalized = normalizeText(name.trim());
    dispatch(searchCategory(normalized));
    dispatch(fetchSearchProduct(normalized));
    // nếu muốn reset bộ lọc tạm:
    setTempPriceRange(null);
    setTempCategory(null);
    setTempCategoryID(null);
    // và có thể reset áp dụng nếu muốn:
    setAppliedPriceRange(null);
    setAppliedCategory(null);
    setAppliedCategoryID(null);
  };

  const handleBack = () => {
    if (isEditing) {
      setKeyword(committedQuery);
      Keyboard.dismiss();
      // nếu bạn muốn reset kết quả tìm kiếm về committedQuery:
      dispatch(fetchSearchProduct(committedQuery));
    } else {
      navigation.goBack();
    }
  };

  //////////////////////

  const renderTab = (tab: string) => {
    return (
      <View
        key={tab}
        style={{
          width: '25%',
          flexDirection: 'row',
          justifyContent: 'center',
        }}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => handleSelectedTab(tab)}
          style={[
            styles.itemtab,
            {
              backgroundColor: theme.background,
              borderBottomColor:
                selectedTab === tab ? theme.primary : 'transparent',
            },
          ]}>
          <Block row>
            <TextSmall
              style={{
                color: selectedTab === tab ? theme.primary : theme.text,
              }}>
              {tab}
            </TextSmall>
            {tab === getTranslation('gia') && (
              <Image
                source={
                  selectedTab === getTranslation('gia')
                    ? sortByPriceAsc
                      ? IconSRC.up
                      : IconSRC.down
                    : IconSRC.up_down
                }
                style={[
                  styles.iconPrice,
                  {tintColor: selectedTab === tab ? theme.primary : theme.icon},
                ]}
              />
            )}
          </Block>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ContainerView paddingTop={top}>
        {/* Header */}

        <Block row alignCT padR={10}>
          <TouchableOpacity
            activeOpacity={0.9}
            style={[styles.btnLeft]}
            onPress={() => handleBack()}>
            <Image
              style={[styles.image, {tintColor: theme.icon}]}
              source={IconSRC.icon_back_left}
            />
          </TouchableOpacity>
          <InputBase
            inputStyle={[styles.searchInput, {color: theme.text}]}
            value={keyword}
            placeholder="Tìm kiếm sản phẩm..."
            onChangeText={text => setKeyword(text)}
            onSubmitEditing={() => {
              setCommittedQuery(keyword);
            }}
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
        </Block>
        {keyword === committedQuery && (
          <>
            {/* TAB  */}
            <Block
              row
              marT={12}
              borderBottomW={0.3}
              borderColor={theme.border_color}>
              {tabs.map(renderTab)}
            </Block>

            {/* Products List */}
            <Block padB={100}>
              {filteredProducts.length === 0 ? (
                <Block flex1 alignCT justifyCT>
                  <TextSmall>Không tìn thấy sản phẩm</TextSmall>
                </Block>
              ) : (
                <Block padH={8}>
                  <ListProduct
                    data={filteredProducts}
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
                </Block>
              )}
            </Block>
          </>
        )}

        {keyword !== committedQuery && (
          <Block flex1>
            {/* Không tìm thấy */}
            {categorieSearch.length === 0 && productSearch.length === 0 ? (
              <Block alignCT justifyCT marT={50}>
                <TextSmall>Không tìm thấy kết quả</TextSmall>
              </Block>
            ) : (
              <Block padH={8}>
                {/* Gợi ý theo thể loại */}
                {categorieSearch.map(item => (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    key={item._id}
                    style={styles.suggestionItem}
                    onPress={() => {
                      handleSearchCategory(item.name);
                    }}>
                    <TextSmall>{item.name}</TextSmall>
                  </TouchableOpacity>
                ))}

                {/* Sản phẩm */}
                <TextMedium
                  bold
                  style={{
                    marginTop: 30,
                    marginBottom: 6,
                    textTransform: 'capitalize',
                  }}>
                  Sản phẩm
                </TextMedium>
                <ListProduct
                  isColums
                  scrollEnabled={false}
                  columNumber={2}
                  data={listSearchProduct}
                  favoriteId={listFavoriteIds}
                  onPress={id => handleProDetail(id)}
                  onPressFavorite={id =>
                    token ? handleFavorite(id) : setIsOpenCheck(true)
                  }
                />
              </Block>
            )}
          </Block>
        )}

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
                  {/* Khoảng Giá */}
                  {priceRanges.map(p => (
                    <TouchableOpacity
                      key={p.label}
                      style={[
                        styles.optionBtn,
                        tempPriceRange === p.label && styles.optionBtnActive,
                      ]}
                      onPress={() =>
                        setTempPriceRange(
                          tempPriceRange === p.label ? null : p.label,
                        )
                      }>
                      <TextSmall
                        color={
                          tempPriceRange === p.label
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
                  {/* Loại Sản Phẩm */}
                  {categories.map(c => (
                    <TouchableOpacity
                      key={`search-${c._id}`}
                      style={[
                        styles.optionBtn,
                        tempCategory === c.name && styles.optionBtnActive,
                      ]}
                      onPress={() => {
                        setTempCategory(
                          tempCategory === c.name ? null : c.name,
                        );
                        setTempCategoryID(
                          tempCategoryID === c._id ? null : c._id,
                        );
                      }}>
                      <TextSmall
                        color={
                          tempCategory === c.name ? colors.while : colors.black
                        }>
                        {c.name}
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
                    setTempCategory(null);
                    setTempCategoryID(null);
                    setTempPriceRange(null);
                  }}>
                  <TextMedium color={colors.primary}>Thiết lập lại</TextMedium>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.applyBtn}
                  onPress={() => {
                    setAppliedPriceRange(tempPriceRange);
                    setAppliedCategory(tempCategory);
                    setAppliedCategoryID(tempCategoryID);
                    setModalVisible(false);
                  }}>
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
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  iconPrice: {
    width: 12,
    height: 12,
    alignSelf: 'center',
    marginLeft: 3,
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
  searchInput: {
    height: 35,
  },
  suggestionItem: {
    paddingVertical: 12,
    borderBottomWidth: 0.3,
    borderBottomColor: colors.gray3,
  },
});

export default ListSearchScreen;
