import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useAppTheme} from '../../../../../themes/ThemeContext';
import {
  TextMedium,
  TextSmall,
} from '../../../../../components/dataEntry/TextBase';

interface VoucherItemProps {
  code: string;
  description: string;
}

const VoucherItem = () => {
  const theme = useAppTheme();
  return (
    <View
      style={[
        styles.constainer,
        {
          backgroundColor: theme.background_item,
          shadowColor: theme.shadow_color,
        },
      ]}>
      <View>
        <TextSmall>Mã giảm giá: ORDER10</TextSmall>
        <TextSmall>Giảm 10% cho tổng giá trị đơn hàng</TextSmall>
      </View>
    </View>
  );
};

export default VoucherItem;

const styles = StyleSheet.create({
  constainer: {
    borderRadius: 8,
    marginBottom: 8,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    padding: 16,
  },
});
