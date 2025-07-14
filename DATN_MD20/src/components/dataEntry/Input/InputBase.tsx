import {
  Image,
  StyleSheet,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  ViewStyle,
  StyleProp,
  TextStyle,
} from 'react-native';
import React from 'react';
import {IconSRC} from '../../../constants/icons';
import {colors} from '../../../themes/colors';
import Block from '../../layout/Block';
import metrics from '../../../constants/metrics';
import { useAppTheme } from '../../../themes/ThemeContext'; // ✅

interface Props extends TextInputProps {
  customRight?: React.ReactElement;
  customLeft?: React.ReactElement;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  borderBottom?: boolean;
  border?: boolean;
  borderTop?: number;
  padding?: number;
  paddingHorizontal?: number;
  paddingVertical?: number;

  iconLeft?: boolean;
  iconRight?: boolean;
  iconName?: string;
  iconSize?: number;
  iconColor?: string;
  isFocused?: any;
  radius?: number;
  onPressRight?: () => void;

  imageName?: IconSRC;
}

const InputBase = (props: Props) => {
  const theme = useAppTheme(); // ✅ dùng theme
  const {
    placeholder = 'Nhập ',
    placeholderTextColor = theme.text, // ✅ tự động theo theme
    customLeft,
    customRight,
    containerStyle,
    inputStyle,
    borderBottom,
    border,
    borderTop,
    padding = 0,
    paddingHorizontal = 0,
    paddingVertical = 0,
    iconLeft = false,
    iconRight = false,
    iconName,
    iconSize = 20,
    iconColor = theme.text, // ✅ icon theo theme
    radius = 10,
    isFocused,
    onPressRight,
    imageName,
  } = props;

  return (
    <Block
      row
      borderWidth={isFocused ? 1.5 : 1}
      borderColor={isFocused ? theme.text : colors.gray}
      borderRadius={radius}
      pad={padding}
      padH={paddingHorizontal}
      padV={paddingVertical}
      backgroundColor={theme.background} // ✅ nền động
      containerStyle={containerStyle}>
      {customLeft && customLeft}
      <TextInput
        {...props}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        style={[styles.input, { color: theme.text }, inputStyle]} // ✅ text theo theme
      />
      <Block row middle>
        {customRight
          ? customRight
          : iconRight && (
              <TouchableOpacity
                style={{marginRight: metrics.space * 2}}
                onPress={onPressRight}>
                <Image
                  source={imageName}
                  style={{
                    width: iconSize,
                    height: iconSize,
                    tintColor: iconColor,
                  }}
                />
              </TouchableOpacity>
            )}
      </Block>
    </Block>
  );
};

export default InputBase;

const styles = StyleSheet.create({
  input: {
    flex: 1,
    height: 42,
    paddingLeft: 10,
  },
});
