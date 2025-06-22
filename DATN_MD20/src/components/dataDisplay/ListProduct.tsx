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

interface Props {
  data: any;
  containerStyle?: ViewStyle;
  isColums?: boolean;
  isSeemore?: boolean;
  title?: string;
  columNumber?: number;
  horizontal?: boolean;
  onPress?: () => void;
  onPressSee?: () => void;
}

const ITEM_MARGIN = 10;
const NUM_COLUMNS = 2;
const width = metrics.diviceScreenWidth;
const ITEM_WIDTH = (width - ITEM_MARGIN * (NUM_COLUMNS + 1.5)) / NUM_COLUMNS;
const ListProduct = (props: Props) => {
  const {
    data,
    isSeemore,
    title,
    isColums = false,
    columNumber = 2,
    horizontal = false,
    containerStyle,
    onPress,
    onPressSee,
  } = props;
  return (
    <>
      <FlatList
        {...props}
        data={data}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({item}) => {
          return (
            <TouchableOpacity
              activeOpacity={1}
              // style={[containerStyle]}
              onPress={onPress}>
              <Block containerStyle={[styles.shadowWrap, containerStyle]}>
                <Block style={styles.btn}>
                  <Image style={styles.image} source={item.image} />
                  <Block mar={5}>
                    <TextSmall medium numberOfLines={2} ellipsizeMode="tail">
                      {item.name}
                    </TextSmall>
                    <Block row alignCT>
                      <Image style={styles.star} source={IconSRC.icon_star} />
                      <TextSmall>{item.star}</TextSmall>
                    </Block>
                    <TextHeight color={colors.red} bold>
                      {item.price}đ
                    </TextHeight>
                  </Block>
                </Block>
              </Block>
            </TouchableOpacity>
          );
        }}
        numColumns={isColums ? columNumber : 0}
        horizontal={horizontal}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 50,
        }}
      />
      {isSeemore && (
        <TouchableOpacity onPress={onPressSee}>
          <TextSizeCustom size={16} style={styles.see} medium>
            {'Xem Thêm -->'}{' '}
          </TextSizeCustom>
        </TouchableOpacity>
      )}
    </>
  );
};

export default ListProduct;

const styles = StyleSheet.create({
  btn: {
    width: ITEM_WIDTH,
    // marginHorizontal: ITEM_MARGIN / 2,
    // marginBottom: 16,
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
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
    borderRadius: 12,
    marginHorizontal: ITEM_MARGIN / 2,
    // marginBottom: 16,
    paddingTop: 8,
  },
});
