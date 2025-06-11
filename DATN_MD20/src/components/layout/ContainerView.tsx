import {StyleSheet, Text, View, ViewStyle} from 'react-native';
import React from 'react';
import {colors} from '../../themes/colors';

interface Props {
  containerStyle?: ViewStyle;
  children?: React.ReactNode;
  backgroundColor?: string;
}

const ContainerView = (props: Props) => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: props.backgroundColor || colors.sky_blue,
        ...props.containerStyle,
      }}>
      {props.children}
    </View>
  );
};

export default ContainerView;

const styles = StyleSheet.create({});
