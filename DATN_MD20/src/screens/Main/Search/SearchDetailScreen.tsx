import type React from 'react';
import {useEffect, useState} from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  FlatList,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import navigation from '../../../navigation/navigation';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import useLanguage from '../../../hooks/useLanguage';
import {useAppTheme} from '../../../themes/ThemeContext';
import {useAppDispatch, useAppSelector} from '../../../redux/store';
import {
  fetchCategory,
  fetchProducts,
  fetchSearchProduct,
  searchCategory,
} from '../../../redux/actions/product';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {fetchFavorites, toggleFavorite} from '../../../redux/actions/favorite';
import ScreenName from '../../../navigation/ScreenName';
import ContainerView from '../../../components/layout/ContainerView';
import {IconSRC} from '../../../constants/icons';
import InputBase from '../../../components/dataEntry/Input/InputBase';
import {colors} from '../../../themes/colors';
import ModalCenter from '../../../components/dataDisplay/Modal/ModalCenter';
import Block from '../../../components/layout/Block';
import {TextMedium, TextSmall} from '../../../components/dataEntry/TextBase';
import ListProduct from '../../../components/dataDisplay/ListProduct';
import TouchIcon from '../../../components/dataEntry/Button/TouchIcon';

const normalizeText = (text: string) => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // xoá dấu
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s]/g, '');
};
const HISTORY_KEY = 'search_history';

const SearchDetailScreen = () => {
  const {top} = useSafeAreaInsets();
  const {getTranslation} = useLanguage();
  const theme = useAppTheme();

  const [keyword, setKeyword] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [isOpenCheck, setIsOpenCheck] = useState(false);

  const dispatch = useAppDispatch();
  const {products, productSearch, categorieSearch} = useAppSelector(
    state => state.product,
  );
  //   console.log('CATE--', categorieSearch);

  const {token} = useAppSelector(state => state.auth);
  const {listFavoriteIds} = useAppSelector(state => state.favorite);

  const listSearchHistory = searchHistory.slice(0, 5);
  const listSearchProduct = productSearch.slice(0, 8);

  const productHot = [...products]
    .sort((a, b) => b.sold_count - a.sold_count)
    .slice(0, 10);

  useEffect(() => {
    dispatch(fetchCategory());
    dispatch(fetchProducts());
    loadHistory();
  }, []);

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

  const handleProDetail = (id: string) => {
    navigation.navigate(ScreenName.Main.ProductDetail, {id});
  };

  const handleSubmitSearch = async () => {
    if (!keyword.trim()) return;

    const normalized = keyword.trim();
    let newHistory = [...searchHistory];

    // Xoá nếu từ khóa đã tồn tại để đưa lên đầu
    newHistory = newHistory.filter(item => item !== normalized);
    newHistory.unshift(normalized);

    // Giới hạn 10 item lưu trữ, 5 item hiển thị
    newHistory = newHistory.slice(0, 10);

    setSearchHistory(newHistory);
    await saveHistory(newHistory);

    navigation.navigate(ScreenName.Main.ListSearchScreen, {
      searchQuery: normalized,
    });
  };

  const handleSearchCategory = async (name: string) => {
    const normalized = name.trim();
    let newHistory = [...searchHistory];
    newHistory = newHistory.filter(entry => entry !== normalized);
    newHistory.unshift(normalized);
    newHistory = newHistory.slice(0, 10);

    setSearchHistory(newHistory);
    await saveHistory(newHistory);

    navigation.navigate(ScreenName.Main.ListSearchScreen, {
      searchQuery: name,
    });
  };

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
            onChangeText={text => {
              setKeyword(text);
            }}
            onSubmitEditing={() => {
              handleSubmitSearch();
            }}
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
        </View>

        <ScrollView
          // contentContainerStyle={{flex: 1}}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          {keyword === '' && (
            <FlatList
              data={listSearchHistory}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item}) => {
                return (
                  <TouchableOpacity
                    style={styles.suggestionItem}
                    onPress={() => {
                      // setKeyword(item);
                      navigation.navigate(ScreenName.Main.ListSearchScreen, {
                        searchQuery: item,
                      });
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
            </Block>
          )}

          {keyword !== '' && (
            <Block flex1>
              {/* Không tìm thấy */}
              {categorieSearch.length === 0 && productSearch.length === 0 ? (
                <Block alignCT justifyCT marT={50}>
                  <TextSmall>Không tìm thấy kết quả</TextSmall>
                </Block>
              ) : (
                <>
                  {/* Gợi ý theo thể loại */}
                  {categorieSearch.map(item => (
                    <TouchableOpacity
                      key={item._id}
                      activeOpacity={0.8}
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
                </>
              )}
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

export default SearchDetailScreen;

const styles = StyleSheet.create({
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 10,
  },
  suggestionItem: {
    paddingVertical: 12,
    borderBottomWidth: 0.3,
    borderBottomColor: colors.gray3,
  },
});
