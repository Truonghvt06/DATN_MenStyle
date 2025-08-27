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
import {useAppTheme} from '../../themes/ThemeContext';

interface Props {
  title?: string;
  icon?: string | any;
  width?: number;
  sizeIcon?: number;
  sizeBtn?: number;
  containerStyle?: ViewStyle;
  backgroundColor?: string;
  onPress?: () => void;
}
const Avatar = (props: Props) => {
  const theme = useAppTheme();
  const {
    title,
    icon = IconSRC.icon_polo,
    width,
    sizeIcon = 35,
    sizeBtn = 55,
    containerStyle,
    backgroundColor = theme.background_cate,
    onPress,
  } = props;
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={[styles.btn, {width: width}, containerStyle]}
      onPress={onPress}>
      {/* <Block
        alignCT
        justifyCT
        borderRadius={30}
        backgroundColor={backgroundColor}
        marB={3}
        w={sizeBtn}
        height={sizeBtn}> */}
      <View style={[styles.shadow, {shadowColor: theme.shadow_color}]}>
        <View>
          <Image
            style={[styles.icon, {width: 65, height: 65, borderRadius: 20}]}
            source={icon ? {uri: icon} : IconSRC.icon_polo}
          />
        </View>
      </View>
      {/* </Block> */}
      <TextSmall>{title}</TextSmall>
    </TouchableOpacity>
  );
};

export default Avatar;

const styles = StyleSheet.create({
  shadow: {
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
    borderRadius: 20,
    marginBottom: 5,
  },
  btn: {
    // borderRadius: 30,
    // backgroundColor: colors.black,
    alignItems: 'center',
  },
  icon: {
    resizeMode: 'cover',
  },
});
