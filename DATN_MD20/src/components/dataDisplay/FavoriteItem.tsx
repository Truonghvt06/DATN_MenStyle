import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import Block from '../layout/Block';
import metrics from '../../constants/metrics';
import {TextMedium, TextSmall} from '../dataEntry/TextBase';
import ButtonBase from '../dataEntry/Button/ButtonBase';
import {IconSRC} from '../../constants/icons';
import {colors} from '../../themes/colors';
import TouchIcon from '../dataEntry/Button/TouchIcon';
import useLanguage from '../../hooks/useLanguage';
import {useAppTheme} from '../../themes/ThemeContext';

interface Props {
  name?: string;
  price?: number;
  image?: any;
  onPress?: () => void;
  onPressAdd?: () => void;
  onPressIcon?: () => void;
}
const FavoriteItem = (props: Props) => {
  const {getTranslation} = useLanguage();
  const theme = useAppTheme();
  const {name, price, image, onPress, onPressIcon, onPressAdd} = props;
  return (
    <TouchableOpacity
      activeOpacity={1}
      style={styles.container}
      onPress={onPress}>
      <Block row>
        <Image style={styles.image} source={{uri: image}} />
        <Block marL={12} flex1>
          <TextMedium
            numberOfLines={2}
            ellipsizeMode="tail"
            // style={{textAlign: 'justify'}}
          >
            {name}
          </TextMedium>
          <TextMedium color={colors.primary} medium>
            {price?.toLocaleString('vi-vn')}VND
          </TextMedium>
          <ButtonBase
            containerStyle={styles.btnAdd}
            title={getTranslation('them_vao_gio')}
            size={12}
            radius={5}
            titleStyle={{fontWeight: '100'}}
            onPress={onPressAdd}
          />
        </Block>
        <TouchIcon
          icon={IconSRC.icon_menu}
          containerStyle={[styles.icon, {tintColor: theme.icon}]}
          size={20}
          onPress={onPressIcon}
        />
      </Block>
    </TouchableOpacity>
  );
};

export default FavoriteItem;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: metrics.space,
    paddingVertical: 20,
    borderBottomWidth: 0.5,
    borderColor: colors.gray3,
  },
  image: {
    width: 90,
    height: 110,
    borderRadius: 7,
  },
  icon: {
    padding: 3,
    alignSelf: 'center',
    marginLeft: 20,
  },
  btnAdd: {
    height: 30,
    width: 120,
    marginTop: 10,
  },
});
