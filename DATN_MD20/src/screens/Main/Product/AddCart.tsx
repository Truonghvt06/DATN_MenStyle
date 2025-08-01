import React, {useRef} from 'react';
import {Image, ScrollView, StyleSheet, TextInput, View} from 'react-native';
import metrics from '../../../constants/metrics';
import Block from '../../../components/layout/Block';
import {TextHeight, TextSmall} from '../../../components/dataEntry/TextBase';
import {IconSRC} from '../../../constants/icons';
import TouchIcon from '../../../components/dataEntry/Button/TouchIcon';
import ButtonBase from '../../../components/dataEntry/Button/ButtonBase';
import {useAppTheme} from '../../../themes/ThemeContext';
import useLanguage from '../../../hooks/useLanguage';
import {colors} from '../../../themes/colors';

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
  const theme = useAppTheme();
  const {getTranslation} = useLanguage();
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
    const newValue = Math.max(1, parseInt(value || '1') - 1);
    onChangeText?.(String(newValue));
    inputRef.current?.blur();
  };

  const handleCong = () => {
    const newValue = parseInt(value || '1') + 1;
    onChangeText?.(String(newValue));
    inputRef.current?.blur();
  };

  return (
    <View style={[styles.container, {backgroundColor: theme.background_modal}]}>
      <Block
        row
        containerStyle={[styles.boW, {borderColor: theme.border_color}]}>
        <Image style={styles.img} source={{uri: image}} />
        <Block flex1 marL={10} justifyContent="flex-end">
          <TextHeight medium color={colors.primary}>
            {price}đ
          </TextHeight>
          <TextSmall color={theme.text}>
            {getTranslation('kho')}: {quantity_kho}
          </TextSmall>
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
        <Block
          row
          alignCT
          justifyBW
          containerStyle={[styles.boW1, {borderColor: theme.border_color}]}>
          <TextSmall color={theme.text}>{getTranslation('so_luong')}</TextSmall>
          <Block
            row
            borderWidth={0.5}
            borderRadius={20}
            justifyBW
            width={95}
            height={30}
            marT={5}
            alignCT
            borderColor={theme.border_color}>
            <TouchIcon
              title="-"
              containerStyle={{flex: 1, alignItems: 'center'}}
              onPress={handleTru}
            />
            <TextInput
              ref={inputRef}
              value={value}
              onChangeText={onChangeText}
              style={{
                flex: 1.5,
                textAlign: 'center',
                height: 50,
                color: theme.text,
                paddingVertical: 0,
              }}
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
  },
  img: {
    width: 100,
    height: 120,
    borderRadius: 7,
  },
  boW: {
    borderBottomWidth: 0.3,
    paddingBottom: 16,
  },
  boW1: {
    borderTopWidth: 0.3,
    paddingVertical: 7,
  },
});
