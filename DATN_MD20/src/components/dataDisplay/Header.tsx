import {
  Image,
  Platform,
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
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useAppTheme} from '../../themes/ThemeContext';

interface Props {
  label?: string;
  left?: React.ReactElement;
  right?: React.ReactElement | any;
  paddingTop?: number;
  visibleLeft?: boolean;
  styleLeft?: ViewStyle;
  containerStyle?: ViewStyle;
  iconColor?: string;
  backgroundColor?: string;
  labelColor?: string;
  onPressLeft?: () => void;
}

const Header = (props: Props) => {
  const theme = useAppTheme();
  const {top} = useSafeAreaInsets();
  const {
    label,
    left,
    right,
    paddingTop = top,
    onPressLeft,
    visibleLeft,
    styleLeft,
    containerStyle,
    labelColor = theme.text,
    iconColor = theme.icon,
    backgroundColor = theme.background_header,
  } = props;

  return (
    <View
      style={[
        {
          backgroundColor: backgroundColor,
          height: Platform.OS === 'android' ? paddingTop + 45 : paddingTop + 35,
          width: metrics.diviceScreenWidth,
          paddingTop: paddingTop - 15,
          paddingHorizontal: metrics.space,
          shadowColor: theme.shadow_color,
          ...containerStyle,
        },
        styles.shadow,
      ]}>
      <Block flex1 row justifyBW alignCT>
        {!visibleLeft ? (
          <View style={{flex: 1}}>
            <TouchableOpacity
              activeOpacity={0.9}
              style={[styles.btnLeft, styleLeft]}
              onPress={onPressLeft || navigation.goBack}>
              <Image
                style={[styles.image, {tintColor: iconColor}]}
                source={IconSRC.icon_back_left}
              />
            </TouchableOpacity>
          </View>
        ) : (
          <Text style={{flex: 1}}></Text>
        )}
        <TextSizeCustom
          bold
          size={22}
          color={labelColor}
          style={{
            flex: 4,
            textTransform: 'capitalize',
            textAlign: 'center',
          }}>
          {label}
        </TextSizeCustom>
        <View style={{flex: 1, alignItems: 'flex-end'}}>
          {right ? right : <Text style={{flex: 1}}></Text>}
        </View>
      </Block>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  shadow: {
    // shadowColor: 'grey',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  image: {
    width: 25,
    height: 25,
  },
  btnLeft: {
    height: 40,
    width: 40,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
