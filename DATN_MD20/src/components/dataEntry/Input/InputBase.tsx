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

interface Props extends TextInputProps {
  customRight?: React.ReactElement;
  customLeft?: React.ReactElement;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle; // Chỉ nhận TextStyle
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
  const {
    placeholder = 'Nhập ',
    placeholderTextColor = colors.gray,
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
  } = props;

  return (
    <Block
      row
      borderWidth={isFocused ? 1.5 : 1}
      borderColor={isFocused ? colors.while : colors.gray}
      borderRadius={radius}
      pad={padding}
      padH={paddingHorizontal}
      padV={paddingVertical}
      backgroundColor={'rgba(255,255,255,0.1)'}
      containerStyle={containerStyle}>
      {customLeft && customLeft}
      <TextInput
        {...props}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        style={[styles.input, inputStyle]}
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
  icon: {},
});
