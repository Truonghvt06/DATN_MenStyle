import {Alert, FlatList, StyleSheet, Text, View} from 'react-native';
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

const FavoriteScreen = () => {
  const {top} = useSafeAreaInsets();
  const {getTranslation} = useLanguage();

  const [isOpen, setIsOpen] = useState(false);
  const [isOpenDel, setIsOpenDel] = useState(false);

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
          onPress: () => console.log('Đã nhấn OK'),
        },
      ],
      {cancelable: true},
    );
  };
  return (
    <ContainerView>
      <Header
        visibleLeft
        label={getTranslation('ua_thich')}
        paddingTop={top}
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
        renderItem={({item}) => {
          return (
            <FavoriteItem
              name={item.name}
              price={item.price}
              image={item.image}
              onPress={() => {}}
              onPressAdd={() => {}}
              onPressIcon={() => setIsOpen(true)}
            />
          );
        }}
        contentContainerStyle={{paddingBottom: 20}}
        showsVerticalScrollIndicator={false}
      />
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
              onPress={() => {}}
            />
          </Block>
        }
      />
      {/* <ModalCenter
        visible={isOpenDel}
        animationType="fade"
        heightModal={metrics.diviceHeight * 0.3}
        widthModal={metrics.diviceWidth * 0.8}
        onClose={() => setIsOpenDel(false)}
      /> */}
    </ContainerView>
  );
};

export default FavoriteScreen;

const styles = StyleSheet.create({});
