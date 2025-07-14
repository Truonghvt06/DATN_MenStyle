
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useState} from 'react';


import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ContainerView from '../../components/layout/ContainerView';
import Header from '../../components/dataDisplay/Header';
import {dataProduct} from '../../constants/data';
import FavoriteItem from '../../components/dataDisplay/FavoriteItem';
import TouchIcon from '../../components/dataEntry/Button/TouchIcon';
import {IconSRC} from '../../constants/icons';
import {colors} from '../../themes/colors';
import ModalBottom from '../../components/dataDisplay/Modal/ModalBottom';
import metrics from '../../constants/metrics';
import ButtonOption from '../../components/dataEntry/Button/BottonOption';
import Block from '../../components/layout/Block';
import ModalCenter from '../../components/dataDisplay/Modal/ModalCenter';
import useLanguage from '../../hooks/useLanguage';

import {useAppTheme} from '../../themes/ThemeContext';

import {useAppDispatch, useAppSelector} from '../../redux/store';
import {
  clearFavorites,
  deleteFavorite,
  fetchFavorites,
} from '../../redux/actions/favorite';
import {TextMedium} from '../../components/dataEntry/TextBase';
import ButtonBase from '../../components/dataEntry/Button/ButtonBase';
import navigation from '../../navigation/navigation';
import ScreenName from '../../navigation/ScreenName';
import Toast from 'react-native-toast-message';
import configToast from '../../components/utils/configToast';


const FavoriteScreen = () => {
  const {top} = useSafeAreaInsets();
  const {getTranslation} = useLanguage();
  const theme = useAppTheme();

  const [isOpen, setIsOpen] = useState(false);
  const [isOpenDel, setIsOpenDel] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null,
  );

  const dispatch = useAppDispatch();
  const {listFavorite} = useAppSelector(state => state.favorite);
  const {token} = useAppSelector(state => state.auth);

  console.log('listFavorite:', listFavorite);

  useEffect(() => {
    dispatch(fetchFavorites());
  }, []);
  // useEffect(() => {}, [listFavorite]);

  const showAlert = () => {
    Alert.alert(
      getTranslation('thong_bao'),
      getTranslation('xoa_toan_bo'),
      [
        {
          text: getTranslation('huy'),
          onPress: () => console.log('Đã huỷ'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            dispatch(clearFavorites());
            Toast.show({
              type: 'notification', // Có thể là 'success', 'error', 'info'
              position: 'top',
              text1: 'Thành công',
              text2: 'Tất cả sản phẩm đã xoá khỏi yêu thích',
              visibilityTime: 1000, // số giây hiển thị Toast
              autoHide: true,
              swipeable: true,
            });
            // setIsOpenDel(false);
          },
        },
      ],
      {cancelable: true},
    );
  };


  const handleDelFavorite = () => {
    if (selectedProductId) {
      dispatch(deleteFavorite(selectedProductId));
      Toast.show({
        type: 'notification', // Có thể là 'success', 'error', 'info'
        position: 'top',
        text1: 'Thành công',
        text2: 'Đã xoá sản phẩm khỏi yêu thích',
        visibilityTime: 1000, // số giây hiển thị Toast
        autoHide: true,
        swipeable: true,
      });
      setIsOpen(false);
    }
  };

  return (
    <ContainerView
      containerStyle={{
        backgroundColor: theme.background,
        paddingTop: top,
      }}>
      <Header
        visibleLeft
        label={getTranslation('ua_thich')}
        paddingTop={top}
        backgroundColor={theme.background}
        textColor={theme.text}
        right={
          <TouchIcon
            size={25}
            icon={IconSRC.icon_delete}
            color={colors.red}
            containerStyle={{marginRight: 8}}
            onPress={() => {
              setIsOpenDel(true);
              showAlert();
            }}
          />
        }
      />

      <FlatList
        data={dataProduct}
        keyExtractor={item => item.id + 'acs'}
        renderItem={({item}) => (
          <FavoriteItem
            name={item.name}
            price={item.price}
            image={item.image}
            onPress={() => {}}
            onPressAdd={() => {}}
            onPressIcon={() => setIsOpen(true)}
            
          />
        )}
        contentContainerStyle={{paddingBottom: 20}}
        style={{backgroundColor: theme.background}}
        showsVerticalScrollIndicator={false}
      />

      <Toast config={configToast} />
      {!token ? (
        <Block flex1 alignCT justifyCT>
          <Image
            source={IconSRC.icon_search_nolist}
            style={styles.icon_nolist}
          />
          <TextMedium color={colors.gray3}>Hãy đăng nhập để sử dụng</TextMedium>
          <ButtonBase
            containerStyle={styles.btn_mua}
            size={14}
            title={'Đăng nhập'}
            onPress={() => {
              navigation.navigate(ScreenName.Auth.AuthStack, {
                screen: ScreenName.Auth.Login,
                params: {
                  nameScreen: '',
                },
              });
            }}
          />
        </Block>
      ) : listFavorite.length === 0 ? (
        <Block flex1 alignCT justifyCT>
          <Image
            source={IconSRC.icon_search_nolist}
            style={styles.icon_nolist}
          />
          <TextMedium color={colors.gray3}>
            Bạn chưa có sản phẩm yêu thích nào
          </TextMedium>
          <ButtonBase
            containerStyle={styles.btn_mua}
            size={14}
            title={'Mua ngay'}
            onPress={() => {
              navigation.jumpTo(ScreenName.Main.Home);
            }}
          />
        </Block>
      ) : (
        <FlatList
          data={listFavorite}
          keyExtractor={item => item._id + 'acs'}
          renderItem={({item}) => {
            return (
              <FavoriteItem
                name={item.name}
                price={item.price}
                image={item.variants?.[0]?.image || ''}
                onPress={() => {}}
                onPressAdd={() => {}}
                onPressIcon={() => {
                  setSelectedProductId(item._id);
                  setIsOpen(true);
                }}
              />
            );
          }}
          contentContainerStyle={{paddingBottom: 20}}
          showsVerticalScrollIndicator={false}
        />
      )}

      <ModalBottom
        header
        label={getTranslation('tuy_chon')}
        visible={isOpen}
        animationType="fade"
        onClose={() => setIsOpen(false)}
        heightModal={metrics.diviceHeight * 0.35}
        children={
          <Block padH={metrics.space}>
            <ButtonOption
              iconLeft={IconSRC.icon_cart1}
              iconRight={null}
              sizeLeft={20}
              borderColor={colors.white30}
              containerStyle={{paddingVertical: 20}}
              name={getTranslation('them_vao_gio_hang')}
              onPress={() => {}}
            />
            <ButtonOption
              iconLeft={IconSRC.icon_delete}
              iconRight={null}
              sizeLeft={20}
              borderColor={colors.white30}
              containerStyle={{paddingVertical: 20}}
              name={getTranslation('xoa_yeu_thich')}
              onPress={() => {
                handleDelFavorite();
              }}
            />
          </Block>
        }
      />
    </ContainerView>
  );
};

export default FavoriteScreen;

const styles = StyleSheet.create({
  icon_nolist: {
    tintColor: colors.gray3,
    marginBottom: 10,
  },
  btn_mua: {
    marginTop: 35,
    width: 160,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
