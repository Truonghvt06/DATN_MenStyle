import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, {useRef, useState} from 'react';
import metrics from '../../../constants/metrics';
import Block from '../../../components/layout/Block';
import {
  TextHeight,
  TextMedium,
  TextSmall,
} from '../../../components/dataEntry/TextBase';
import {IconSRC} from '../../../constants/icons';
import {colors} from '../../../themes/colors';
import TouchIcon from '../../../components/dataEntry/Button/TouchIcon';
import ButtonBase from '../../../components/dataEntry/Button/ButtonBase';

interface Props {
  image?: any;
  price?: number;
  quantity_kho?: number;
  size?: React.ReactNode;
  color?: React.ReactNode;
  value?: string;
  onChangeText?: (text: any) => void;
  onPress?: () => void;
  onColse?: () => void;
}
const AddCart = (props: Props) => {
  const {
    image,
    price,
    quantity_kho,
    size,
    color,
    value = '1',
    onChangeText,
    onPress,
    onColse,
  } = props;
  const inputRef = useRef<TextInput>(null);

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
    <View style={styles.container}>
      <Block row containerStyle={styles.boW}>
        <Image style={styles.img} source={image} />
        <Block flex1 marL={10} justifyContent="flex-end">
          <TextHeight medium color={colors.red}>
            {price}đ
          </TextHeight>
          <TextSmall color={colors.gray}>Kho:{quantity_kho}</TextSmall>
        </Block>
        <TouchIcon
          size={15}
          icon={IconSRC.icon_close}
          containerStyle={{margin: 7}}
          onPress={onColse}
        />
      </Block>
      <ScrollView>
        {color && color}
        {size && size}
        <Block row alignCT justifyBW containerStyle={styles.boW1}>
          <TextSmall>Số lượng</TextSmall>
          <Block
            row
            borderWidth={0.5}
            borderRadius={20}
            justifyBW
            width={95}
            height={30}
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
        </Block>
      </ScrollView>
      <Block flex1 justifyContent="flex-end" marB={40}>
        <ButtonBase size={14} title="Thêm vào giỏ hàng" onPress={onPress} />
      </Block>
    </View>
  );
};

export default AddCart;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: metrics.space,
    backgroundColor: colors.gray1,
  },
  img: {
    width: 100,
    height: 120,
    borderRadius: 7,
  },
  size: {
    width: 50,
    height: 35,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 7,
    marginBottom: 20,
  },
  boW: {
    borderBottomWidth: 0.3,
    borderColor: colors.while,
    paddingBottom: 16,
  },
  boW1: {
    borderTopWidth: 0.3,
    borderColor: colors.while,
    paddingVertical: 7,
  },
  btn: {
    width: '100%',
    position: 'absolute',
    bottom: 30,
  },
});
