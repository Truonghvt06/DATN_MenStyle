import {
  Image,
  ImageStyle,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
} from 'react-native';
import React from 'react';
import {IconSRC} from '../../../constants/icons';
import {colors} from '../../../themes/colors';
import {useAppTheme} from '../../../themes/ThemeContext'; // ✅ dùng theme

interface Props extends TouchableOpacityProps {
  title?: string;
  icon?: any;
  size?: number;
  sizeText?: number;
  color?: string;
  colorTitle?: string;
  onPress?: () => void;
  containerStyle?: ViewStyle | any;
  imageStyle?: ImageStyle;
  titleStyle?: TextStyle;
}

const TouchIcon = (props: Props) => {
  const {
    sizeText = 14,
    size = 20,
    titleStyle,
    containerStyle,
    icon,
    title,
    imageStyle,
    onPress,
  } = props;

  const theme = useAppTheme(); // ✅ lấy theme hiện tại

  const iconColor = props.color ?? theme.text;
  const titleColor = props.colorTitle ?? theme.text;

  return (
    <TouchableOpacity
      {...props}
      activeOpacity={0.9}
      onPress={onPress}
      style={containerStyle}>
      {title && (
        <Text style={[{fontSize: sizeText, color: titleColor}, titleStyle]}>
          {title}
        </Text>
      )}
      {icon && (
        <Image
          style={[
            {
              width: size,
              height: size,
              tintColor: iconColor,
            },
            imageStyle,
          ]}
          source={icon}
        />
      )}
    </TouchableOpacity>
  );
};

export default TouchIcon;
