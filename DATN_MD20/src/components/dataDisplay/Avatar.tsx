import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import React from 'react';
import {IconSRC} from '../../constants/icons';
import Block from '../layout/Block';
import {TextMedium, TextSmall} from '../dataEntry/TextBase';
import {colors} from '../../themes/colors';

interface Props {
  title?: string;
  icon?: IconSRC;
  width?: number;
  sizeIcon?: number;
  sizeBtn?: number;
  containerStyle?: ViewStyle;
  backgroundColor?: string;
  onPress?: () => void;
}
const Avatar = (props: Props) => {
  const {
    title,
    icon,
    width,
    sizeIcon = 35,
    sizeBtn = 55,
    containerStyle,
    backgroundColor = colors.gray3,
    onPress,
  } = props;
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={[styles.btn, {width: width}, containerStyle]}
      onPress={onPress}>
      <Block
        alignCT
        justifyCT
        borderRadius={30}
        backgroundColor={backgroundColor}
        marB={3}
        w={sizeBtn}
        height={sizeBtn}>
        <Image
          style={[styles.icon, {width: sizeIcon, height: sizeIcon}]}
          source={icon}
        />
      </Block>
      <TextSmall>{title}</TextSmall>
    </TouchableOpacity>
  );
};

export default Avatar;

const styles = StyleSheet.create({
  btn: {
    // borderRadius: 30,
    // backgroundColor: colors.black,
    alignItems: 'center',
  },
  icon: {
    resizeMode: 'cover',
  },
});
