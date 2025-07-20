import {StyleSheet, Text, View, ViewStyle} from 'react-native';
import React from 'react';
import {colors} from '../../themes/colors';
import {useAppTheme} from '../../themes/ThemeContext';

interface Props {
  paddingTop?: number;
  containerStyle?: ViewStyle | any;
  children?: React.ReactNode;
  backgroundColor?: string;
  style?: ViewStyle;
}

const ContainerView = (props: Props) => {
  const theme = useAppTheme();
  const {backgroundColor = theme.background} = props;
  return (
    <View
      style={{
        flex: 1,
        paddingTop: props.paddingTop || 0,
        backgroundColor: backgroundColor || '#EEEEEE',
        ...props.containerStyle,
      }}>
      {props.children}
    </View>
  );
};

export default ContainerView;

const styles = StyleSheet.create({});
