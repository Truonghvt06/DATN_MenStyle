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

const SearchScreen = () => {
  const {top} = useSafeAreaInsets();
  const [value, setValue] = useState('');

  const handleSearch = () => {
    navigation.navigate(ScreenName.Main.SearchDetail);
  };
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <ContainerView
      // containerStyle={{paddingTop: top, paddingHorizontal: metrics.space}}
      >
        <Header
          visibleLeft
          label="Tìm kiếm"
          paddingTop={top}
          containerStyle={{
            alignItems: 'center',
            paddingLeft: 40,
            height: top + 45,
          }}
        />
        <ScrollView
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
            <TextSmall color={colors.gray3}>Tìm sản phẩm...</TextSmall>
          </TouchableOpacity>

          <Image style={styles.banner} source={ImgSRC.img_banner} />

          {/* <TextHeight bold>Danh Mục:</TextHeight> */}
          <ButtonOption
            name="Áo Polo"
            iconLeft={IconSRC.icon_polo}
            onPress={() => {}}
          />
          <ButtonOption
            name="Áo Thun"
            iconLeft={IconSRC.icon_t_shirt}
            onPress={() => {}}
          />
          <ButtonOption
            name="Áo Sơ Mi"
            iconLeft={IconSRC.icon_shirt}
            onPress={() => {}}
          />
          <ButtonOption
            name="Áo Thể Thao"
            iconLeft={IconSRC.icon_thethao}
            onPress={() => {}}
          />
          <ButtonOption
            name="Áo Khoác"
            iconLeft={IconSRC.icon_khoac}
            onPress={() => {}}
          />
          <ButtonOption
            name="Áo Hoodie"
            iconLeft={IconSRC.icon_hoodie}
            onPress={() => {}}
          />
          <TextHeight style={styles.titel} bold>
            Sản Phẩm Mới:
          </TextHeight>
          <ListProduct
            data={dataProduct}
            horizontal={true}
            onPress={() => {}}
            onPressSee={() => {}}
          />

          <TextHeight style={styles.titel} bold>
            Sản Phẩm Bán Chạy:
          </TextHeight>
          <ListProduct
            data={dataProduct}
            horizontal={true}
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
    textTransform: 'uppercase',
    marginTop: 20,
    marginBottom: 10,
  },
});
