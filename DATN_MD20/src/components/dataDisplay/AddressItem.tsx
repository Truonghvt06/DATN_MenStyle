import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import Block from '../layout/Block';
import {TextMedium, TextSizeCustom, TextSmall} from '../dataEntry/TextBase';
import {colors} from '../../themes/colors';
import TouchIcon from '../dataEntry/Button/TouchIcon';
import {IconSRC} from '../../constants/icons';

interface Props {
  name?: string;
  phone?: string;
  address_line?: string;
  address_detail?: string;
  isDefault?: boolean;
  onPress?: () => void;
}
const AddressItem = (props: Props) => {
  const {
    name,
    phone,
    address_line,
    address_detail,
    isDefault = false,
    onPress,
  } = props;
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
      <Block padV={20} borderBottomW={0.3} borderColor={colors.gray3}>
        <Block row alignCT marB={5}>
          <TextMedium medium>{name}</TextMedium>
          <Block w={1} h={'60%'} backgroundColor={colors.gray} marH={10} />
          <TextMedium color={colors.gray}>{phone}</TextMedium>
        </Block>
        <TextSizeCustom size={13} color={colors.gray}>
          {address_line}
        </TextSizeCustom>
        <TextSizeCustom size={13} color={colors.gray}>
          {address_detail}
        </TextSizeCustom>
        {isDefault && (
          <TouchIcon
            icon={IconSRC.icon_check}
            size={20}
            containerStyle={styles.is_default}
          />
        )}
      </Block>
    </TouchableOpacity>
  );
};

export default AddressItem;

const styles = StyleSheet.create({
  is_default: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    padding: 5,
    alignSelf: 'center',
    justifyContent: 'center',
  },
});
