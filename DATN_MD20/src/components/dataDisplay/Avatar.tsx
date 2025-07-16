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
import {TextSmall} from '../dataEntry/TextBase';
import {useAppTheme} from '../../themes/ThemeContext'; // ✅
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
    backgroundColor,
    onPress,
  } = props;

  const theme = useAppTheme(); // ✅ dùng theme

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={[styles.btn, {width: width}, containerStyle]}
      onPress={onPress}>
      <Block
        alignCT
        justifyCT
        borderRadius={30}
        backgroundColor={backgroundColor ?? theme.card} // ✅ fallback theo theme
        marB={3}
        w={sizeBtn}
        height={sizeBtn}>
        <Image
          style={[styles.icon, {width: sizeIcon, height: sizeIcon}]}
          source={icon}
        />
      </Block>
      <TextSmall>{title}</TextSmall> {/* tự lấy theme.text từ TextSmall */}
    </TouchableOpacity>
  );
};

export default Avatar;

const styles = StyleSheet.create({
  btn: {
    alignItems: 'center',
  },
  icon: {
    resizeMode: 'cover',
  },
});
