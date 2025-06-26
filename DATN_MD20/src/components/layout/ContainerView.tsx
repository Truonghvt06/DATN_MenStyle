import {StyleSheet, View, ViewProps} from 'react-native';
import React from 'react';
import {colors} from '../../themes/colors';

interface ContainerViewProps extends ViewProps {
  paddingTop?: number;
  backgroundColor?: string;
  children?: React.ReactNode;
}

const ContainerView: React.FC<ContainerViewProps> = ({
  paddingTop = 0,
  backgroundColor,
  style,
  children,
  ...rest
}) => {
  return (
    <View
      style={[
        {
          flex: 1,
          paddingTop,
          backgroundColor: backgroundColor || colors.while,
        },
        style,
      ]}
      {...rest}>
      {children}
    </View>
  );
};

export default ContainerView;

const styles = StyleSheet.create({});
