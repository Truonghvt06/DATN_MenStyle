import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import ContainerView from '../../../components/layout/ContainerView';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Header from '../../../components/dataDisplay/Header';
import navigation from '../../../navigation/navigation';
import ScreenName from '../../../navigation/ScreenName';
import {IconSRC, ImgSRC} from '../../../constants/icons';
import metrics from '../../../constants/metrics';
import Block from '../../../components/layout/Block';
import {
  TextHeight,
  TextMedium,
  TextSmall,
} from '../../../components/dataEntry/TextBase';
import {colors} from '../../../themes/colors';
import {dataProduct} from '../../../constants/data';
import TouchIcon from '../../../components/dataEntry/Button/TouchIcon';
import ReviewItem from '../../../components/dataDisplay/ReviewItem';
import {useRoute} from '@react-navigation/native';
import ButtonBase from '../../../components/dataEntry/Button/ButtonBase';
import ModalBottom from '../../../components/dataDisplay/Modal/ModalBottom';
import AddCart from './AddCart';
import {useAppDispatch, useAppSelector} from '../../../redux/store';
import {fetchProductDetail} from '../../../redux/actions/product';
import {clearProductDetail} from '../../../redux/reducers/product';
import ListProduct from '../../../components/dataDisplay/ListProduct';
import {fetchFavorites, toggleFavorite} from '../../../redux/actions/favorite';
import useLanguage from '../../../hooks/useLanguage';
import {useAppTheme} from '../../../themes/ThemeContext';
import Toast from 'react-native-toast-message';
import configToast from '../../../components/utils/configToast';
import ModalCenter from '../../../components/dataDisplay/Modal/ModalCenter';
import {addToCart, fetchCart} from '../../../redux/actions/cart';

const ProductDetail = () => {
  const {top} = useSafeAreaInsets();
  const {getTranslation} = useLanguage();
  const route = useRoute();
  // const {product} = route.params as {product: any};
  const {id} = route.params as {id: string; idOld?: string};
  const theme = useAppTheme();

  const [proData, setProData] = useState<any>([]);
  const [showDescription, setShowDescription] = useState(false);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [openModal, setOpenModal] = useState(false);
  const [isOpenCheck, setIsOpenCheck] = useState(false);

  const [isReady, setIsReady] = useState(false); //Độ trễ lại trước khi hiển thị dữ liệu
  const lineNumber = 4;

  //tạo mảng chứa
  const sizes = [...new Set(proData?.variants?.map((v: any) => v.size) || [])];
  const colorss = [
    ...new Set(proData?.variants?.map((v: any) => v.color) || []),
  ];

  const dispatch = useAppDispatch();
  const {detail, relatedProducts} = useAppSelector(state => state.product);
  const {listFavoriteIds} = useAppSelector(state => state.favorite);
  const {token, user} = useAppSelector(state => state.auth);

  useEffect(() => {
    // fetch nếu thiếu
    if (!detail || detail._id !== id) {
      dispatch(fetchProductDetail(id));
    }
  }, [id]);

  useEffect(() => {
    if (detail && detail._id === id) {
      setProData(detail);
      if (detail.variants?.length) {
        setSelectedSize(detail.variants[0].size);
        setSelectedColor(detail.variants[0].color);
      }
      const timeout = setTimeout(() => {
        setIsReady(true);
      }, 1000);

      return () => clearTimeout(timeout);
    }
  }, [detail, id]);

  useEffect(() => {
    dispatch(fetchFavorites());
  }, []);
  const handleFavorite = async (productId: string) => {
    await dispatch(toggleFavorite(productId));
    dispatch(fetchFavorites());
  };

  //Nhấn item Pro gợi ý
  const handleProDetail = (id: string) => {
    dispatch(clearProductDetail());
    navigation.navigate(ScreenName.Main.RelatedProductDetail, {
      id: id,
      // idOld: idOld,
    });
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

  //Them gio hang
  const handleAddCart = async () => {
    if (!user?._id) return handleLogin();
    const variantIndex = proData?.variants?.findIndex(
      (v: any) => v.size === selectedSize && v.color === selectedColor,
    );
    if (variantIndex === -1) return;
    await dispatch(
      addToCart({
        userId: user._id,
        productId: proData._id,
        variantIndex,
        quantity: Number(quantity),
      }),
    );
    await dispatch(fetchCart(user._id));
    setOpenModal(false);
    Toast.show({
      type: 'notification',
      text1: 'Thành công',
      text2: 'Đã thêm vào giỏ hàng!',
      visibilityTime: 1000,
      autoHide: true,
      swipeable: true,
    });
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <ContainerView>
        {!isReady ? (
          <View style={styles.loadingContainer}>
            {/* <TextMedium style={{textAlign: 'center'}}>
              Đang tải sản phẩm...
            </TextMedium> */}
            <ActivityIndicator size={'large'} />
          </View>
        ) : (
          <>
            <Header
              label=" chi tiết Sản phẩm"
              paddingTop={top}
              backgroundColor={theme.background}
              labelColor={theme.text}
              iconColor={theme.text}
              onPressLeft={() => {
                // dispatch(clearProductDetail());
                // if (idOld) {
                //   dispatch(fetchProductDetail(idOld));
                // }
                navigation.goBack();
              }}
            />

            <ScrollView
              nestedScrollEnabled={true}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{paddingBottom: 50}}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.tim}
                onPress={() => {
                  token ? handleFavorite(proData._id) : setIsOpenCheck(true);
                }}>
                <Image
                  source={
                    listFavoriteIds.includes(id)
                      ? IconSRC.icon_unfavorite
                      : IconSRC.icon_favorite
                  }
                  style={{width: 25, height: 25}}
                />
              </TouchableOpacity>
              <Image
                style={styles.img}
                source={{uri: proData?.variants?.[0]?.image || ''}}
              />
              <Block pad={metrics.space}>
                <TextMedium medium numberOfLines={2} ellipsizeMode="tail">
                  {proData?.name}
                </TextMedium>
                <TextHeight bold color={colors.red}>
                  {typeof proData?.price === 'number'
                    ? `${proData?.price.toLocaleString('vi-VN')} VND`
                    : null}
                </TextHeight>
                <Block row alignCT justifyBW marR={20} marT={10} marB={30}>
                  <Block row alignCT>
                    <Image
                      style={{width: 16, height: 16}}
                      source={IconSRC.icon_star}
                    />
                    <TextSmall style={{marginLeft: 5}}>
                      {proData?.rating_avg} ({proData?.rating_count})
                    </TextSmall>
                  </Block>
                  <TextSmall style={{marginLeft: 5}}>
                    Đã bán {proData?.sold_count}
                  </TextSmall>
                </Block>

                <>
                  <TextMedium
                    bold
                    style={{
                      borderTopWidth: 0.3,
                      borderColor: colors.gray3,
                      paddingVertical: 7,
                    }}>
                    {getTranslation('mo_ta_sp')}
                  </TextMedium>
                  <Block marB={lineNumber <= 4 ? 25 : 0}>
                    <TextSmall
                      numberOfLines={showDescription ? undefined : lineNumber}>
                      {proData?.description}
                    </TextSmall>

                    {lineNumber > 4 && (
                      <TouchIcon
                        title={
                          showDescription ? (
                            <TextSmall>Thu gọn</TextSmall>
                          ) : (
                            <TextSmall> {getTranslation('xem_them')}</TextSmall>
                          )
                        }
                        icon={
                          showDescription ? IconSRC.icon_up : IconSRC.icon_down
                        }
                        size={20}
                        onPress={() => setShowDescription(!showDescription)}
                        containerStyle={styles.btnSee}
                      />
                    )}
                  </Block>
                </>
                <>
                  <Block
                    row
                    justifyBW
                    alignCT
                    padV={7}
                    borderTopWidth={0.5}
                    borderColor={colors.gray1}>
                    <TextMedium bold>Đánh giá(123)</TextMedium>
                    <TouchIcon
                      title={getTranslation('xem_tat_ca')}
                      icon={IconSRC.icon_back_right}
                      containerStyle={{
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}
                      onPress={() => {
                        navigation.navigate(
                          ScreenName.Main.Review,
                          //   {
                          //   reviews: proData?.reviews || [],
                          // }
                        );
                      }}
                    />
                  </Block>
                  {dataProduct.slice(0, 2).map((item, index) => {
                    return (
                      <ReviewItem
                        key={`review-${index}`}
                        star={item.star}
                        name="Nguyen Van A"
                        review="Sản phẩm chất lượng tốt, vải mềm mại và thoáng mát. Rất hài lòng với lần mua hàng này."
                      />
                    );
                  })}
                  {/* <>
  <Block
    row
    justifyBW
    alignCT
    padV={7}
    borderTopWidth={0.5}
    borderColor={colors.gray1}>
    <TextMedium bold>Đánh giá ({proData?.reviews?.length || 0})</TextMedium>
    <TouchIcon
      title="Xem tất cả"
      icon={IconSRC.icon_back_right}
      containerStyle={{
        flexDirection: 'row',
        alignItems: 'center',
      }}
      onPress={() => {
        navigation.navigate(ScreenName.Main.Review, {
          reviews: proData?.reviews || [],
        });
      }}
    />
  </Block>

  {(proData?.reviews || []).slice(0, 2).map((item: any, index: number) => (
    <ReviewItem
      key={`review-${index}`}
      star={item.star}
      name={item.name}
      review={item.review}
    />
  ))}
</> */}
                </>
                <TextMedium bold style={{marginTop: 20}}>
                  Sản phẩm liên quan
                </TextMedium>
                <ListProduct
                  data={relatedProducts}
                  scrollEnabled={false}
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
            </ScrollView>
            <ButtonBase
              title="Thêm vào giỏ hàng"
              containerStyle={styles.btnCart}
              onPress={() => {
                token ? setOpenModal(!openModal) : setIsOpenCheck(true);
              }}
            />
          </>
        )}

        <ModalBottom
          // header
          // label="Thêm sản phẩm"
          visible={openModal}
          animationType="fade"
          heightModal={530}
          onClose={() => {
            setOpenModal(false);
          }}
          children={
            <AddCart
              image={
                proData?.variants?.find(
                  (v: any) =>
                    v.size === selectedSize && v.color === selectedColor,
                )?.image || ''
              }
              price={
                typeof proData?.price === 'number'
                  ? proData?.price.toLocaleString('vi-VN')
                  : '0'
              }
              quantity_kho={
                proData?.variants?.find(
                  (v: any) =>
                    v.size === selectedSize && v.color === selectedColor,
                )?.quantity || 0
              }
              onColse={() => setOpenModal(false)}
              value={quantity}
              onChangeText={text => setQuantity(text)}
              onPress={handleAddCart}
              size={
                <>
                  <TextSmall style={styles.boW}>
                    {getTranslation('kich_thuoc')}
                  </TextSmall>
                  <View style={{flexDirection: 'row'}}>
                    {sizes.map((size: any, index): any => {
                      return (
                        <TouchIcon
                          key={`size-${index}`}
                          colorTitle={
                            selectedSize === size ? colors.while : colors.black
                          }
                          title={size}
                          containerStyle={[
                            styles.size,
                            {
                              backgroundColor:
                                selectedSize === size
                                  ? colors.blue1
                                  : colors.while,
                            },
                          ]}
                          onPress={() => {
                            setSelectedSize(size);
                          }}
                        />
                      );
                    })}
                  </View>
                </>
              }
              color={
                <>
                  <TextSmall style={{marginTop: 7}}>
                    {getTranslation('mau_sac')}
                  </TextSmall>
                  <View style={{flexDirection: 'row'}}>
                    {colorss.map((color: any, index) => {
                      return (
                        // <TouchableOpacity
                        //   onPress={() => setSelectedColor(color)}
                        //   key={`color-${index}`}
                        //   style={[
                        //     styles.color,
                        //     {
                        //       borderWidth: selectedColor === color ? 2.5 : 0,
                        //       borderColor:
                        //         selectedColor === color ? colors.blue1 : color,
                        //     },
                        //   ]}>
                        //   <View
                        //     style={[styles.colorView, {backgroundColor: color}]}
                        //   />
                        // </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => setSelectedColor(color)}
                          key={`color-${index}`}
                          style={[
                            styles.color,
                            {
                              backgroundColor:
                                selectedColor === color
                                  ? colors.blue1
                                  : colors.while,
                            },
                          ]}>
                          <TextSmall
                            color={
                              selectedColor === color
                                ? colors.while
                                : colors.black
                            }>
                            {color}
                          </TextSmall>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </>
              }
            />
          }
        />
        {/* <Toast config={configToast} /> */}

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

export default ProductDetail;

const styles = StyleSheet.create({
  container: {},
  btnCart: {
    marginBottom: 30,
    marginTop: 7,
    marginHorizontal: metrics.space * 2,
  },
  img: {
    width: metrics.diviceScreenWidth,
    height: 380,
    resizeMode: 'cover',
  },
  tim: {
    backgroundColor: colors.while,
    position: 'absolute',
    zIndex: 12,
    right: 7,
    top: 7,
    width: 45,
    height: 45,
    alignItems: 'center',
    borderRadius: 40,
    justifyContent: 'center',
  },
  size: {
    width: 50,
    height: 35,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 7,
    marginBottom: 15,
  },
  color: {
    overflow: 'hidden',
    borderRadius: 7,
    height: 35,
    backgroundColor: colors.while,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 8,
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorView: {
    width: 35,
    height: 35,
    borderRadius: 30,
    margin: 2,
  },
  btnSee: {
    flexDirection: 'row',
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  boW: {
    borderTopWidth: 0.3,
    borderColor: colors.while,
    paddingVertical: 7,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});
