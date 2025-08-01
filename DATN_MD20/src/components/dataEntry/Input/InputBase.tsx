import {
  Image,
  StyleSheet,
  TextInput,
  TextInputProps,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import React from 'react';
import {IconSRC} from '../../../constants/icons';
import {colors} from '../../../themes/colors';
import Block from '../../layout/Block';
import metrics from '../../../constants/metrics';
import {useAppTheme} from '../../../themes/ThemeContext';

interface Props extends TextInputProps {
  customRight?: React.ReactElement;
  customLeft?: React.ReactElement;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle | ViewStyle | any;
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
  const theme = useAppTheme();

  const {
    placeholder = 'Nhập ',
    placeholderTextColor = theme.placeholderTextColor,
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
    iconColor,
    radius = 10,
    isFocused,
    onPressRight,
    imageName,

    // ✅ Tách rõ value và onChangeText để tránh lỗi
    value,
    onChangeText,
    ...rest
  } = props;

  return (
    <Block
      row
      borderWidth={isFocused ? 1.5 : 0.7}
      borderColor={isFocused ? colors.blue1 : theme.border_color}
      borderRadius={radius}
      pad={padding}
      padH={paddingHorizontal}
      padV={paddingVertical}
      backgroundColor={theme.background_input}
      containerStyle={containerStyle}>
      {customLeft && customLeft}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        style={[styles.input, inputStyle]}
        {...rest}
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
    color: colors.black,
  },
});
