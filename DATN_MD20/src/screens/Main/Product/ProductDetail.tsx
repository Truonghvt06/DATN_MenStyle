import {
  FlatList,
  Image,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, {useState} from 'react';
import ContainerView from '../../../components/layout/ContainerView';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Header from '../../../components/dataDisplay/Header';
import navigation from '../../../navigation/navigation';
import ScreenName from '../../../navigation/ScreenName';
import {IconSRC, ImgSRC} from '../../../constants/icons';
import metrics from '../../../constants/metrics';
import Block from '../../../components/layout/Block';
import {
  TextHeight,
  TextMedium,
  TextSmall,
} from '../../../components/dataEntry/TextBase';
import {colors} from '../../../themes/colors';
import {AirbnbRating, Rating} from 'react-native-ratings';
import {dataProduct} from '../../../constants/data';
import TouchIcon from '../../../components/dataEntry/Button/TouchIcon';
import ReviewItem from '../../../components/dataDisplay/ReviewItem';

const dataSize = [
  {id: 12, size: 'S'},
  {id: 13, size: 'M'},
  {id: 14, size: 'L'},
  {id: 15, size: 'XL'},
];
const ProductDetail = () => {
  const {top} = useSafeAreaInsets();
  const [proData, setProData] = useState<any>(dataProduct);
  const [showDescription, setShowDescription] = useState(false);

  const handleFavorite = () => {
    setProData((prev: any) => ({...prev, favorite: !prev.favorite}));
  };
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <ContainerView>
        <Header
          label="Sản phẩm"
          paddingTop={top}
          onPressLeft={() => navigation.resetToHome(ScreenName.Main.BottonTab)}
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: 50}}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.tim}
            onPress={() => {
              handleFavorite();
            }}>
            <Image
              source={
                proData?.favorite
                  ? IconSRC.icon_unfavorite
                  : IconSRC.icon_favorite
              }
              style={{width: 25, height: 25}}
            />
          </TouchableOpacity>
          <Image style={styles.img} source={ImgSRC.img_pro} />
          <Block pad={metrics.space}>
            <TextMedium numberOfLines={2} ellipsizeMode="tail">
              Sản Phẩm 1 Sản Phẩm 1 Sản Phẩm 1 Sản Phẩm 1 Sản Phẩm 1 Sản Phẩm 1
              Sản Phẩm 1 Sản Phẩm 1 Sản Phẩm 1 Sản Phẩm 1
            </TextMedium>
            <TextHeight bold color={colors.red}>
              200.000đ
            </TextHeight>
            <Block row alignCT justifyBW marR={20} marV={10}>
              <Block row alignCT>
                <Image
                  style={{width: 16, height: 16}}
                  source={IconSRC.icon_star}
                />
                <TextSmall style={{marginLeft: 5}}>
                  4.9 (12k đánh giá)
                </TextSmall>
              </Block>
              <TextSmall style={{marginLeft: 5}}>Đã bán 12,8k</TextSmall>
            </Block>
            {/* <TextMedium bold>Màu sắc:</TextMedium>
            <Block row>
              <TouchIcon containerStyle={styles.color} />
            </Block> */}
            <TextMedium bold style={styles.boW}>
              Kích thước
            </TextMedium>
            <View style={{flexDirection: 'row'}}>
              {dataSize.map((item, index) => {
                return (
                  <TouchIcon
                    key={index}
                    colorTitle={colors.black}
                    title={item.size}
                    containerStyle={styles.size}
                    onPress={() => {}}
                  />
                );
              })}
            </View>
            <>
              <TextMedium bold style={styles.boW}>
                Mô tả sản phẩm
              </TextMedium>
              <Block>
                <TextSmall numberOfLines={showDescription ? undefined : 3}>
                  Áo được thiết kế với chất liệu cao cấp, thoáng mát và thấm hút
                  mồ hôi tốt. Form dáng hiện đại, phù hợp với nhiều dáng người.
                  Dễ dàng phối đồ trong nhiều hoàn cảnh khác nhau từ đi làm đến
                  dạo phố. Áo được thiết kế với chất liệu cao cấp, thoáng mát và
                  thấm hút mồ hôi tốt. Form dáng hiện đại, phù hợp với nhiều
                  dáng người. Dễ dàng phối đồ trong nhiều hoàn cảnh khác nhau từ
                  đi làm đến dạo phố.
                </TextSmall>

                <TouchIcon
                  title={showDescription ? 'Thu gọn' : 'Xem thêm'}
                  icon={showDescription ? IconSRC.icon_up : IconSRC.icon_down}
                  color={colors.black}
                  size={20}
                  onPress={() => setShowDescription(!showDescription)}
                  containerStyle={styles.btnSee}
                  sizeText={14}
                />
              </Block>
            </>
            <>
              <Block
                row
                justifyBW
                alignCT
                padV={7}
                borderTopWidth={0.5}
                borderColor={colors.gray1}>
                <TextMedium bold>Đánh giá(123)</TextMedium>
                <TouchIcon
                  title="Xem tất cả"
                  icon={IconSRC.icon_back_right}
                  containerStyle={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                />
              </Block>
              {dataProduct.map((item, index) => {
                return (
                  <ReviewItem
                    star={item.star}
                    name="Nguyen Van A"
                    review="Sản phẩm chất lượng tốt, vải mềm mại và thoáng mát. Rất hài lòng với lần mua hàng này."
                  />
                );
              })}
              {/* <ReviewItem
                star={4}
                name="Nguyen Van A"
                review="Sản phẩm chất lượng tốt, vải mềm mại và thoáng mát. Rất hài lòng với lần mua hàng này."
              />
              <ReviewItem
                star={5}
                name="Nguyen Van A"
                review="Sản phẩm chất lượng tốt, vải mềm mại và thoáng mát. Rất hài lòng với lần mua hàng này."
              /> */}
            </>
          </Block>
        </ScrollView>
      </ContainerView>
    </TouchableWithoutFeedback>
  );
};

export default ProductDetail;

const styles = StyleSheet.create({
  container: {},
  img: {
    width: metrics.diviceScreenWidth,
    height: 300,
    resizeMode: 'cover',
  },
  tim: {
    backgroundColor: colors.while,
    position: 'absolute',
    zIndex: 12,
    right: 7,
    top: 7,
    width: 45,
    height: 45,
    alignItems: 'center',
    borderRadius: 40,
    justifyContent: 'center',
  },
  size: {
    backgroundColor: colors.gray1,
    width: 50,
    height: 35,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 7,
    marginBottom: 20,
  },
  btnSee: {
    flexDirection: 'row',
    // borderBottomWidth: 0.5,
    // borderColor: colors.gray1,
    paddingVertical: 4,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  boW: {
    borderTopWidth: 0.5,
    borderColor: colors.gray1,
    paddingVertical: 7,
  },
});
