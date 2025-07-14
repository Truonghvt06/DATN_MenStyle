import {
  Image,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle,
} from 'react-native';
import React from 'react';
import {TextSizeCustom} from '../TextBase';
import {colors} from '../../../themes/colors';
import LinearGradient from 'react-native-linear-gradient';
import {colorGradient} from '../../../themes/theme_gradient';

interface Props extends TouchableOpacityProps {
  title?: string | any;
  radius?: number;
  backgroundColor?: string;
  size?: number;
  sizeIcon?: number;
  color?: string;
  titleStyle?: TextStyle;
  containerStyle?: ViewStyle;
  icon?: any;
  colorIcon?: string;
  onPress?: () => void;
}

const ButtonBase = (props: Props) => {
  const {
    title,
    radius = 10,
    size = 18,
    containerStyle,
    titleStyle,
    color,
    icon,
    sizeIcon = 18,
    colorIcon,
    backgroundColor = colors.green,
    onPress,
    disabled = false, // THÊM disabled
  } = props;

  const isDisabled = disabled ?? false;

  return (
    <View
      style={[
        styles.btn,
        {
          borderRadius: radius,
          backgroundColor: isDisabled ? colors.gray : undefined,
        },
        containerStyle,
      ]}>
      {!isDisabled ? (
        <LinearGradient
          colors={colorGradient['theme-10']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={[StyleSheet.absoluteFill, {borderRadius: radius}]}
        />
      ) : null}

      <TouchableOpacity
        {...props}
        activeOpacity={0.8}
        disabled={isDisabled}
        style={[styles.btn1, {opacity: isDisabled ? 0.6 : 1}]}
        onPress={onPress}>
        {icon && (
          <Image
            source={icon}
            style={{
              width: sizeIcon,
              height: sizeIcon,
              tintColor: colorIcon,
              marginRight: 5,
            }}
          />
        )}
        <TextSizeCustom
          bold
          size={size}
          color={color ?? colors.while}
          style={titleStyle}>
          {title?.toLocaleUpperCase()}
        </TextSizeCustom>
      </TouchableOpacity>
    </View>
  );
};

export default ButtonBase;

const styles = StyleSheet.create({
  btn: {
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btn1: {
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
