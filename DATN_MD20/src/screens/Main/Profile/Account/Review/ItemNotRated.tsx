import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import Block from '../../../../../components/layout/Block';
import {IconSRC, ImgSRC} from '../../../../../constants/icons';
import {
  TextMedium,
  TextSizeCustom,
  TextSmall,
} from '../../../../../components/dataEntry/TextBase';
import ButtonBase from '../../../../../components/dataEntry/Button/ButtonBase';
import {useAppTheme} from '../../../../../themes/ThemeContext';
import useLanguage from '../../../../../hooks/useLanguage';
import {colors} from '../../../../../themes/colors';

interface Props {
  nameUser: string;
  avatar: string;
  namePro: string;
  image: string;
  id_order?: string;
  size: string;
  color: string;
  star: any;
  comment?: string;
  date: string;
  onPress: () => void;
}
const ItemNotRated = (props: Props) => {
  const {
    nameUser,
    namePro,
    avatar,
    image,
    id_order,
    size,
    color,
    star,
    comment,
    date,
    onPress,
  } = props;

  const theme = useAppTheme();
  const {getTranslation} = useLanguage();

  const renderStars = (star: number = 0) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Image
          key={i}
          source={i <= star ? IconSRC.icon_star : IconSRC.icon_unstar}
          style={{width: 11, height: 11, marginRight: 2}}
        />,
      );
    }
    return <View style={{flexDirection: 'row'}}>{stars}</View>;
  };
  return (
    <View
      style={[
        styles.container,
        {
          shadowColor: theme.shadow_color,
          backgroundColor: theme.background_item,
        },
      ]}>
      <Block>
        <Block row alignCT>
          <Image
            source={avatar ? {uri: avatar} : ImgSRC.img_avatar}
            style={styles.avatar}
          />
          <Block>
            <TextSmall bold numberOfLines={2} ellipsizeMode="tail">
              {nameUser}
            </TextSmall>
            {renderStars(star)}
          </Block>
        </Block>

        {/* San Phma  */}
        <Block marL={39} marT={8}>
          <TextSmall color={colors.gray1}>
            {date} | Phân loại: Size {size}, Màu {color}
          </TextSmall>

          {comment && comment !== '' && (
            <TextSmall numberOfLines={2}>{`${getTranslation(
              'danh_gia',
            )}: ${comment}`}</TextSmall>
          )}

          <TouchableOpacity
            activeOpacity={0.7}
            style={[styles.pro, {borderColor: theme.border_color}]}
            onPress={onPress}>
            <Image
              source={image ? {uri: image} : ImgSRC.img_pro}
              style={styles.image}
            />
            <TextSmall numberOfLines={2} ellipsizeMode="tail">
              {namePro}
            </TextSmall>
          </TouchableOpacity>
        </Block>
      </Block>
    </View>
  );
};

export default ItemNotRated;

const styles = StyleSheet.create({
  container: {
    shadowOffset: {width: 0, height: 1},
    shadowRadius: 3,
    shadowOpacity: 0.1,
    elevation: 3,
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 8,
    // marginBottom: 10,
  },
  image: {
    width: 50,
    height: 60,
    borderRadius: 8,
    marginRight: 10,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 20,
    marginRight: 10,
  },
  btn: {
    marginTop: -12,
    width: 120,
    height: 30,
    alignSelf: 'flex-end',
  },
  pro: {
    padding: 5,
    flexDirection: 'row',
    borderWidth: 0.5,
    borderRadius: 8,
    overflow: 'hidden',
    marginTop: 8,
    alignItems: 'center',
  },
});
