import {
  FlatList,
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import ContainerView from '../../components/layout/ContainerView';
import Header from '../../components/dataDisplay/Header';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ButtonBase from '../../components/dataEntry/Button/ButtonBase';
import Block from '../../components/layout/Block';
import metrics from '../../constants/metrics';
import {TextMedium, TextSizeCustom} from '../../components/dataEntry/TextBase';
import {dataProduct} from '../../constants/data';
import CartItem from '../../components/dataDisplay/CartItem';
import {IconSRC} from '../../constants/icons';
import useLanguage from '../../hooks/useLanguage';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {TextSmall} from '../../components/dataEntry/TextBase';
import TouchIcon from '../../components/dataEntry/Button/TouchIcon';
import {colors} from '../../themes/colors';
import navigation from '../../navigation/navigation';
import ScreenName from '../../navigation/ScreenName';
import {useAppTheme} from '../../themes/ThemeContext';
import ModalCenter from '../../components/dataDisplay/Modal/ModalCenter';
import {
  fetchCart,
  removeCart,
  updateCart,
} from '../../redux/actions/cart/cartAction';
// import {fetchCart, removeFromCart, updateCart} from '../../redux/actions/cart';

const CartScreen = () => {
  const {top} = useSafeAreaInsets();
  const theme = useAppTheme();
  const {getTranslation} = useLanguage();

  const dispatch = useAppDispatch();
  const {user} = useAppSelector(state => state.auth);
  const {listCart, loading} = useAppSelector(state => state.cartt);

  // const listCart = [...cartData].sort(
  //   (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  // );
  console.log('CART: ', listCart);

  // State quản lý checkbox
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [isOpenCheck, setIsOpenCheck] = useState(false);

  useEffect(() => {
    if (user?._id) {
      dispatch(fetchCart());
    }
  }, [dispatch, user?._id]);

  // Reset checkbox state khi listCart thay đổi
  useEffect(() => {
    setSelectedItems(new Set());
    setSelectAll(false);
  }, [listCart.length]);

  // Hàm làm sạch URL ảnh
  const cleanImageUrl = (url: string) => {
    if (!url) return '';
    // Loại bỏ các tham số query có thể gây lỗi
    return url.split('?')[0];
  };

  // Hàm xử lý chọn/bỏ chọn tất cả
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems(new Set());
      setSelectAll(false);
    } else {
      const allIndices = new Set(
        listCart.map((_: any, index: number) => index),
      );
      setSelectedItems(allIndices as Set<number>);
      setSelectAll(true);
    }
  };

  // Hàm xử lý chọn/bỏ chọn từng sản phẩm
  const handleToggleItem = (index: number) => {
    const newSelectedItems = new Set(selectedItems);
    if (newSelectedItems.has(index)) {
      newSelectedItems.delete(index);
    } else {
      newSelectedItems.add(index);
    }
    setSelectedItems(newSelectedItems);

    // Cập nhật trạng thái "chọn tất cả"
    if (newSelectedItems.size === listCart.length) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
  };

  //Xoá từng item
  const handleDelete = async (index: number) => {
    if (!user?._id) return;
    const item = listCart[index];
    if (!item) return;

    try {
      await dispatch(
        removeCart([
          {
            productId: item.productId._id || item.productId, // tùy structure
            variantIndex: item.variantIndex,
          },
        ]),
      ).unwrap();
      await dispatch(fetchCart());
    } catch (err) {
      console.warn('Xóa thất bại', err);
      Alert.alert('Lỗi', 'Không thể xóa sản phẩm. Thử lại sau.');
    }
  };

  // Xóa nhiều item đã chọn
  const handleDeleteSelected = async () => {
    if (selectedItems.size === 0) return;
    if (!user?._id) {
      setIsOpenCheck(true);
      return;
    }

    try {
      const itemsToRemove = Array.from(selectedItems).map(idx => {
        const it = listCart[idx];
        return {
          productId: it.productId._id || it.productId,
          variantIndex: it.variantIndex,
        };
      });

      await dispatch(removeCart(itemsToRemove)).unwrap();
      setIsOpenCheck(false);
      await dispatch(fetchCart());
      setSelectedItems(new Set());
      setSelectAll(false);
    } catch (error) {
      console.error('Lỗi khi xóa nhiều:', error);
      Alert.alert('Lỗi', 'Xóa thất bại. Vui lòng thử lại.');
    }
  };

  // Cập nhật số lượng
  const handleChangeQuantity = async (index: number, value: string) => {
    if (!user?._id) return;
    const parsed = parseInt(value, 10);
    if (isNaN(parsed) || parsed < 1) return; // hoặc hiển thị lỗi nhỏ

    const item = listCart[index];
    if (!item) return;

    const variant = item.productId?.variants?.[item.variantIndex];
    if (!variant) return;

    if (parsed > variant.quantity) {
      Alert.alert(
        'Thông báo',
        `Tối đa chỉ còn ${variant.quantity} sản phẩm trong kho`,
      );
      return;
    }

    // nếu số lượng không đổi thì bỏ
    if (item.quantity === parsed) return;

    try {
      await dispatch(
        updateCart({
          productId: item.productId._id || item.productId,
          variantIndex: item.variantIndex,
          quantity: parsed,
        }),
      ).unwrap();
      await dispatch(fetchCart());
    } catch (err) {
      console.warn('Cập nhật số lượng thất bại', err);
      Alert.alert('Lỗi', 'Không thể cập nhật số lượng. Thử lại sau.');
    }
  };

  // Hàm tính tổng tiền chỉ cho các sản phẩm đã chọn
  const totalPrice = useMemo(() => {
    return listCart.reduce((sum: number, item: any, index: number) => {
      if (selectedItems.has(index)) {
        return sum + item.quantity * (item.productId?.price || 0);
      }
      return sum;
    }, 0);
  }, [listCart, selectedItems]);

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <ContainerView style={{flex: 1, backgroundColor: theme.background}}>
        <Header
          visibleLeft
          label={getTranslation('gio_hang')}
          paddingTop={top}
        />
        <ModalCenter
          visible={isOpenCheck}
          content={`Bạn có chắc chắn muốn xóa ${selectedItems.size} sản phẩm đã chọn khỏi giỏ hàng?`}
          onClose={() => setIsOpenCheck(false)}
          onPress={() => {
            handleDeleteSelected();
          }}
        />

        {/* Header với checkbox "Chọn tất cả" */}
        {listCart.length > 0 && (
          <Block
            row
            alignCT
            justifyBW
            padH={metrics.space}
            h={50}
            backgroundColor={theme.background}
            borderBottomW={0.5}>
            <Block row alignCT>
              <TouchIcon
                icon={selectAll ? IconSRC.icon_check : IconSRC.icon_uncheck}
                size={20}
                onPress={handleSelectAll}
              />
              <TextSmall color={theme.text} style={{marginLeft: 10}}>
                Chọn tất cả ({selectedItems.size}/{listCart.length})
              </TextSmall>
            </Block>
            {selectedItems.size > 0 && (
              <TouchIcon
                icon={IconSRC.icon_delete}
                size={18}
                onPress={() => setIsOpenCheck(true)}
                containerStyle={{
                  backgroundColor: colors.red,
                  padding: 5,
                  borderRadius: 6,
                }}
              />
            )}
          </Block>
        )}

        <FlatList
          data={listCart}
          keyExtractor={(item, index) => item.productId?._id + '-' + index}
          renderItem={({item, index}) => {
            const imageUrl = cleanImageUrl(
              item.productId?.variants?.[item.variantIndex]?.image ||
                item.productId?.image,
            );
            const isSelected = selectedItems.has(index);
            return (
              <CartItem
                icon={isSelected ? IconSRC.icon_check : IconSRC.icon_uncheck}
                name={item.productId?.name}
                image={{uri: imageUrl}}
                price={item.productId?.price}
                color={item.productId?.variants?.[item.variantIndex]?.color}
                size={item.productId?.variants?.[item.variantIndex]?.size}
                containerStyle={{paddingHorizontal: metrics.space}}
                value={item.quantity + ''}
                onChangeText={text => handleChangeQuantity(index, text)}
                onPress={() => {}}
                onPressDelete={() => handleDelete(index)}
                onPressCheck={() => handleToggleItem(index)}
              />
            );
          }}
          contentContainerStyle={{
            paddingBottom: 100,
            backgroundColor: theme.background,
          }}
        />

        <Block
          w100
          padV={5}
          padH={metrics.space}
          backgroundColor={theme.background}
          borderBottomW={0.6}
          borderColor={'#444'}
          positionA
          bottom0>
          <Block row justifyBW marB={10} alignCT>
            <TextMedium style={{color: theme.text}}>
              {getTranslation('tong_cong')}:
            </TextMedium>
            <TextSizeCustom size={20} bold style={{color: theme.text}}>
              {totalPrice.toLocaleString('vi-VN')}đ
            </TextSizeCustom>
          </Block>
          {selectedItems.size > 0 && (
            <TextSmall color={theme.gray} style={{marginBottom: 5}}>
              Đã chọn {selectedItems.size} sản phẩm
            </TextSmall>
          )}
          <ButtonBase
            title={
              selectedItems.size > 0
                ? `${getTranslation('thanh_toan')} (${selectedItems.size})`
                : getTranslation('thanh_toan')
            }
            onPress={() => {
              if (selectedItems.size === 0) {
                // Hiển thị thông báo yêu cầu chọn sản phẩm
                console.log('Vui lòng chọn ít nhất 1 sản phẩm để thanh toán');
              } else {
                // Navigate đến màn hình thanh toán
                navigation.navigate(ScreenName.Main.Checkout, {
                  selectedItems: Array.from(selectedItems),
                  listCart: listCart,
                });
              }
            }}
            disabled={selectedItems.size === 0}
          />
        </Block>
      </ContainerView>
    </TouchableWithoutFeedback>
  );
};

export default CartScreen;

const styles = StyleSheet.create({});
