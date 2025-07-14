import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle,
} from 'react-native';
import React from 'react';
import {IconSRC} from '../../../constants/icons';
import Block from '../../layout/Block';
import {colors} from '../../../themes/colors';
import {TextHeight, TextMedium, TextSizeCustom, TextSmall} from '../TextBase';
import TouchIcon from './TouchIcon';

interface Props extends TouchableOpacityProps {
  iconLeft?: IconSRC;
  iconRight?: IconSRC | null;
  sizeRight?: number;
  sizeLeft?: number;
  name?: string;
  content?: string;
  content1?: string | any;
  borderBottom?: number;
  borderColor?: string;
  iconColor?: string;
  containerStyle?: ViewStyle;
  sizeText?: number;
  textColor?: string;
  onPress?: () => void;
}
const ButtonOption = (props: Props) => {
  const {
    name,
    content,
    content1,
    sizeRight = 25,
    sizeLeft = 30,
    sizeText = 16,
    iconLeft,
    iconRight = IconSRC.icon_back_right,
    iconColor = colors.black,
    borderBottom = 0.5,
    borderColor = colors.gray3,
    containerStyle,
    textColor,
    disabled = false,
    onPress,
  } = props;
  return (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.container,
        {borderBottomWidth: borderBottom, borderColor: borderColor},
        containerStyle,
      ]}>
      <Block row alignCT>
        {iconLeft && (
          <Image
            source={iconLeft}
            style={{
              width: sizeLeft,
              height: sizeLeft,
              tintColor: iconColor,
              marginRight: 15,
            }}
          />
        )}
        <Block>
          <TextSizeCustom
            size={sizeText}
            // medium
            style={{textTransform: 'capitalize',
              color: textColor,
            }}>
            {name}
          </TextSizeCustom>
          {content && <TextSmall color={colors.gray}>{content}</TextSmall>}
        </Block>
      </Block>
      <Block row alignCT>
        <TextSizeCustom
          numberOfLines={1}
          ellipsizeMode="tail"
          style={{paddingLeft: 30, textAlign: 'right'}}
          size={sizeText}>
          {content1}
        </TextSizeCustom>
        {iconRight && (
          <TouchIcon
            icon={iconRight}
            size={sizeRight}
            color={iconColor}
            onPress={() => {
              onPress;
            }}
          />
        )}
      </Block>
    </TouchableOpacity>
  );
};

export default ButtonOption;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
});
