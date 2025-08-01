import {useRoute} from '@react-navigation/native';
import React, {useState, useMemo, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ContainerView from '../../../components/layout/ContainerView';
import Header from '../../../components/dataDisplay/Header';
import {TextMedium, TextSmall} from '../../../components/dataEntry/TextBase';
import ListProduct from '../../../components/dataDisplay/ListProduct';
import Block from '../../../components/layout/Block';
import metrics from '../../../constants/metrics';
import useLanguage from '../../../hooks/useLanguage';
import {useAppDispatch, useAppSelector} from '../../../redux/store';
import {fetchProductsByCategory} from '../../../redux/actions/product';
import {Product} from '../../../redux/reducers/product/type';
import navigation from '../../../navigation/navigation';
import {clearProCate} from '../../../redux/reducers/product';
import ScreenName from '../../../navigation/ScreenName';
import {fetchFavorites, toggleFavorite} from '../../../redux/actions/favorite';
import Toast from 'react-native-toast-message';
import configToast from '../../../components/utils/configToast';
import {useAppTheme} from '../../../themes/ThemeContext';
import ModalCenter from '../../../components/dataDisplay/Modal/ModalCenter';
import {IconSRC} from '../../../constants/icons';

const CategoryScreen = () => {
  const route = useRoute();
  const {getTranslation} = useLanguage();
  const {top} = useSafeAreaInsets();
  const theme = useAppTheme(); // ✅ theme hook
  const {title, type} = route.params as {title: string; type: string};
  const [dataProCate, setDataProCate] = useState<Product[]>([]);
  const [selectedTab, setSelectedTab] = useState(getTranslation('tat_ca'));
  const [isReady, setIsReady] = useState(false);
  const [isOpenCheck, setIsOpenCheck] = useState(false);
  const [sortByPriceAsc, setSortByPriceAsc] = useState<boolean | null>(null);

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

  const handleTabPress = (tab: string) => setSelectedTab(tab);

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

  const filteredProducts = useMemo(() => {
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
        return [...dataProCate].sort((a, b) =>
          sortByPriceAsc ? a.price - b.price : b.price - a.price,
        );

      case getTranslation('tat_ca'):
      default:
        return dataProCate;
    }
  }, [selectedTab, dataProCate, sortByPriceAsc]);

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
    <ContainerView>
      {!isReady ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.icon} />
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
            backgroundColor={theme.background}
            labelColor={theme.text}
          />
          <View style={[styles.tab, {borderColor: theme.border_color}]}>
            {tabs.map(renderTab)}
          </View>
          <Toast config={configToast} />
          <Block padH={8} flex1>
            {dataProCate.length === 0 ? (
              <Block flex1 alignCT justifyCT>
                <TextMedium color={theme.text}>
                  Chưa có sản phẩm loại này!
                </TextMedium>
              </Block>
            ) : (
              <ListProduct
                data={filteredProducts}
                isColums
                columNumber={2}
                favoriteId={listFavoriteIds}
                onPress={handleProDetail}
                onPressFavorite={id =>
                  token ? handleFavorite(id) : setIsOpenCheck(true)
                }
              />
            )}
          </Block>
        </>
      )}

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
    borderBottomWidth: 0.2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  iconPrice: {
    width: 12,
    height: 12,
    alignSelf: 'center',
    marginLeft: 3,
  },
});
