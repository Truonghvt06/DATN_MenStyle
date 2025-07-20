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
import {
  TextHeight,
  TextSizeCustom,
  TextSmall,
} from '../../components/dataEntry/TextBase';
import useLanguage from '../../hooks/useLanguage';
import {useAppTheme} from '../../themes/ThemeContext';
import products from '../../services/products';
import {Product} from '../../redux/reducers/product/type';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {fetchProducts} from '../../redux/actions/product';
import ListProduct from '../../components/dataDisplay/ListProduct';
import {fetchFavorites, toggleFavorite} from '../../redux/actions/favorite';
import Toast from 'react-native-toast-message';
import configToast from '../../components/utils/configToast';
import Block from '../../components/layout/Block';

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
      <ContainerView>
        <Header
          visibleLeft
          label={getTranslation('tim_kiem')}
          paddingTop={top}
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 30,
            paddingHorizontal: metrics.space,
            marginTop: 10,
          }}>
          {/* Search Box */}
          <TouchableOpacity
            style={[styles.search, {borderColor: theme.border_color}]}
            activeOpacity={0.7}
            onPress={handleSearch}>
            <Image
              style={[styles.icon, {tintColor: theme.icon}]}
              source={IconSRC.icon_search}
            />
            <TextSmall>{getTranslation('tim_sp')}</TextSmall>
          </TouchableOpacity>

          {/* Banner */}
          <Image style={styles.banner} source={ImgSRC.img_banner} />

          {/* Sản phẩm mới */}
          <Block row alignCT justifyBW marT={20} marB={10}>
            <TextHeight
              style={{
                textTransform: 'capitalize',
              }}
              bold>
              {getTranslation('san_pham_moi')}
            </TextHeight>
            <TouchableOpacity activeOpacity={0.8} onPress={() => {}}>
              <TextSizeCustom
                size={14}
                style={{textDecorationLine: 'underline', fontStyle: 'italic'}}>
                {`${getTranslation('xem_tat_ca')}  `}
              </TextSizeCustom>
            </TouchableOpacity>
          </Block>

          <ListProduct
            data={productNew}
            horizontal={true}
            // isSeemore
            favoriteId={listFavoriteIds}
            onPress={id => {
              handleProDetail(id);
            }}
            onPressFavorite={id => (token ? handleFavorite(id) : handleLogin())}
            // onPressSee={() => {}}
          />

          {/* Sản phẩm bán chạy */}
          <Block row alignCT justifyBW marT={20} marB={10}>
            <TextHeight
              style={{
                textTransform: 'capitalize',
              }}
              bold>
              {getTranslation('san_pham_ban_chay')}
            </TextHeight>
            <TouchableOpacity activeOpacity={0.8} onPress={() => {}}>
              <TextSizeCustom
                size={14}
                style={{textDecorationLine: 'underline', fontStyle: 'italic'}}>
                {`${getTranslation('xem_tat_ca')}  `}
              </TextSizeCustom>
            </TouchableOpacity>
          </Block>
          <ListProduct
            data={productHot}
            horizontal={true}
            // isSeemore
            favoriteId={listFavoriteIds}
            onPress={id => {
              handleProDetail(id);
            }}
            onPressFavorite={id => (token ? handleFavorite(id) : handleLogin())}
            // onPressSee={() => {}}
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
