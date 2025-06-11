import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import React from 'react';
import {colors} from '../../themes/colors';
import metrics from '../../constants/metrics';
import Block from '../layout/Block';
import {IconSRC} from '../../constants/icons';
import {TextSizeCustom} from '../dataEntry/TextBase';
import navigation from '../../navigation/navigation';

interface Props {
  label?: string;
  left?: React.ReactElement;
  right?: React.ReactElement;
  paddingTop?: number;
  visibleLeft?: boolean;
  styleLeft?: ViewStyle;
  containerStyle?: ViewStyle;
  labelColor?: string;
  iconColor?: string;
  onPressLeft?: () => void;
}
const Header = (props: Props) => {
  const {
    label,
    left,
    right,
    paddingTop = 0,
    onPressLeft,
    visibleLeft,
    styleLeft,
    containerStyle,
    labelColor = colors.while,
    iconColor,
  } = props;

  return (
    <View
      {...props}
      style={[
        {
          backgroundColor: colors.while,
          height: paddingTop + 50,
          width: metrics.diviceScreenWidth,
          paddingTop: paddingTop,
          //   paddingBottom: metrics.space * 2,
          ...containerStyle,
        },
        styles.shadow,
      ]}>
      <Block flex1 row justifyBW padH={7}>
        {!visibleLeft && (
          <TouchableOpacity
            style={[styles.btnLeft, styleLeft]}
            onPress={onPressLeft || navigation.goBack}>
            <Image
              style={[styles.image, {tintColor: iconColor || colors.while}]}
              source={IconSRC.icon_back_left}
            />
          </TouchableOpacity>
        )}
        <TextSizeCustom
          bold
          size={22}
          color={colors.black}
          style={{textTransform: 'capitalize', color: labelColor}}>
          {label}
        </TextSizeCustom>
        {right ?? <Text style={{width: 40}}></Text>}
      </Block>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  shadow: {
    shadowColor: 'grey',
    // borderRadius: 10,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
  },
  image: {
    width: 24,
    height: 24,
  },
  btnLeft: {
    height: 40,
    width: 40,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.green,
  },
});
