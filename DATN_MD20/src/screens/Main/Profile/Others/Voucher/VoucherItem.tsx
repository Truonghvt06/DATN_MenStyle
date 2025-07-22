import {
  Alert,
  Image,
  Platform,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
} from 'react-native';
import React from 'react';
import {useAppTheme} from '../../../../../themes/ThemeContext';
import {
  TextMedium,
  TextSizeCustom,
  TextSmall,
} from '../../../../../components/dataEntry/TextBase';
import {IconSRC} from '../../../../../constants/icons';
import Block from '../../../../../components/layout/Block';
import ButtonBase from '../../../../../components/dataEntry/Button/ButtonBase';
import TouchIcon from '../../../../../components/dataEntry/Button/TouchIcon';
import {formatDate, formatMoneyShort} from '../../../../../utils/formatDate';
import Clipboard from '@react-native-clipboard/clipboard';

interface VoucherItemProps {
  title: string;
  code?: string;
  image?: string;
  description?: string;
  voucher_scope?: string;
  discount_type?: string;
  discount_value?: number;
  max_discount_value?: number | null; //dùng với phầm trăm
  min_order_amount?: number;
  quantity?: number;
  date_from?: string;
  date_to?: Date | string;
  is_active?: true;
  onPress?: () => void;
}

const VoucherItem = (props: VoucherItemProps) => {
  const theme = useAppTheme();
  const {
    title,
    code,
    image,
    description,
    voucher_scope,
    discount_type,
    discount_value,
    max_discount_value,
    min_order_amount,
    quantity,
    date_from,
    date_to,
    is_active,
    onPress,
  } = props;

  const getTitle = () => {
    if (discount_type === 'percentage') {
      return `Giảm ${discount_value}% Giảm tối đa ${formatMoneyShort(
        max_discount_value ?? 0,
      )}`;
    } else {
      return `Giảm ${formatMoneyShort(discount_value ?? 0)}`;
    }
  };
  return (
    <View
      style={[
        styles.constainer,
        {
          backgroundColor: theme.background_item,
          shadowColor: theme.shadow_color,
        },
      ]}>
      <View style={styles.voucherInfo}>
        <Image
          style={styles.image}
          source={
            image === ''
              ? voucher_scope === 'order'
                ? IconSRC.icon_vc_order
                : IconSRC.icon_vc_ship
              : {uri: image}
          }
        />
        <Block flex1 padL={10} padR={15}>
          <TextSizeCustom size={16} bold style={{marginBottom: 3}}>
            {getTitle()}
          </TextSizeCustom>
          <TextSizeCustom size={12} numberOfLines={1} ellipsizeMode="tail">
            {description}
          </TextSizeCustom>
          <TextSizeCustom size={12}>
            Đơn tối thiểu: {min_order_amount?.toLocaleString('vi-VN')}đ
          </TextSizeCustom>
          <TextSizeCustom size={12} style={{marginTop: 5}}>
            HSD:{formatDate(date_to ?? '')}
          </TextSizeCustom>
        </Block>

        <TouchIcon icon={IconSRC.icon_coppy} onPress={onPress} />
      </View>
    </View>
  );
};

export default VoucherItem;

const styles = StyleSheet.create({
  constainer: {
    flex: 1,
    borderRadius: 8,
    marginBottom: 8,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    paddingVertical: 16,
    paddingHorizontal: 8,
    overflow: 'hidden',
  },
  voucherInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 60,
    height: 60,
    resizeMode: 'cover',
  },
});
