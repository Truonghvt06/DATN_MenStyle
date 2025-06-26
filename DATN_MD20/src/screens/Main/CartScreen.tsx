import {
  FlatList,
  Keyboard,
  TouchableWithoutFeedback,
  StyleSheet,
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
import {dataProduct} from '../../constants/data';
import CartItem from '../../components/dataDisplay/CartItem';
import {IconSRC} from '../../constants/icons';
import {useAppTheme} from '../../themes/ThemeContext';

const CartScreen = () => {
  const theme = useAppTheme();
  const {top} = useSafeAreaInsets();
  const [check, setCheck] = useState(false);
  const [cartData, setCartData] = useState<any>(dataProduct);

  const handleChangeQuantity = (id: number, value: string) => {
    setCartData((prev: any) =>
      prev.map((item: any) =>
        item.id === id ? {...item, quantity: value} : item,
      ),
    );
  };
  const handleToggleCheck = (id: number) => {
    setCartData((prev: any) =>
      prev.map((item: any) =>
        item.id === id ? {...item, checked: !item.checked} : item,
      ),
    );
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <ContainerView style={{backgroundColor: theme.background}}>
        <Header
          visibleLeft
          label="Giỏ hàng"
          paddingTop={top - 10}
          containerStyle={{
            height: top + 35,
            backgroundColor: theme.background,
          }}
          labelStyle={{color: theme.text}}
        />
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
                  backgroundColor: theme.background,
                }}
                value={item.quantity}
                onChangeText={text => handleChangeQuantity(item.id, text)}
                onPress={() => {}}
                onPressDelete={() => {}}
                onPressCheck={() => {
                  handleToggleCheck(item.id);
                }}
                textColor={theme.text}
              />
            );
          }}
          contentContainerStyle={{paddingBottom: 100}}
        />
        <Block
          w100
          padV={5}
          padH={metrics.space}
          backgroundColor={theme.background}
          borderBottomW={0.6}
          borderColor={colors.gray3}
          positionA
          bottom0>
          <Block row justifyBW marB={10} alignCT>
            <TextMedium style={{color: theme.text}}>Tổng cộng:</TextMedium>
            <TextSizeCustom size={20} bold style={{color: theme.text}}>
              200.000đ
            </TextSizeCustom>
          </Block>
          <ButtonBase title="Thanh toán" onPress={() => {}} />
        </Block>
      </ContainerView>
    </TouchableWithoutFeedback>
  );
};

export default CartScreen;

const styles = StyleSheet.create({});
