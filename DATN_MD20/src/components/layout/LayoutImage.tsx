import {
  ImageBackground,
  ImageSourcePropType,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import React from 'react';
import metrics from '../../constants/metrics';
import {ImgSRC} from '../../constants/icons';
import {useAppTheme} from '../../themes/ThemeContext';

interface Props {
  containerStyle?: ViewStyle;
  children?: React.ReactNode;
  imagaeUri?: ImageSourcePropType | ImgSRC;
}

const LayoutImage = (props: Props) => {
  const theme = useAppTheme();
  return (
    <ImageBackground
      source={props.imagaeUri ?? ImgSRC.img_login}
      resizeMode="cover"
      height={metrics.diviceScreenHeight}
      style={{
        flex: 1,
        ...props.containerStyle,
      }}>
      <View
        style={{
          flex: 1,
          width: metrics.diviceScreenWidth,
          backgroundColor: theme.background_img,
        }}>
        {props.children}
      </View>
    </ImageBackground>
  );
};

export default LayoutImage;

const styles = StyleSheet.create({});
