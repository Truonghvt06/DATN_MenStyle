import {
  View,
  Text,
  ViewStyle,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import Block from '../../layout/Block';
import {
  TextHeight,
  TextMedium,
  TextSizeCustom,
  TextSmall,
} from '../../dataEntry/TextBase';
import {colors} from '../../../themes/colors';
import useLanguage from '../../../hooks/useLanguage';
import {useAppTheme} from '../../../themes/ThemeContext';

interface Propos {
  data: any;
  code_order?: any;
  date?: string;
  total?: number;
  status?: string;
  backgroundColor?: string;
  containerStyle?: ViewStyle;
  onPress?: () => void;
}
const OrderItem = (props: Propos) => {
  const {getTranslation} = useLanguage();
  const theme = useAppTheme();
  const {
    data,
    code_order,
    date,
    status,
    total,
    backgroundColor = colors.green1,
    containerStyle,
    onPress,
  } = props;

  const displayData = data.slice(0, 2);
  const totalOrder = data.length;

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'Chờ xác nhận':
        return colors.blue2;
      case 'Đã xác nhận':
        return colors.blue1;
      case 'Chờ giao hàng':
        return colors.orange;
      case 'Đã giao':
        return colors.green1;
      case 'Đã huỷ':
        return colors.red;
      default:
        return colors.gray;
    }
  };
  return (
    <TouchableOpacity
      {...props}
      activeOpacity={1}
      style={[
        styles.container,
        {
          backgroundColor: theme.background_item,
          shadowColor: theme.shadow_color,
        },
        containerStyle,
      ]}
      onPress={onPress}>
      <Block padV={12} padH={10} overflow="hidden" flex1>
        <Block row justifyBW padB={10}>
          <Block>
            <TextHeight numberOfLines={1} ellipsizeMode="tail" bold>
              #{code_order}ABCDEF
            </TextHeight>
            <TextSizeCustom size={12} color={colors.gray}>
              {date}
            </TextSizeCustom>
          </Block>
          <Block
            containerStyle={[
              styles.status,
              {backgroundColor: getStatusColor(status)},
            ]}>
            <TextSmall color={colors.while}>{status}</TextSmall>
          </Block>
        </Block>
        <FlatList
          data={displayData}
          keyExtractor={item => item.id}
          renderItem={({item}) => {
            return (
              <Block row flex1 marB={8}>
                <Image source={item.image} style={styles.image} />
                <Block padH={10} flex5>
                  <TextSmall
                    numberOfLines={2}
                    ellipsizeMode="tail"
                    style={styles.text}
                    medium>
                    {item.name}
                  </TextSmall>
                  <Block row>
                    <TextSizeCustom size={12} color={colors.gray}>
                      Size: {item.size} |{' '}
                    </TextSizeCustom>
                    <TextSizeCustom size={12} color={colors.gray}>
                      {getTranslation('mau')}: {item.color} |{' '}
                    </TextSizeCustom>
                    <TextSizeCustom size={12} color={colors.gray}>
                      SL: {item.quantity}
                    </TextSizeCustom>
                  </Block>
                  <TextMedium medium color={colors.red}>
                    {item.price.toLocaleString('vi-VN')}đ
                  </TextMedium>
                </Block>
              </Block>
            );
          }}
          //   ListFooterComponent={
          //     <TextSmall style={{textAlign: 'center'}} color={colors.gray}>
          //       + {totalOrder} sản phẩm
          //     </TextSmall>
          //   }
        />
        <Block borderTopW={0.3} borderColor={colors.gray} padT={8} marT={8}>
          <TextSmall color={colors.gray}>
            {totalOrder} {getTranslation('san_pham_')}
          </TextSmall>
          <TextHeight bold>
            {getTranslation('tong')}: {total?.toLocaleString('vi-VN')}đ
          </TextHeight>
        </Block>
      </Block>
    </TouchableOpacity>
  );
};

export default OrderItem;

const styles = StyleSheet.create({
  container: {
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
    marginBottom: 20,
    borderRadius: 10,
    // overflow: 'hidden',
  },
  image: {
    width: 70,
    height: 80,
    borderRadius: 10,
  },
  status: {
    borderRadius: 20,
    paddingVertical: 5,
    height: 30,
    width: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    // marginRight: 65,
  },
});
