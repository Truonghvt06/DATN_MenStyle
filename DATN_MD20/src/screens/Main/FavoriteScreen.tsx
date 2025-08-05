import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ContainerView from '../../components/layout/ContainerView';
import Header from '../../components/dataDisplay/Header';
import FavoriteItem from '../../components/dataDisplay/FavoriteItem';
import TouchIcon from '../../components/dataEntry/Button/TouchIcon';
import {IconSRC} from '../../constants/icons';
import {colors} from '../../themes/colors';
import ModalBottom from '../../components/dataDisplay/Modal/ModalBottom';
import metrics from '../../constants/metrics';
import ButtonOption from '../../components/dataEntry/Button/BottonOption';
import Block from '../../components/layout/Block';
import useLanguage from '../../hooks/useLanguage';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {
  clearFavorites,
  deleteFavorite,
  fetchFavorites,
} from '../../redux/actions/favorite';
import {TextMedium, TextSmall} from '../../components/dataEntry/TextBase';
import ButtonBase from '../../components/dataEntry/Button/ButtonBase';
import navigation from '../../navigation/navigation';
import ScreenName from '../../navigation/ScreenName';
import Toast from 'react-native-toast-message';
import configToast from '../../components/utils/configToast';
import {useAppTheme} from '../../themes/ThemeContext';
import ModalCenter from '../../components/dataDisplay/Modal/ModalCenter';
import {addCart, fetchCart} from '../../redux/actions/cart/cartAction';
import {fetchProductDetail} from '../../redux/actions/product';
import AddCart from './Product/AddCart';
import {clearProductDetail} from '../../redux/reducers/product';

const FavoriteScreen = () => {
  const theme = useAppTheme();
  const {top} = useSafeAreaInsets();
  const {getTranslation} = useLanguage();

  const [isOpen, setIsOpen] = useState(false);
  const [isOpenAddCart, setIsOpenAddCart] = useState(false);
  const [isOpenCheck, setIsOpenCheck] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null,
  );
  const [proData, setProData] = useState<any>([]);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState('1');

  const dispatch = useAppDispatch();
  const {listFavorite} = useAppSelector(state => state.favorite);
  const {token} = useAppSelector(state => state.auth);
  const {detail} = useAppSelector(state => state.product);

  console.log('FAVORI: ', listFavorite);
  console.log('PROO: ', proData);

  //tạo mảng chứa
  const sizes = [...new Set(proData?.variants?.map((v: any) => v.size) || [])];
  const colorss = [
    ...new Set(proData?.variants?.map((v: any) => v.color) || []),
  ];

  useEffect(() => {
    dispatch(fetchFavorites());
  }, []);
  useEffect(() => {
    // fetch nếu thiếu
    if (!detail || detail._id !== selectedProductId) {
      if (selectedProductId) {
        dispatch(fetchProductDetail(selectedProductId));
      }
    }
  }, [selectedProductId]);

  useEffect(() => {
    if (detail && detail._id === selectedProductId) {
      setProData(detail);
      if (detail.variants?.length) {
        setSelectedSize(detail.variants[0].size);
        setSelectedColor(detail.variants[0].color);
      }
    }
  }, [detail, selectedProductId]);

  const handleDelAllFavorite = () => {
    dispatch(clearFavorites());
    setIsOpenCheck(false);
    Toast.show({
      type: 'notification',
      position: 'top',
      text1: 'Thành công',
      text2: 'Tất cả sản phẩm đã xoá khỏi yêu thích',
      visibilityTime: 1000,
      autoHide: true,
      swipeable: true,
    });
  };

  const handleDelFavorite = () => {
    if (selectedProductId) {
      dispatch(deleteFavorite(selectedProductId));
      Toast.show({
        type: 'notification',
        position: 'top',
        text1: 'Thành công',
        text2: 'Đã xoá sản phẩm khỏi yêu thích',
        visibilityTime: 1000,
        autoHide: true,
        swipeable: true,
      });
      setIsOpen(false);
    }
  };

  const handleAddtoCart = async () => {
    // parse và validate quantity
    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty < 1) {
      Alert.alert('Lỗi', 'Số lượng phải là số nguyên lớn hơn 0');
      return;
    }

    // tìm variant phù hợp
    const variantIndex = proData?.variants?.findIndex(
      (v: any) => v.size === selectedSize && v.color === selectedColor,
    );

    if (variantIndex === -1) {
      Alert.alert('Lỗi', 'Bạn chưa chọn kích thước / màu hợp lệ');
      return;
    }

    const variant = proData.variants[variantIndex];
    if (!variant) {
      Alert.alert('Lỗi', 'Phiên bản sản phẩm không tồn tại');
      return;
    }

    if (variant.quantity < qty) {
      Alert.alert(
        'Thông báo',
        `Tối đa chỉ còn ${variant.quantity} sản phẩm trong kho`,
      );
      return;
    }

    // gọi thêm vào giỏ
    if (!selectedProductId) {
      Alert.alert('Lỗi', 'Không tìm thấy sản phẩm để thêm vào giỏ hàng');
      return;
    }
    await dispatch(
      addCart({
        productId: selectedProductId,
        variantIndex,
        quantity: qty,
      }),
    ).unwrap();

    // nếu cần làm mới giỏ
    await dispatch(fetchCart());

    // thông báo thành công
    setIsOpenAddCart(false);
    Toast.show({
      type: 'notification',
      text1: 'Thành công',
      text2: 'Đã thêm vào giỏ hàng!',
      visibilityTime: 1000,
      autoHide: true,
      swipeable: true,
    });
  };

  const handleClearModal = () => {
    setIsOpenAddCart(false);
    setProData(null);
    setSelectedProductId(null);
    setSelectedSize('');
    setSelectedColor('');
    setQuantity('1');
    dispatch(clearProductDetail());
  };

  return (
    <ContainerView>
      <Header
        visibleLeft
        label={getTranslation('ua_thich')}
        paddingTop={top}
        right={
          <TouchIcon
            size={25}
            icon={IconSRC.icon_delete}
            color={colors.red}
            containerStyle={{marginRight: 8}}
            onPress={() => setIsOpenCheck(true)}
          />
        }
      />
      {!token ? (
        <Block flex1 alignCT justifyCT>
          <Image
            source={IconSRC.icon_search_nolist}
            style={styles.icon_nolist}
          />
          <TextMedium style={{color: theme.text}}>
            Hãy đăng nhập để sử dụng
          </TextMedium>
          <ButtonBase
            containerStyle={styles.btn_mua}
            size={14}
            title={'Đăng nhập'}
            onPress={() => {
              navigation.navigate(ScreenName.Auth.AuthStack, {
                screen: ScreenName.Auth.Login,
                params: {nameScreen: ''},
              });
            }}
          />
        </Block>
      ) : listFavorite.length === 0 ? (
        <Block flex1 alignCT justifyCT>
          <Image
            source={IconSRC.icon_search_nolist}
            style={styles.icon_nolist}
          />
          <TextMedium style={{color: theme.text}}>
            Bạn chưa có sản phẩm yêu thích nào
          </TextMedium>
          <ButtonBase
            containerStyle={styles.btn_mua}
            size={14}
            title={'Mua ngay'}
            onPress={() => {
              navigation.jumpTo(ScreenName.Main.Home);
            }}
          />
        </Block>
      ) : (
        <FlatList
          data={listFavorite}
          keyExtractor={item => item._id + 'acs'}
          renderItem={({item}) => (
            <FavoriteItem
              name={item.name}
              price={item.price}
              image={item.variants?.[0]?.image || ''}
              onPress={() => {}}
              onPressAdd={() => {
                setSelectedProductId(item._id);
                setIsOpenAddCart(true);
              }}
              onPressIcon={() => {
                setSelectedProductId(item._id);
                setIsOpen(true);
              }}
            />
          )}
          contentContainerStyle={{
            paddingBottom: 20,
            marginTop: 10,
            backgroundColor: theme.background,
          }}
          showsVerticalScrollIndicator={false}
        />
      )}

      <ModalBottom
        header
        label={getTranslation('tuy_chon')}
        visible={isOpen}
        animationType="fade"
        onClose={() => setIsOpen(false)}
        heightModal={320}
        children={
          <Block padH={metrics.space}>
            <ButtonOption
              iconLeft={IconSRC.icon_cart1}
              iconRight={null}
              sizeLeft={20}
              containerStyle={{paddingVertical: 25}}
              name={getTranslation('them_vao_gio_hang')}
              onPress={() => {
                setIsOpen(false);
                setIsOpenAddCart(true);
              }}
            />
            <ButtonOption
              iconLeft={IconSRC.icon_delete}
              iconRight={null}
              sizeLeft={20}
              containerStyle={{paddingVertical: 25}}
              name={getTranslation('xoa_yeu_thich')}
              onPress={handleDelFavorite}
            />
          </Block>
        }
      />

      {/* Modal Thêm vào giỏ hàng */}
      <ModalBottom
        visible={isOpenAddCart}
        animationType="fade"
        heightModal={530}
        onClose={() => {
          handleClearModal();
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
            onColse={() => {
              handleClearModal();
            }}
            value={quantity}
            onChangeText={text => setQuantity(text)}
            onPress={handleAddtoCart}
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

      <ModalCenter
        visible={isOpenCheck}
        content={'Bạn có chắc muốn xoá tất cả yêu thích'}
        onClose={() => setIsOpenCheck(false)}
        onPress={() => {
          handleDelAllFavorite();
        }}
      />

      <Toast config={configToast} />
    </ContainerView>
  );
};

export default FavoriteScreen;

const styles = StyleSheet.create({
  icon_nolist: {
    tintColor: colors.gray3,
    marginBottom: 10,
  },
  btn_mua: {
    marginTop: 35,
    width: 160,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boW: {
    borderTopWidth: 0.3,
    borderColor: colors.while,
    paddingVertical: 7,
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
});
