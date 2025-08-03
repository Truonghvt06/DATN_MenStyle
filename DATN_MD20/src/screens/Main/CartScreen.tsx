import {
  FlatList,
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import React, {useState} from 'react';
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
import {fetchCart, removeFromCart, updateCart} from '../../redux/actions/cart';

const CartScreen = () => {
  const {top} = useSafeAreaInsets();
  const theme = useAppTheme();
  const {getTranslation} = useLanguage();

  const {user} = useAppSelector(state => state.auth);
  const {items: cartData, loading} = useAppSelector(state => state.cart);
  const dispatch = useAppDispatch();

  // const listCart = [...cartData].sort(
  //   (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  // );

  // State quản lý checkbox
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [isOpenCheck, setIsOpenCheck] = useState(false);

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
        cartData.map((_: any, index: number) => index),
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
    if (newSelectedItems.size === cartData.length) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
  };

  // Hàm xóa tất cả sản phẩm đã chọn
  const handleDeleteSelected = async () => {
    if (selectedItems.size === 0) return;
    setIsOpenCheck(false);

    try {
      // Xóa từng sản phẩm đã chọn theo thứ tự ngược lại để tránh lỗi index
      const sortedIndices = Array.from(selectedItems).sort((a, b) => b - a);

      for (const index of sortedIndices) {
        if (!user?._id) return;
        await dispatch(removeFromCart({userId: user._id, index}));
      }

      // Fetch lại cart sau khi xóa
      if (user?._id) {
        await dispatch(fetchCart(user._id));
      }

      // Reset state
      setSelectedItems(new Set());
      setSelectAll(false);

      // console.log(`Đã xóa ${selectedItems.size} sản phẩm khỏi giỏ hàng`);
    } catch (error) {
      console.error('Lỗi khi xóa sản phẩm:', error);
      Alert.alert('Lỗi', 'Không thể xóa sản phẩm. Vui lòng thử lại.');
    }
  };

  React.useEffect(() => {
    if (user?._id) {
      dispatch(fetchCart(user._id));
    }
  }, [user?._id, dispatch]);

  // Reset checkbox state khi cartData thay đổi
  React.useEffect(() => {
    setSelectedItems(new Set());
    setSelectAll(false);
  }, [cartData.length]);

  const handleChangeQuantity = (index: number, value: string) => {
    // Gọi API cập nhật số lượng
    if (!user?._id) return;
    const action =
      parseInt(value) > parseInt(cartData[index].quantity)
        ? `increase-${index}`
        : `decrease-${index}`;
    dispatch(updateCart({userId: user._id, action})).then(() => {
      dispatch(fetchCart(user._id));
    });
  };

  const handleToggleCheck = (index: number) => {
    // Tuỳ ý, nếu muốn chọn sản phẩm để thanh toán
  };

  const handleDelete = (index: number) => {
    if (!user?._id) return;
    dispatch(removeFromCart({userId: user._id, index})).then(() => {
      dispatch(fetchCart(user._id));
    });
  };

  // Hàm tính tổng tiền chỉ cho các sản phẩm đã chọn
  const totalPrice = cartData.reduce(
    (sum: number, item: any, index: number) => {
      if (selectedItems.has(index)) {
        return (
          sum + parseInt(item.quantity || '1') * (item.productId?.price || 0)
        );
      }
      return sum;
    },
    0,
  );

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
        {cartData.length > 0 && (
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
                Chọn tất cả ({selectedItems.size}/{cartData.length})
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
          data={cartData}
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
                  cartData: cartData,
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
