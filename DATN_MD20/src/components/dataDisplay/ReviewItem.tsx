import {Image, StyleSheet, Text, View, ViewStyle} from 'react-native';
import React from 'react';
import Block from '../layout/Block';
import {TextMedium, TextSmall} from '../dataEntry/TextBase';
import {Rating} from 'react-native-ratings';
import {IconSRC, ImgSRC} from '../../constants/icons';
import {colors} from '../../themes/colors';
import {formatDateComment} from '../../utils/formatDate';
interface Props {
  avatar?: any;
  name?: string;
  star?: number;
  review?: string;
  date?: string;
  size?: string;
  color?: string;
  containerStyle?: ViewStyle;
  onPress?: () => void;
}
const ReviewItem = (props: Props) => {
  const {
    avatar,
    name,
    star = 1,
    review,
    containerStyle,
    onPress,
    date,
    size,
    color,
  } = props;

  const renderStars = (star: number = 0) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Image
          key={i}
          source={i <= star ? IconSRC.icon_star : IconSRC.icon_unstar}
          style={{width: 12, height: 12, marginRight: 2.5}}
        />,
      );
    }
    return <View style={{flexDirection: 'row'}}>{stars}</View>;
  };

  return (
    <Block padV={10} borderBottomWidth={0.5} borderColor={colors.gray1}>
      <Block row alignCT padB={10}>
        <Image
          source={avatar ? {uri: avatar} : ImgSRC.img_avatar}
          style={styles.avatar}
        />
        <Block padH={10}>
          <TextSmall bold>{name}</TextSmall>

          {renderStars(star)}
        </Block>
        <TextSmall color={colors.gray} style={{flex: 1, textAlign: 'right'}}>
          {formatDateComment(date as '')}
        </TextSmall>
      </Block>
      <TextSmall color={colors.gray}>
        Phân loại: Size {size}, Màu {color}
      </TextSmall>
      <TextSmall>{review}</TextSmall>
    </Block>
  );
};
4;
export default ReviewItem;

const styles = StyleSheet.create({
  container: {},
  avatar: {
    width: 35,
    height: 35,
    borderRadius: 30,
  },
});
