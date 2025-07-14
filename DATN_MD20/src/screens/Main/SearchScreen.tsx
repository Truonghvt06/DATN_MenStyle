import {
  Image,
  Keyboard,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import ContainerView from '../../components/layout/ContainerView';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Header from '../../components/dataDisplay/Header';
import navigation from '../../navigation/navigation';
import ScreenName from '../../navigation/ScreenName';
import {IconSRC, ImgSRC} from '../../constants/icons';
import metrics from '../../constants/metrics';
import Block from '../../components/layout/Block';
import {
  TextHeight,
  TextSmall,
} from '../../components/dataEntry/TextBase';
import {colors} from '../../themes/colors';
import useLanguage from '../../hooks/useLanguage';
import {useAppTheme} from '../../themes/ThemeContext';
import products from '../../services/products';

const SearchScreen = () => {
  const {top} = useSafeAreaInsets();
  const {getTranslation} = useLanguage();
  const theme = useAppTheme();

  const [proData, setProData] = useState<any[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await products.getProducts();
        setProData(res.data || []);
      } catch (error) {
        console.error('Lỗi lấy sản phẩm:', error);
      }
    };
    fetchProducts();
  }, []);

  const handleSearch = () => {
    navigation.navigate(ScreenName.Main.SearchDetail);
  };

  const handleProDetail = (item: any) => {
    navigation.navigate(ScreenName.Main.ProductDetail, {product: item});
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <ContainerView
        containerStyle={{
          paddingTop: top,
          paddingHorizontal: metrics.space,
          backgroundColor: theme.background,
        }}>
        <Header
          visibleLeft
          label={getTranslation('tim_kiem')}
          paddingTop={top}
          backgroundColor={theme.background}
          textColor={theme.text}
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: 30}}>

          {/* Search Box */}
          <TouchableOpacity
            style={[
              styles.search,
              {backgroundColor: theme.background, borderColor: theme.text},
            ]}
            activeOpacity={0.7}
            onPress={handleSearch}>
            <Image
              style={[styles.icon, {tintColor: theme.text}]}
              source={IconSRC.icon_search}
            />
            <TextSmall style={{color: theme.text}}>
              {getTranslation('tim_sp')}
            </TextSmall>
          </TouchableOpacity>

          {/* Banner */}
          <Image style={styles.banner} source={ImgSRC.img_banner} />

          {/* Sản phẩm mới */}
          <TextHeight style={[styles.titel, {color: theme.text}]} bold>
            {getTranslation('san_pham_moi')}:
          </TextHeight>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{gap: 12}}>
            {proData.map((item, index) => (
              <TouchableOpacity
                key={`new-${index}`}
                onPress={() => handleProDetail(item)}
                activeOpacity={0.9}>
                <Block style={[styles.card, {backgroundColor: theme.background}]}>
                  <Image
                    style={styles.image}
                    source={{uri: item.variants?.[0]?.image || ''}}
                  />
                  <Block mar={5}>
                    <TextSmall
                      numberOfLines={2}
                      style={{color: theme.text}}>
                      {item.name}
                    </TextSmall>
                    <TextSmall color={colors.red} bold>
                      {item.price.toLocaleString('vi-VN')}đ
                    </TextSmall>
                  </Block>
                </Block>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Sản phẩm bán chạy */}
          <TextHeight style={[styles.titel, {color: theme.text}]} bold>
            {getTranslation('san_pham_ban_chay')}:
          </TextHeight>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{gap: 12}}>
            {proData
              .slice()
              .sort((a, b) => b.sold_count - a.sold_count)
              .map((item, index) => (
                <TouchableOpacity
                  key={`hot-${index}`}
                  onPress={() => handleProDetail(item)}
                  activeOpacity={0.9}>
                  <Block style={[styles.card, {backgroundColor: theme.background}]}>
                    <Image
                      style={styles.image}
                      source={{uri: item.variants?.[0]?.image || ''}}
                    />
                    <Block mar={5}>
                      <TextSmall
                        numberOfLines={2}
                        style={{color: theme.text}}>
                        {item.name}
                      </TextSmall>
                      <TextSmall color={colors.red} bold>
                        {item.price.toLocaleString('vi-VN')}đ
                      </TextSmall>
                    </Block>
                  </Block>
                </TouchableOpacity>
              ))}
          </ScrollView>
        </ScrollView>
      </ContainerView>
    </TouchableWithoutFeedback>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  search: {
    marginTop: 10,
    flexDirection: 'row',
    borderWidth: 1,
    height: 40,
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  icon: {
    marginRight: 10,
    width: 20,
    height: 20,
  },
  banner: {
    marginTop: 20,
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  titel: {
    textTransform: 'capitalize',
    marginTop: 20,
    marginBottom: 10,
  },
  card: {
    width: 150,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
});
