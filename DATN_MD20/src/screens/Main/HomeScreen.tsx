import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import ContainerView from '../../components/layout/ContainerView';
import Block from '../../components/layout/Block';
import {
  TextHeight,
  TextSizeCustom,
  TextSmall,
} from '../../components/dataEntry/TextBase';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import metrics from '../../constants/metrics';
import {IconSRC} from '../../constants/icons';
import TouchIcon from '../../components/dataEntry/Button/TouchIcon';
import {colors} from '../../themes/colors';
import navigation from '../../navigation/navigation';
import ScreenName from '../../navigation/ScreenName';
import BannerSlider from './Banner/Banner';
import Avatar from '../../components/dataDisplay/Avatar';
import {FlatList} from 'react-native-gesture-handler';
import products from '../../services/products/productService';
import useLanguage from '../../hooks/useLanguage';

import { useAppTheme } from '../../themes/ThemeContext';

import {useAppDispatch, useAppSelector} from '../../redux/store';
import {
  fetchAllProducts,
  fetchCategory,
  fetchProducts,
} from '../../redux/actions/product';
import {Product} from '../../redux/reducers/product/type';
import {fetchFavorites, toggleFavorite} from '../../redux/actions/favorite';
import Toast from 'react-native-toast-message';
import configToast from '../../components/utils/configToast';
import {shuffleArray} from '../../utils/helper';


const ITEM_MARGIN = 10;
const NUM_COLUMNS = 2;
const width = metrics.diviceScreenWidth;
const ITEM_WIDTH = (width - ITEM_MARGIN * (NUM_COLUMNS + 1.5)) / NUM_COLUMNS;
const HomeScreen = () => {
  const theme = useAppTheme();
  const {top} = useSafeAreaInsets();
  const {getTranslation} = useLanguage();
  const [proData, setProData] = useState<Product[]>([]);

  const [page, setPage] = useState(1);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  //action
  const dispatch = useAppDispatch();
  const {products, categories, total, loading} = useAppSelector(
    state => state.product,
  );
  const {listFavoriteIds} = useAppSelector(state => state.favorite);
  const {token} = useAppSelector(state => state.auth);

  //Category
  useEffect(() => {
    dispatch(fetchCategory());
    dispatch(fetchFavorites());
  }, []);
  // Product
  useEffect(() => {
    loading ? (
      <ActivityIndicator size="large" />
    ) : (
      // setTimeout(() => {
      dispatch(fetchAllProducts({page, limit: 10}))
      //   }, 1000)
    );
  }, [page]);

  useEffect(() => {
    if (page === 1) {
      setProData(shuffleArray(products)); // lần đầu random
    } else {
      setProData(prev => [...prev, ...shuffleArray(products)]); // random thêm
    }
    setIsFetchingMore(false);
  }, [products]);

  // console.log('DATA----->:', proData);

  //Loading data
  const handleLoadMore = () => {
    if (!isFetchingMore && proData?.length < total) {
      setIsFetchingMore(true);
      setTimeout(() => {
        setPage(prev => prev + 1);
      }, 2000); //  Delay 2 giây
    }
  };

  const handleSearch = () => {
    navigation.navigate(ScreenName.Main.SearchDetail);
  };
  const handleNotification = () => {
    token
      ? navigation.navigate(ScreenName.Main.Notifications)
      : navigation.navigate(ScreenName.Auth.AuthStack, {
          screen: ScreenName.Auth.Login,
          params: {
            nameScreen: '',
          },
        });
  };
  const handleProDetail = (id: string) => {
    navigation.navigate(ScreenName.Main.ProductDetail, {id: id});
  };
  const handleCategory = (title: string, typetID: string) => {
    navigation.navigate(ScreenName.Main.Category, {
      title: title,
      type: typetID,
    });
  };

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
  const renderHeader = () => (
    <>
      <Block marT={metrics.space * 2} />

      {/* Banner */}
      <BannerSlider />

      {/* Danh mục */}
      <TextHeight
        style={{textTransform: 'capitalize', marginVertical: 10, color: theme.text}}
        bold>
        {getTranslation('danh_muc')}:
      </TextHeight>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {categories.map(category => {
          // console.log('ID', category._id);

          return (
            <Avatar
              key={category._id}
              title={category.name}
              icon={IconSRC.icon_polo} // hoặc từ `category.image` nếu có
              containerStyle={{paddingHorizontal: 20}}
              onPress={() => handleCategory(category.name, category._id)}
            />
          );
        })}
      </ScrollView>

      <TextHeight
        style={{textTransform: 'capitalize', marginVertical: 15, color: theme.text}}
        bold>
        {getTranslation('san_pham_noi_bat')}:
      </TextHeight>
    </>
  );

  return (
    <ContainerView
      containerStyle={{paddingTop: top, paddingHorizontal: metrics.space,backgroundColor: theme.background,}}>
      {/* Header */}

      <Block row justifyBW>
        <Block>
          <TextSmall style={{marginBottom: -5, color: theme.text}}>
            {getTranslation('xin_chao')}
          </TextSmall>
          <TextSizeCustom size={30} bold  style={{ color: theme.text }}>
            MenStyle
          </TextSizeCustom>
        </Block>
        <Block row alignItems="flex-end" marB={5} marR={5}>
          <TouchIcon
            color={theme.text}
            size={25}
            icon={IconSRC.icon_search}
            imageStyle={{marginHorizontal: 7}}
            onPress={handleSearch}
          />
          <TouchableOpacity activeOpacity={1}>
            {token ? (
              <TouchableOpacity
                activeOpacity={1}
                style={styles.tb}
                onPress={handleNotification}>
                <TextSizeCustom
                  style={{textAlign: 'center'}}
                  color="white"
                  size={10}>
                  99
                </TextSizeCustom>
              </TouchableOpacity>
            ) : null}
            <TouchIcon
              color={theme.text}
              size={25}
              icon={IconSRC.icon_notification}
              imageStyle={{marginHorizontal: 7}}
              onPress={handleNotification}
            />
          </TouchableOpacity>
        </Block>
      </Block>
      <Toast config={configToast} />

      {/* Sản phẩm  */}
      <FlatList
        data={proData}
        keyExtractor={(item, index) => `${item._id}-${index}`}
        ListHeaderComponent={renderHeader}
        renderItem={({item}) => {
          return (

            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => {
                handleProDetail(item);
              }}>
              <Block containerStyle={styles.shadowWrap}>
                <Block containerStyle={[styles.btn,{ backgroundColor: theme.background }]}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={[styles.tim, { backgroundColor: theme.background }]}
                    onPress={() => {
                      handleFavorite(item._id);
                    }}>
                    <Image
                      source={
                        item.favorite
                          ? IconSRC.icon_unfavorite
                          : IconSRC.icon_favorite
                      }
                      style={{width: 20, height: 20}}
                    />
                  </TouchableOpacity>
                  <Image
                    style={styles.image}
                    source={{uri: item.variants?.[0]?.image || ''}}
                  />
                  <Block mar={5}>
                    <TextSmall medium numberOfLines={2} ellipsizeMode="tail"  style={{ color: theme.text }}>
                      {item.name}
                    </TextSmall>
                    <Block row alignCT>
                      <Image style={styles.star} source={IconSRC.icon_star} />
                      <TextSmall style={{ color: theme.text }}>{item.rating_avg}</TextSmall>

            <>
              {proData.length === 0 ? (
                <Text style={{textAlign: 'center', marginTop: 20}}>
                  Đang tải sản phẩm...
                </Text>
              ) : (
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => {
                    handleProDetail(item._id);
                  }}>
                  <Block containerStyle={styles.shadowWrap}>
                    <Block containerStyle={[styles.btn]}>
                      <TouchableOpacity
                        activeOpacity={0.8}
                        style={styles.tim}
                        onPress={() => {
                          token ? handleFavorite(item._id) : handleLogin();
                        }}>
                        <Image
                          source={
                            listFavoriteIds.includes(item._id)
                              ? IconSRC.icon_unfavorite
                              : IconSRC.icon_favorite
                          }
                          style={{width: 20, height: 20}}
                        />
                      </TouchableOpacity>
                      <Image
                        style={styles.image}
                        source={{uri: item.variants?.[0]?.image || ''}}
                      />
                      <Block mar={5}>
                        <TextSmall
                          medium
                          numberOfLines={1}
                          ellipsizeMode="tail">
                          {item.name}
                        </TextSmall>
                        <Block row alignCT>
                          <Image
                            style={styles.star}
                            source={IconSRC.icon_star}
                          />
                          <TextSmall>{item.rating_avg}</TextSmall>
                        </Block>
                        <TextHeight color={colors.red} bold>
                          {item.price.toLocaleString('vi-VN')} VND
                        </TextHeight>
                      </Block>

                    </Block>
                  </Block>
                </TouchableOpacity>
              )}
            </>
          );
        }}
        numColumns={NUM_COLUMNS}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 50,
        }}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.3} // 30% cuối
        ListFooterComponent={
          isFetchingMore ? (
            <ActivityIndicator
              size="small"
              color="gray"
              style={{marginVertical: 10}}
            />
          ) : null
        }
      />
    </ContainerView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  tim: {
    backgroundColor: colors.while,
    position: 'absolute',
    zIndex: 12,
    right: 7,
    top: 7,
    width: 35,
    height: 35,
    alignItems: 'center',
    borderRadius: 20,
    justifyContent: 'center',
  },
  icons: {
    width: 25,
    height: 25,
    marginHorizontal: metrics.space,
  },

  shadowWrap: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
    borderRadius: 12,
    marginHorizontal: ITEM_MARGIN / 2,
    marginBottom: 16,
  },

  btn: {
    backgroundColor: colors.while,
    borderRadius: 12,
    overflow: 'hidden',
    width: ITEM_WIDTH,
  },

  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  star: {
    width: 16,
    height: 16,
    marginRight: 5,
  },
  tb: {
    backgroundColor: colors.red,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
    height: 18,
    width: 20,
    borderRadius: 30,
    position: 'absolute',
    right: 0,
    top: -8,
  },
});
