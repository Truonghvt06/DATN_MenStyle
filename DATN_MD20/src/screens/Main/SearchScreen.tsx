import {
  Image,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, {useState} from 'react';
import ContainerView from '../../components/layout/ContainerView';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  TextHeight,
  TextSizeCustom,
  TextSmall,
} from '../../components/dataEntry/TextBase';
import Block from '../../components/layout/Block';
import {IconSRC, ImgSRC} from '../../constants/icons';
import {colors} from '../../themes/colors';
import metrics from '../../constants/metrics';
import InputBase from '../../components/dataEntry/Input/InputBase';
import navigation from '../../navigation/navigation';
import ScreenName from '../../navigation/ScreenName';
import Header from '../../components/dataDisplay/Header';
import ButtonOption from '../../components/dataEntry/Button/BottonOption';
import ListProduct from '../../components/dataDisplay/ListProduct';
import {dataProduct} from '../../constants/data';
import useLanguage from '../../hooks/useLanguage';

const SearchScreen = () => {
  const {top} = useSafeAreaInsets();
  const {getTranslation} = useLanguage();

  const [value, setValue] = useState('');

  const handleSearch = () => {
    navigation.navigate(ScreenName.Main.SearchDetail);
  };
  const handleCategory = (name: string) => {
    navigation.navigate(ScreenName.Main.Category, {name: name});
  };
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <ContainerView
      // containerStyle={{paddingTop: top, paddingHorizontal: metrics.space}}
      >
        <Header
          visibleLeft
          label={getTranslation('tim_kiem')}
          paddingTop={top}
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: metrics.space,
            marginTop: 10,
            paddingBottom: 30,
          }}>
          <TouchableOpacity
            style={styles.search}
            activeOpacity={0.7}
            onPress={() => {
              handleSearch();
            }}>
            <Image style={styles.icon} source={IconSRC.icon_search} />
            <TextSmall color={colors.gray3}>
              {getTranslation('tim_sp')}
            </TextSmall>
          </TouchableOpacity>

          <Image style={styles.banner} source={ImgSRC.img_banner} />

          <TextHeight style={styles.titel} bold>
            {getTranslation('san_pham_moi')}:
          </TextHeight>
          <ListProduct
            data={dataProduct}
            horizontal={true}
            isSeemore
            onPress={() => {}}
            onPressSee={() => {}}
          />

          <TextHeight style={styles.titel} bold>
            {getTranslation('san_pham_ban_chay')}:
          </TextHeight>
          <ListProduct
            data={dataProduct}
            horizontal={true}
            isSeemore
            onPress={() => {}}
            onPressSee={() => {}}
          />
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
    borderColor: colors.gray3,
    height: 40,
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: colors.while,
  },
  icon: {
    // alignSelf: 'center',
    marginHorizontal: 10,
    width: 20,
    height: 20,
    tintColor: colors.gray3,
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
});
