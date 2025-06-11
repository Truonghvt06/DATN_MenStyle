import {
  Image,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from 'react-native';
import React, {useRef} from 'react';
import Block from '../layout/Block';
import {IconSRC} from '../../constants/icons';
import TouchIcon from '../dataEntry/Button/TouchIcon';
import {TextMedium, TextSizeCustom, TextSmall} from '../dataEntry/TextBase';
import {colors} from '../../themes/colors';

interface Props {
  name?: string;
  image?: any;
  size?: string;
  price?: number;
  color?: string;
  icon?: any;
  quantity?: number;
  containerStyle?: ViewStyle;
  value?: string;
  onChangeText?: (text: any) => void;
  onPress?: () => void;
  onPressDelete?: () => void;
  onPressCheck?: () => void;
}
const CartItem = (props: Props) => {
  const inputRef = useRef<TextInput>(null);

  const {
    name,
    image,
    size,
    color,
    price,
    icon,
    quantity = 0,
    containerStyle,
    value = '1',
    onChangeText,
    onPress,
    onPressDelete,
    onPressCheck,
  } = props;

  const handleTru = () => {
    const newValue = Math.max(1, parseInt(value || '1') - 1); //So sánh value với 1 Math.max(1,..): lấy kq lớn hơn
    onChangeText?.(String(newValue));
    inputRef.current?.blur(); // Ẩn con trỏ
  };

  const handleCong = () => {
    const newValue = parseInt(value || '1') + 1;
    onChangeText?.(String(newValue));
    inputRef.current?.blur(); // Ẩn con trỏ
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={1}
        style={[styles.container, containerStyle]}>
        <TouchIcon
          icon={icon}
          size={20}
          containerStyle={styles.check}
          onPress={onPressCheck}
        />
        <Image style={styles.img} source={image} />
        <Block flex1 padR={10}>
          <TextMedium numberOfLines={2} ellipsizeMode="tail">
            {name}
          </TextMedium>
          <Block row>
            <TextSizeCustom size={12} color={colors.gray}>
              Size: {size} |{' '}
            </TextSizeCustom>
            <TextSizeCustom size={12} color={colors.gray}>
              Màu: {color}
            </TextSizeCustom>
          </Block>
          <Block
            row
            borderWidth={0.5}
            borderRadius={20}
            justifyBW
            width={85}
            height={26}
            marT={5}
            alignCT>
            <TouchIcon
              title="-"
              containerStyle={{flex: 1, alignItems: 'center'}}
              onPress={handleTru}
            />
            <TextInput
              ref={inputRef}
              value={value}
              onChangeText={onChangeText}
              style={{flex: 1.5, textAlign: 'center'}}
              keyboardType="numeric"
            />
            <TouchIcon
              title="+"
              containerStyle={{flex: 1, alignItems: 'center'}}
              onPress={handleCong}
            />
          </Block>
          <Block row flex1 alignItems="flex-end" justifyBW marT={5}>
            <TouchableOpacity
              style={styles.btndel}
              activeOpacity={0.7}
              onPress={onPressDelete}>
              <Image style={styles.delete} source={IconSRC.icon_delete} />
              <TextSmall
                style={{textDecorationLine: 'underline'}}
                color={colors.red}>
                Xoá
              </TextSmall>
            </TouchableOpacity>
            <TextMedium bold>{price}đ</TextMedium>
          </Block>
        </Block>
      </TouchableOpacity>
    </TouchableWithoutFeedback>
  );
};

export default CartItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 20,
    borderBottomWidth: 0.5,
    borderColor: colors.gray3,
  },
  img: {
    width: 80,
    height: 100,
    borderRadius: 7,
    marginHorizontal: 10,
  },
  delete: {
    width: 18,
    height: 18,
    marginRight: 2,
    tintColor: colors.red,
  },
  check: {
    justifyContent: 'center',
  },
  btndel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
