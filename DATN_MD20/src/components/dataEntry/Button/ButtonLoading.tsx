import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle,
} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {colorGradient} from '../../../themes/theme_gradient';
import {TextSizeCustom} from '../TextBase';
import {colors} from '../../../themes/colors';

interface Props extends TouchableOpacityProps {
  title: string;
  loading?: boolean;
  //   disabled?: boolean;
  constainerStyle?: ViewStyle;
  radius?: number;
  onPress?: () => void;
}
const ButtonLoading = (props: Props) => {
  const {
    title,
    loading,
    radius = 10,
    constainerStyle,
    disabled,
    onPress,
  } = props;
  const isDisabled = disabled ?? false;
  return (
    <View style={[styles.btn, constainerStyle]}>
      <LinearGradient
        colors={
          isDisabled
            ? [colors.gray, colors.gray] // Màu gradient khi disable
            : colorGradient['theme-10'] // Màu bình thường
        }
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={[
          StyleSheet.absoluteFill,
          {borderRadius: radius, justifyContent: 'center'},
        ]}>
        <TouchableOpacity
          disabled={isDisabled}
          style={[styles.btn1]}
          onPress={onPress}>
          {loading ? (
            <ActivityIndicator size={25} color={colors.while} />
          ) : (
            <TextSizeCustom bold size={18} color={colors.while}>
              {title.toLocaleUpperCase()}
            </TextSizeCustom>
          )}
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
};

export default ButtonLoading;

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
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
