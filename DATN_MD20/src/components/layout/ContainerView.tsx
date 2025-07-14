import {StyleSheet, View, ViewStyle, StyleProp} from 'react-native';
import React from 'react';

interface Props {
  paddingTop?: number;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
  backgroundColor?: string;
  containerStyle?: StyleProp<ViewStyle>; // ✅ sửa tại đây
}

const ContainerView = (props: Props) => {
  return (
    <View
      style={[
        {
          flex: 1,
          paddingTop: props.paddingTop || 0,
        },
        props.containerStyle,
        props.style,
      ]}>
      {props.children}
    </View>
  );
};

export default ContainerView;

const styles = StyleSheet.create({});
