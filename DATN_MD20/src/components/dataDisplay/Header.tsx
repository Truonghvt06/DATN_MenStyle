import {
  Image,
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

interface Props {
  label?: string;
  left?: React.ReactElement;
  right?: React.ReactElement | any;
  paddingTop?: number;
  visibleLeft?: boolean;
  styleLeft?: ViewStyle;
  containerStyle?: ViewStyle;
  labelColor?: string;
  iconColor?: string;
  onPressLeft?: () => void;
}
const Header = (props: Props) => {
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
    labelColor = colors.while,
    iconColor = colors.black,
  } = props;

  return (
    <View
      style={[
        {
          backgroundColor: colors.while,
          height: paddingTop + 35,
          width: metrics.diviceScreenWidth,
          paddingTop: paddingTop - 15,
          paddingHorizontal: metrics.space,
          // paddingBottom: metrics.space * 2,
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
                style={[styles.image, {tintColor: iconColor || colors.while}]}
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
          color={colors.black}
          style={{
            flex: 4,
            textTransform: 'capitalize',
            color: labelColor,
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
    shadowColor: 'grey',
    // borderRadius: 10,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
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
    // backgroundColor: colors.green,
  },
});
