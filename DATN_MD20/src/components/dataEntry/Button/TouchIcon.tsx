import {
  Image,
  ImageStyle,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle,
} from 'react-native';
import React from 'react';
import {IconSRC} from '../../../constants/icons';
import {TextMedium, TextSizeCustom, TextSmall} from '../TextBase';
import {colors} from '../../../themes/colors';

interface Props extends TouchableOpacityProps {
  title?: string | any;
  icon?: IconSRC | any;
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
    color = colors.black,
    titleStyle,
    containerStyle,
    colorTitle,
  } = props;
  return (
    <TouchableOpacity
      {...props}
      activeOpacity={0.9}
      onPress={props.onPress}
      style={containerStyle}>
      {props.title && (
        <Text style={[{fontSize: sizeText, color: colorTitle}, titleStyle]}>
          {props.title}
        </Text>
      )}
      {props.icon && (
        <Image
          style={[
            {
              width: size,
              height: size,
              tintColor: color,
            },
            props.imageStyle,
          ]}
          source={props.icon}
        />
      )}
    </TouchableOpacity>
  );
};

export default TouchIcon;

const styles = StyleSheet.create({
  txt: {fontWeight: 'bold'},
});
