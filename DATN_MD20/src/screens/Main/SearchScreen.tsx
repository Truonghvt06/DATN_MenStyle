import {
  Alert,
  Image,
  Keyboard,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import ContainerView from '../../components/layout/ContainerView';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Header from '../../components/dataDisplay/Header';
import navigation from '../../navigation/navigation';
import ScreenName from '../../navigation/ScreenName';
import {IconSRC, ImgSRC} from '../../constants/icons';
import metrics from '../../constants/metrics';
import Block from '../../components/layout/Block';
import {TextHeight, TextSmall} from '../../components/dataEntry/TextBase';
import {colors} from '../../themes/colors';
import useLanguage from '../../hooks/useLanguage';
import {useAppTheme} from '../../themes/ThemeContext';
import products from '../../services/products';
import {Product} from '../../redux/reducers/product/type';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {fetchAllProducts, fetchProducts} from '../../redux/actions/product';
import ListProduct from '../../components/dataDisplay/ListProduct';
import {fetchFavorites, toggleFavorite} from '../../redux/actions/favorite';
import Toast from 'react-native-toast-message';
import configToast from '../../components/utils/configToast';

const SearchScreen = () => {
  const {top} = useSafeAreaInsets();
  const {getTranslation} = useLanguage();
  const theme = useAppTheme();

  const [proData, setProData] = useState<Product[]>([]);
  const dispatch = useAppDispatch();
  const {products} = useAppSelector(state => state.product);
  const {token} = useAppSelector(state => state.auth);
  const {listFavoriteIds} = useAppSelector(state => state.favorite);

  const productNew = [...proData]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 5);

  const productHot = [...proData]
    .sort((a, b) => b.sold_count - a.sold_count)
    .slice(0, 5);

  useEffect(() => {
    dispatch(fetchProducts());
  }, []);

  useEffect(() => {
    setProData(products);
  }, [products]);

  const handleFavorite = async (productId: string) => {
    await dispatch(toggleFavorite(productId));
    dispatch(fetchFavorites());
  };

  const handleLogin = () => {
    Alert.alert(
      getTranslation('thong_bao'),
      'Hãy đăng nhập để sử dụng',
      [
        {text: getTranslation('huy'), style: 'cancel'},
        {
          text: 'OK',
          onPress: () => {
            navigation.navigate(ScreenName.Auth.AuthStack, {
              screen: ScreenName.Auth.Login,
              params: {nameScreen: ''},
            });
          },
        },
      ],
      {cancelable: true},
    );
  };
  const handleSearch = () => {
    navigation.navigate(ScreenName.Main.SearchDetail);
  };

  const handleProDetail = (id: string) => {
    navigation.navigate(ScreenName.Main.ProductDetail, {id});
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <ContainerView
        containerStyle={{
          backgroundColor: theme.background,
        }}>
        <Header
          visibleLeft
          label={getTranslation('tim_kiem')}
          paddingTop={top}
          backgroundColor={theme.background} // ✅ dùng được rồi
          labelColor={theme.text} // ✅ dùng được rồi
          iconColor={theme.text}
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 30,
            paddingHorizontal: metrics.space,
          }}>
          {/* Search Box */}
          <TouchableOpacity
            style={[
              styles.search,
              {backgroundColor: theme.background, borderColor: theme.text},
            ]}
            activeOpacity={0.7}
            onPress={handleSearch}>
            <Image
              style={[styles.icon, {tintColor: theme.text}]}
              source={IconSRC.icon_search}
            />
            <TextSmall style={{color: theme.text}}>
              {getTranslation('tim_sp')}
            </TextSmall>
          </TouchableOpacity>

          {/* Banner */}
          <Image style={styles.banner} source={ImgSRC.img_banner} />

          {/* Sản phẩm mới */}
          <TextHeight style={{...styles.titel, color: theme.text}} bold>
            {getTranslation('san_pham_moi')}:
          </TextHeight>

          <ListProduct
            data={productNew}
            horizontal={true}
            isSeemore
            favoriteId={listFavoriteIds}
            onPress={id => {
              handleProDetail(id);
            }}
            onPressFavorite={id => (token ? handleFavorite(id) : handleLogin())}
            onPressSee={() => {}}
          />

          {/* Sản phẩm bán chạy */}
          <TextHeight
            style={{
              textTransform: 'capitalize',
              marginTop: 20,
              marginBottom: 10,
              color: theme.text,
            }}
            bold>
            {getTranslation('san_pham_ban_chay')}:
          </TextHeight>
          <ListProduct
            data={productHot}
            horizontal={true}
            isSeemore
            favoriteId={listFavoriteIds}
            onPress={id => {
              handleProDetail(id);
            }}
            onPressFavorite={id => (token ? handleFavorite(id) : handleLogin())}
            onPressSee={() => {}}
          />
        </ScrollView>
        <Toast config={configToast} />
      </ContainerView>
    </TouchableWithoutFeedback>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  search: {
    marginTop: 10,
    flexDirection: 'row',
    borderWidth: 1,
    height: 40,
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  icon: {
    marginRight: 10,
    width: 20,
    height: 20,
  },
  banner: {
    marginTop: 20,
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  titel: {
    textTransform: 'capitalize',
    marginTop: 20,
    marginBottom: 10,
  },
  card: {
    width: 150,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
});
