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
import {dataProduct} from '../../constants/data';
import CartItem from '../../components/dataDisplay/CartItem';
import {IconSRC} from '../../constants/icons';

const CartScreen = () => {
  const {top} = useSafeAreaInsets();
  const [check, setCheck] = useState(false);
  // const [value, setValue] = useState('1');
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
      <ContainerView>
        <Header
          visibleLeft
          label="Giỏ hàng"
          paddingTop={top - 10}
          containerStyle={{
            height: top + 35,
          }}
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
                }}
                value={item.quantity}
                onChangeText={text => handleChangeQuantity(item.id, text)}
                onPress={() => {}}
                onPressDelete={() => {}}
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
            <TextMedium>Tổng cộng:</TextMedium>
            <TextSizeCustom size={20} bold color={colors.red}>
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
