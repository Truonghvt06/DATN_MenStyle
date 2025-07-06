import {
  FlatList,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, {useState} from 'react';
import ContainerView from '../../components/layout/ContainerView';
import Header from '../../components/dataDisplay/Header';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ButtonBase from '../../components/dataEntry/Button/ButtonBase';
import Block from '../../components/layout/Block';
import metrics from '../../constants/metrics';
import {colors} from '../../themes/colors';
import {
  TextHeight,
  TextMedium,
  TextSizeCustom,
  TextSmall,
} from '../../components/dataEntry/TextBase';
import {cartProduct, dataProduct} from '../../constants/data';
import CartItem from '../../components/dataDisplay/CartItem';
import {IconSRC} from '../../constants/icons';
import useLanguage from '../../hooks/useLanguage';
import { Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const CartScreen = () => {
  const navigation = useNavigation();
  const {top} = useSafeAreaInsets();
  const {getTranslation} = useLanguage();
  const [cartData, setCartData] = useState<any>(cartProduct);

  // Tính tổng tiền các sản phẩm đã chọn
  const getTotal = () => {
    return cartData
      .filter((item: any) => item.checked)
      .reduce((sum: number, item: any) => sum + Number(item.price) * Number(item.quantity), 0);
  };

  // Thay đổi số lượng sản phẩm
  const handleChangeQuantity = (id: number, value: string) => {
    setCartData((prev: any) =>
      prev.map((item: any) =>
        item.id === id ? {...item, quantity: value} : item,
      ),
    );
  };

  // Chọn/bỏ chọn sản phẩm
  const handleToggleCheck = (id: number) => {
    setCartData((prev: any) =>
      prev.map((item: any) =>
        item.id === id ? {...item, checked: !item.checked} : item,
      ),
    );
  };

  // Xóa sản phẩm khỏi giỏ hàng
  const handleDeleteItem = (id: number) => {
    setCartData((prev: any) => prev.filter((item: any) => item.id !== id));
  };

  // Chọn/bỏ chọn tất cả sản phẩm
  const handleToggleAll = () => {
    const isAllChecked = cartData.every((item: any) => item.checked);
    setCartData((prev: any) =>
      prev.map((item: any) => ({...item, checked: !isAllChecked})),
    );
  };

  // Xử lý thanh toán
  const handleCheckout = () => {
    const selectedItems = cartData.filter((item: any) => item.checked);
    if (selectedItems.length === 0) {
      alert(getTranslation('Vui lòng chọn sản phẩm thanh toán'));
      return;
    }
    // Chuyển sang màn Payment và truyền danh sách sản phẩm đã chọn
    navigation.navigate('PaymentScreen', { items: selectedItems });
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <ContainerView>
        <Header
          visibleLeft
          label={getTranslation('gio_hang')}
          paddingTop={top}
        />
        {/* Nút chọn tất cả dạng checkbox */}
        <Block row alignCT padH={metrics.space} marB={10}>
          <TouchableOpacity onPress={handleToggleAll} style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image
              source={cartData.length > 0 && cartData.every((item: any) => item.checked) ? IconSRC.icon_check : IconSRC.icon_uncheck}
              style={{width: 24, height: 24, marginRight: 8}}
              resizeMode="contain"
            />
            <TextMedium>
              {cartData.every((item: any) => item.checked) ? getTranslation('') : getTranslation('')}
            </TextMedium>
          </TouchableOpacity>
        </Block>
        <FlatList
          data={cartData}
          keyExtractor={(item, index) => item.id + ''}
          renderItem={({item}) => {
            return (
              <CartItem
                icon={item.checked ? IconSRC.icon_check : IconSRC.icon_uncheck}
                name={item.name}
                image={item.image}
                price={item.price}
                color={item.color}
                size={item.size}
                containerStyle={{
                  paddingHorizontal: metrics.space,
                }}
                value={item.quantity}
                onChangeText={text => handleChangeQuantity(item.id, text)}
                onPress={() => {}}
                onPressDelete={() => handleDeleteItem(item.id)}
                onPressCheck={() => {
                  handleToggleCheck(item.id);
                }}
              />
            );
          }}
          contentContainerStyle={{paddingBottom: 100}}
        />
        <Block
          w100
          padV={5}
          padH={metrics.space}
          backgroundColor={colors.while}
          borderBottomW={0.6}
          borderColor={colors.gray3}
          positionA
          bottom0>
          <Block row justifyBW marB={10} alignCT>
            <TextMedium>{getTranslation('tong_cong')}:</TextMedium>
            <TextSizeCustom size={20} bold color={colors.red}>
              {getTotal().toLocaleString('vi-VN')}đ
            </TextSizeCustom>
          </Block>
          <ButtonBase title={getTranslation('thanh_toan')} onPress={handleCheckout} />
        </Block>
      </ContainerView>
    </TouchableWithoutFeedback>
  );
};

export default CartScreen;

const styles = StyleSheet.create({});
