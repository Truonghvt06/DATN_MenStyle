import {
  FlatList,
  Image,
  ImageProps,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import React from 'react';
import {colors} from '../../themes/colors';
import Block from '../layout/Block';
import {
  TextHeight,
  TextMedium,
  TextSizeCustom,
  TextSmall,
} from '../dataEntry/TextBase';
import {IconSRC, ImgSRC} from '../../constants/icons';
import metrics from '../../constants/metrics';
import useLanguage from '../../hooks/useLanguage';

interface Props {
  data: any;
  containerStyle?: ViewStyle;
  isColums?: boolean;
  isSeemore?: boolean;
  title?: string;
  columNumber?: number;
  horizontal?: boolean;
  favoriteId?: any;
  onPress?: (id: string) => void;
  onPressSee?: () => void;
  onPressFavorite?: (id: string) => void;
}

const ITEM_MARGIN = 10;
const NUM_COLUMNS = 2;
const width = metrics.diviceScreenWidth;
const ITEM_WIDTH = (width - ITEM_MARGIN * (NUM_COLUMNS + 1.5)) / NUM_COLUMNS;
const ListProduct = (props: Props) => {
  const {getTranslation} = useLanguage();
  const {
    data,
    isSeemore,
    title,
    isColums = false,
    columNumber = 2,
    horizontal = false,
    containerStyle,
    favoriteId,
    onPress,
    onPressSee,
    onPressFavorite,
  } = props;
  return (
    <>
      <FlatList
        {...props}
        data={data}
        keyExtractor={(item, index) => `${item._id}-${index}`}
        renderItem={({item}) => {
          return (
            <TouchableOpacity
              activeOpacity={1}
              // style={[containerStyle]}
              onPress={() => onPress && onPress(item._id)}>
              <Block containerStyle={[styles.shadowWrap, containerStyle]}>
                <Block style={styles.btn}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.tim}
                    onPress={() =>
                      onPressFavorite && onPressFavorite(item._id)
                    }>
                    <Image
                      source={
                        favoriteId?.includes(item._id)
                          ? IconSRC.icon_unfavorite
                          : IconSRC.icon_favorite
                      }
                      style={{width: 20, height: 20}}
                    />
                  </TouchableOpacity>
                  <Image
                    style={styles.image}
                    source={{uri: item.variants?.[0]?.image || ''}}
                  />
                  <Block mar={5}>
                    <TextSmall medium numberOfLines={1} ellipsizeMode="tail">
                      {item.name}
                    </TextSmall>
                    <Block row alignCT>
                      <Image style={styles.star} source={IconSRC.icon_star} />
                      <TextSmall>{item.rating_avg}</TextSmall>
                    </Block>
                    <TextHeight color={colors.red} bold>
                      {item.price.toLocaleString('vi-VN')} VND
                    </TextHeight>
                  </Block>
                </Block>
              </Block>
            </TouchableOpacity>
          );
        }}
        scrollEnabled={false}
        numColumns={isColums ? columNumber : 0}
        horizontal={horizontal}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 50,
          paddingTop: 10,
        }}
      />
      {isSeemore && (
        <TouchableOpacity onPress={onPressSee}>
          <TextSizeCustom size={16} style={styles.see} medium>
            {getTranslation('xem_them')}
          </TextSizeCustom>
        </TouchableOpacity>
      )}
    </>
  );
};

export default ListProduct;

const styles = StyleSheet.create({
  tim: {
    backgroundColor: colors.while,
    position: 'absolute',
    zIndex: 12,
    right: 7,
    top: 7,
    width: 35,
    height: 35,
    alignItems: 'center',
    borderRadius: 20,
    justifyContent: 'center',
  },
  btn: {
    width: ITEM_WIDTH,
    overflow: 'hidden',
    backgroundColor: colors.while,
    borderRadius: 12,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  star: {
    width: 16,
    height: 16,
    marginRight: 5,
  },
  see: {
    textAlign: 'right',
    marginTop: -40,
    textDecorationLine: 'underline',
  },
  shadowWrap: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
    borderRadius: 12,
    marginHorizontal: ITEM_MARGIN / 2,
    // marginBottom: 16,
    marginBottom: 14,
  },
});
