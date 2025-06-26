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
import {useAppTheme} from '../../themes/ThemeContext';

const SearchScreen = () => {
  const {top} = useSafeAreaInsets();
  const [value, setValue] = useState('');
  const theme = useAppTheme();

  const handleSearch = () => {
    navigation.navigate(ScreenName.Main.SearchDetail);
  };
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <ContainerView
        style={{backgroundColor: theme.background}}
      >
        <Header
          visibleLeft
          label="Tìm kiếm"
          paddingTop={top}
          containerStyle={{
            alignItems: 'center',
            paddingLeft: 40,
            height: top + 45,
            backgroundColor: theme.background,
          }}
          labelStyle={{color: theme.text}}
        />
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: metrics.space,
            marginTop: 10,
            paddingBottom: 30,
          }}>
          <TouchableOpacity
            style={[
              styles.search,
              {backgroundColor: theme.background, borderColor: theme.text}
            ]}
            activeOpacity={0.7}
            onPress={() => {
              handleSearch();
            }}>
            <Image style={[styles.icon, {tintColor: theme.text}]} source={IconSRC.icon_search} />
            <TextSmall style={{color: theme.text}}>Tìm sản phẩm...</TextSmall>
          </TouchableOpacity>

          <Image style={styles.banner} source={ImgSRC.img_banner} />

          <ButtonOption
            name="Áo Polo"
            iconLeft={IconSRC.icon_polo}
            onPress={() => {}}
            textColor={theme.text}
          />
          <ButtonOption
            name="Áo Thun"
            iconLeft={IconSRC.icon_t_shirt}
            onPress={() => {}}
            textColor={theme.text}
          />
          <ButtonOption
            name="Áo Sơ Mi"
            iconLeft={IconSRC.icon_shirt}
            onPress={() => {}}
            textColor={theme.text}
          />
          <ButtonOption
            name="Áo Thể Thao"
            iconLeft={IconSRC.icon_thethao}
            onPress={() => {}}
            textColor={theme.text}
          />
          <ButtonOption
            name="Áo Khoác"
            iconLeft={IconSRC.icon_khoac}
            onPress={() => {}}
            textColor={theme.text}
          />
          <ButtonOption
            name="Áo Hoodie"
            iconLeft={IconSRC.icon_hoodie}
            onPress={() => {}}
            textColor={theme.text}
          />
          <TextHeight style={{ ...styles.titel, color: theme.text }} bold>
            Sản Phẩm Mới:
          </TextHeight>
          <ListProduct
            data={dataProduct}
            horizontal={true}
            onPress={() => {}}
            onPressSee={() => {}}
            textColor={theme.text}
          />

          <TextHeight style={{ ...styles.titel, color: theme.text }} bold>
            Sản Phẩm Bán Chạy:
          </TextHeight>
          <ListProduct
            data={dataProduct}
            horizontal={true}
            onPress={() => {}}
            onPressSee={() => {}}
            textColor={theme.text}
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
