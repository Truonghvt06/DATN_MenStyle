import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import ContainerView from '../../components/layout/ContainerView';
import Block from '../../components/layout/Block';
import {
  TextHeight,
  TextSizeCustom,
  TextSmall,
} from '../../components/dataEntry/TextBase';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import metrics from '../../constants/metrics';
import {IconSRC} from '../../constants/icons';
import TouchIcon from '../../components/dataEntry/Button/TouchIcon';
import {colors} from '../../themes/colors';
import navigation from '../../navigation/navigation';
import ScreenName from '../../navigation/ScreenName';
import BannerSlider from './Banner/Banner';
import Avatar from '../../components/dataDisplay/Avatar';
import ListProduct from '../../components/dataDisplay/ListProduct';
import {dataProduct} from '../../constants/data';
import {FlatList} from 'react-native-gesture-handler';
import products from '../../services/products';
import useLanguage from '../../hooks/useLanguage';

const ITEM_MARGIN = 10;
const NUM_COLUMNS = 2;
const width = metrics.diviceScreenWidth;
const ITEM_WIDTH = (width - ITEM_MARGIN * (NUM_COLUMNS + 1.5)) / NUM_COLUMNS;
const HomeScreen = () => {
  const {top} = useSafeAreaInsets();
  const {getTranslation} = useLanguage();
  const [proData, setProData] = useState<any[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await products.getProducts();
        setProData(res.data); // res.data là mảng sản phẩm
      } catch (error) {
        console.error('Lỗi lấy sản phẩm:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleSearch = () => {
    navigation.navigate(ScreenName.Main.SearchDetail);
  };
  const handleNotification = () => {
    navigation.navigate(ScreenName.Main.Notifications);
  };
  const handleProDetail = (item: any) => {
    navigation.navigate(ScreenName.Main.ProductDetail, {product: item});
  };
  const handleCategory = (name: string, title: string) => {
    navigation.navigate(ScreenName.Main.Category, {name: name, title: title});
  };

  const handleFavorite = (id: number) => {
    setProData((prev: any) =>
      prev.map((item: any) =>
        item.id === id ? {...item, favorite: !item.favorite} : item,
      ),
    );
  };

  const renderHeader = () => (
    <>
      <Block marT={metrics.space * 2} />

      {/* Banner */}
      <BannerSlider />

      {/* Danh mục */}
      <TextHeight
        style={{textTransform: 'capitalize', marginVertical: 10}}
        bold>
        {getTranslation('danh_muc')}:
      </TextHeight>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <Avatar
          title={getTranslation('ao_polo')}
          icon={IconSRC.icon_polo}
          containerStyle={{paddingHorizontal: 20}}
          onPress={() => handleCategory('Áo polo', getTranslation('ao_polo'))}
        />
        <Avatar
          title={getTranslation('ao_thun')}
          icon={IconSRC.icon_t_shirt}
          containerStyle={{paddingHorizontal: 20}}
          onPress={() => handleCategory('Áo thun', getTranslation('ao_thun'))}
        />
        <Avatar
          title={getTranslation('ao_so_mi')}
          icon={IconSRC.icon_shirt}
          containerStyle={{paddingHorizontal: 20}}
          onPress={() => handleCategory('Áo sơ mi', getTranslation('ao_so_mi'))}
        />
        <Avatar
          title={getTranslation('ao_the_thao')}
          icon={IconSRC.icon_thethao}
          containerStyle={{paddingHorizontal: 10}}
          onPress={() =>
            handleCategory('Áo thể thao', getTranslation('ao_the_thao'))
          }
        />
        <Avatar
          title={getTranslation('ao_khoac')}
          icon={IconSRC.icon_khoac}
          containerStyle={{paddingHorizontal: 20}}
          onPress={() => handleCategory('Áo khoác', getTranslation('ao_khoac'))}
        />
        <Avatar
          title={getTranslation('ao_hoodie')}
          icon={IconSRC.icon_hoodie}
          containerStyle={{paddingHorizontal: 20}}
          onPress={() =>
            handleCategory('Áo hoodie', getTranslation('ao_hoodie'))
          }
        />
      </ScrollView>

      <TextHeight
        style={{textTransform: 'capitalize', marginVertical: 15}}
        bold>
        {getTranslation('san_pham_noi_bat')}:
      </TextHeight>
    </>
  );

  return (
    <ContainerView
      containerStyle={{paddingTop: top, paddingHorizontal: metrics.space}}>
      {/* Header */}
      <Block row justifyBW>
        <Block>
          <TextSmall style={{marginBottom: -5}}>
            {getTranslation('xin_chao')}
          </TextSmall>
          <TextSizeCustom size={30} bold>
            MenStyle
          </TextSizeCustom>
        </Block>
        <Block row alignItems="flex-end" marB={5} marR={5}>
          <TouchIcon
            color={colors.black}
            size={25}
            icon={IconSRC.icon_search}
            imageStyle={{marginHorizontal: 7}}
            onPress={handleSearch}
          />
          <Block>
            <View style={styles.tb}>
              <TextSizeCustom
                style={{textAlign: 'center'}}
                color="white"
                size={13}>
                99
              </TextSizeCustom>
            </View>
            <TouchIcon
              color={colors.black}
              size={25}
              icon={IconSRC.icon_notification}
              imageStyle={{marginHorizontal: 7}}
              onPress={handleNotification}
            />
          </Block>
        </Block>
      </Block>

      {/* Sản phẩm  */}
      <FlatList
        data={proData}
        keyExtractor={(item, index) => item._id}
        ListHeaderComponent={renderHeader}
        renderItem={({item}) => {
          return (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => {
                handleProDetail(item);
              }}>
              <Block containerStyle={styles.shadowWrap}>
                <Block containerStyle={[styles.btn]}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.tim}
                    onPress={() => {
                      handleFavorite(item._id);
                    }}>
                    <Image
                      source={
                        item.favorite
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
                    <TextSmall medium numberOfLines={2} ellipsizeMode="tail">
                      {item.name}
                    </TextSmall>
                    <Block row alignCT>
                      <Image style={styles.star} source={IconSRC.icon_star} />
                      <TextSmall>{item.rating_avg}</TextSmall>
                    </Block>
                    <TextHeight color={colors.red} bold>
                      {item.price.toLocaleString('vi-VN')}đ
                    </TextHeight>
                  </Block>
                </Block>
              </Block>
            </TouchableOpacity>
          );
        }}
        numColumns={NUM_COLUMNS}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 50,
        }}
      />
    </ContainerView>
  );
};

export default HomeScreen;

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
  icons: {
    width: 25,
    height: 25,
    marginHorizontal: metrics.space,
  },

  shadowWrap: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
    borderRadius: 12,
    marginHorizontal: ITEM_MARGIN / 2,
    marginBottom: 16,
  },

  btn: {
    backgroundColor: colors.while,
    borderRadius: 12,
    overflow: 'hidden',
    width: ITEM_WIDTH,
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
  tb: {
    backgroundColor: colors.red,
    zIndex: 88,
    height: 20,
    width: 22,
    borderRadius: 30,
    position: 'absolute',
    right: 0,
    top: -15,
    marginTop: 4,
  },
});
