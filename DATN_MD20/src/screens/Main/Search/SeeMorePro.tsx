import {StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import ContainerView from '../../../components/layout/ContainerView';
import Header from '../../../components/dataDisplay/Header';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import useLanguage from '../../../hooks/useLanguage';
import {useAppTheme} from '../../../themes/ThemeContext';
import {useRoute} from '@react-navigation/native';
import ListProduct from '../../../components/dataDisplay/ListProduct';
import {useAppDispatch, useAppSelector} from '../../../redux/store';
import navigation from '../../../navigation/navigation';
import ScreenName from '../../../navigation/ScreenName';
import {fetchFavorites, toggleFavorite} from '../../../redux/actions/favorite';
import ModalCenter from '../../../components/dataDisplay/Modal/ModalCenter';

const SeeMorePro = () => {
  const {top} = useSafeAreaInsets();
  const {getTranslation} = useLanguage();
  const theme = useAppTheme();
  const route = useRoute<any>();
  const {title, data} = route.params || {};

  const [isOpenCheck, setIsOpenCheck] = useState(false);

  const dispatch = useAppDispatch();
  const {token} = useAppSelector(state => state.auth);
  const {listFavoriteIds} = useAppSelector(state => state.favorite);

  const handleFavorite = async (productId: string) => {
    await dispatch(toggleFavorite(productId));
    dispatch(fetchFavorites());
  };
  const handleLogin = () => {
    setIsOpenCheck(false);

    navigation.navigate(ScreenName.Auth.AuthStack, {
      screen: ScreenName.Auth.Login,
      params: {
        nameScreen: '',
      },
    });
  };
  const handleSearch = () => {
    navigation.navigate(ScreenName.Main.SearchDetailScreen);
  };

  const handleProDetail = (id: string) => {
    navigation.navigate(ScreenName.Main.ProductDetail, {id});
  };
  return (
    <ContainerView>
      <Header label={title} paddingTop={top} />

      <ListProduct
        data={data}
        isColums
        columNumber={2}
        favoriteId={listFavoriteIds}
        onPress={id => {
          handleProDetail(id);
        }}
        onPressFavorite={id =>
          token ? handleFavorite(id) : setIsOpenCheck(true)
        }
      />

      <ModalCenter
        visible={isOpenCheck}
        content={'Hãy đăng nhập để sử dụng'}
        onClose={() => setIsOpenCheck(false)}
        onPress={() => {
          handleLogin();
        }}
      />
    </ContainerView>
  );
};

export default SeeMorePro;

const styles = StyleSheet.create({});
