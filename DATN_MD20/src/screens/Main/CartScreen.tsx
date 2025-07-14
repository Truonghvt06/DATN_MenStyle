import {
  FlatList,
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import React, {useState} from 'react';
import ContainerView from '../../components/layout/ContainerView';
import Header from '../../components/dataDisplay/Header';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ButtonBase from '../../components/dataEntry/Button/ButtonBase';
import Block from '../../components/layout/Block';
import metrics from '../../constants/metrics';
import {
  TextMedium,
  TextSizeCustom,
} from '../../components/dataEntry/TextBase';
import {dataProduct} from '../../constants/data';
import CartItem from '../../components/dataDisplay/CartItem';
import {IconSRC} from '../../constants/icons';
import useLanguage from '../../hooks/useLanguage';
import {useAppTheme} from '../../themes/ThemeContext';

const CartScreen = () => {
  const {top} = useSafeAreaInsets();
  const {getTranslation} = useLanguage();
  const theme = useAppTheme();

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
      <ContainerView
        containerStyle={{
          backgroundColor: theme.background,
          paddingTop: top,
        }}>
        <Header
          visibleLeft
          label={getTranslation('gio_hang')}
          paddingTop={top}
          backgroundColor={theme.background}
          textColor={theme.text}
        />
        <FlatList
          data={cartData}
          keyExtractor={(item, index) => item.id + ''}
          renderItem={({item}) => (
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
          )}
          contentContainerStyle={{paddingBottom: 100}}
        />

        <Block
          w100
          padV={5}
          padH={metrics.space}
          backgroundColor={theme.background} // ✅ nền theo theme
          borderBottomW={0.6}
          borderColor={theme.text}          // ✅ viền theo theme
          positionA
          bottom0>
          <Block row justifyBW marB={10} alignCT>
            <TextMedium style={{color: theme.text}}>
              {getTranslation('tong_cong')}:
            </TextMedium>
            <TextSizeCustom size={20} bold color="red">
              200.000đ
            </TextSizeCustom>
          </Block>
          <ButtonBase title={getTranslation('thanh_toan')} onPress={() => {}} />
        </Block>
      </ContainerView>
    </TouchableWithoutFeedback>
  );
};

export default CartScreen;

const styles = StyleSheet.create({});
