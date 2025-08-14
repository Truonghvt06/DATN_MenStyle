import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Block from '../../../../../components/layout/Block';
import {ImgSRC} from '../../../../../constants/icons';
import {
  TextMedium,
  TextSizeCustom,
} from '../../../../../components/dataEntry/TextBase';
import ButtonBase from '../../../../../components/dataEntry/Button/ButtonBase';
import {useAppTheme} from '../../../../../themes/ThemeContext';
import useLanguage from '../../../../../hooks/useLanguage';

interface Props {
  name: string;
  image: string;
  id_order: string;
  size: string;
  color: string;
  deliveredAt: string | null;
  onPress: () => void;
}

const ItemRated = (props: Props) => {
  const {
    name,
    image,
    id_order,
    size,
    color,
    deliveredAt = null,
    onPress,
  } = props;

  const theme = useAppTheme();
  const {getTranslation} = useLanguage();
  return (
    <View
      style={[
        styles.container,
        {
          shadowColor: theme.shadow_color,
          backgroundColor: theme.background_item,
        },
      ]}>
      <Block row>
        <Image
          source={image ? {uri: image} : ImgSRC.img_pro}
          style={styles.image}
        />
        <Block flex1>
          <TextMedium bold numberOfLines={2} ellipsizeMode="tail">
            {name}
          </TextMedium>
          <TextSizeCustom size={12}>Đơn hàng: {id_order}</TextSizeCustom>
          <TextSizeCustom size={12}>
            Phân loại: Size {size}, Màu {color}
          </TextSizeCustom>
          <TextSizeCustom size={12}>Đã giao: {deliveredAt}</TextSizeCustom>

          <ButtonBase
            title={getTranslation('danh_gia')}
            size={14}
            radius={20}
            containerStyle={styles.btn}
            onPress={onPress}
          />
        </Block>
      </Block>
    </View>
  );
};

export default ItemRated;

const styles = StyleSheet.create({
  container: {
    shadowOffset: {width: 0, height: 1},
    shadowRadius: 3,
    shadowOpacity: 0.2,
    elevation: 3,
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 8,
    // marginBottom: 8,
  },
  image: {
    width: 80,
    height: 95,
    borderRadius: 8,
    marginRight: 10,
  },
  btn: {
    marginTop: -12,
    width: 120,
    height: 30,
    alignSelf: 'flex-end',
  },
});
