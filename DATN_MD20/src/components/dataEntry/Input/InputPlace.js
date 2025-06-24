import React, {useState, useEffect} from 'react';
import {
  Animated,
  TextInput,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import {colors} from '../../../themes/colors';
import {IconSRC} from '../../../constants/icons';

// interface Props {
//   label?: string;
//   value?: string | undefined;
//   onChangeText?: (text: string) => void;
// }
const InputPlace = props => {
  const {
    label,
    value,
    onChangeText,
    is_Focused = false,
    onPress,
    containerView,
    iconRight,
    disabled = false,
  } = props;
  const [isFocused, setIsFocused] = useState(is_Focused);
  const animatedIsFocused = new Animated.Value(value !== '' ? 1 : 0);

  useEffect(() => {
    Animated.timing(animatedIsFocused, {
      toValue: isFocused || value !== '' ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused, value]);

  const labelStyle = {
    position: 'absolute',
    left: 0,
    top: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [10, 0],
    }),
    fontSize: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [14, 12],
    }),
    color: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [colors.gray, colors.gray],
    }),
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      style={[styles.container, containerView, {opacity: disabled ? 0.5 : 1}]}
      onPress={() => {
        if (!disabled && onPress) {
          onPress();
        }
      }}>
      <Animated.Text style={labelStyle}>{label}</Animated.Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        style={styles.input}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
      {iconRight && <Image style={styles.icon} source={IconSRC.icon_down} />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    marginBottom: 10,
    color: colors.black,
    borderBottomWidth: 0.3,
    borderBottomColor: colors.gray1,
  },
  input: {
    width: '100%',
    height: 35,
    fontSize: 14,
  },
  icon: {
    width: 25,
    height: 25,
    tintColor: colors.gray,
    marginTop: -5,
    marginLeft: -25,
  },
});

export default InputPlace;
