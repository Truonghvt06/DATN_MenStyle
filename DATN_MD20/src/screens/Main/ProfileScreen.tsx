import {Alert, Image, ScrollView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ContainerView from '../../components/layout/ContainerView';
import Header from '../../components/dataDisplay/Header';
import Block from '../../components/layout/Block';
import {IconSRC, ImgSRC} from '../../constants/icons';
import {TextHeight, TextSizeCustom} from '../../components/dataEntry/TextBase';
import ButtonOption from '../../components/dataEntry/Button/BottonOption';
import {colors} from '../../themes/colors';
import ButtonBase from '../../components/dataEntry/Button/ButtonBase';
import navigation from '../../navigation/navigation';
import ScreenName from '../../navigation/ScreenName';
import {useRoute} from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import useLanguage from '../../hooks/useLanguage';
import {logout} from '../../redux/reducers/auth';
import { useAppTheme } from '../../themes/ThemeContext';

const ProfileScreen = () => {
  const {top} = useSafeAreaInsets();
  const {getTranslation} = useLanguage();
  const language = useAppSelector(state => state.application.lang.label);
  const theme = useAppTheme();
  const dispatch = useAppDispatch();
  const {user, token} = useAppSelector(state => state.auth);

  return (
    <ContainerView style={{flex: 1, backgroundColor: theme.background}}>
      <Header
        visibleLeft
        label={getTranslation('tai_khoan')}
        paddingTop={top}
        backgroundColor={theme.background}
          labelColor={theme.text}
          iconColor={theme.text}
      />
      <ScrollView
        style={{flex: 1, backgroundColor: theme.background}} // Thêm dòng này
        contentContainerStyle={{paddingHorizontal: 8, paddingBottom: 20}}
        showsVerticalScrollIndicator={false}
      >
        {token ? (
          <Block alignCT marT={16} marB={50}>
            <Image
              style={styles.avatar}
              source={user?.avatar ? {uri: user.avatar} : ImgSRC.img_avatar}
            />
            <TextSizeCustom size={20} bold style={{color: theme.text}}>
              {user?.name}
            </TextSizeCustom>
          </Block>
        ) : (
          <Block alignCT padV={20}>
            <Image style={styles.avatar} source={ImgSRC.img_avatar} />
            <Block row padT={20} alignCT>
              <ButtonBase
                title={getTranslation('dang_nhap')}
                size={14}
                containerStyle={{height: 38, width: 160, marginRight: 20}}
                onPress={() =>
                  navigation.navigate(ScreenName.Auth.AuthStack, {
                    screen: ScreenName.Auth.Login,
                    params: {
                      nameScreen: '',
                    },
                  })
                }
              />
              <ButtonBase
                title={getTranslation('dang_ky')}
                size={14}
                containerStyle={{height: 38, width: 160}}
                onPress={() =>
                  navigation.navigate(ScreenName.Auth.AuthStack, {
                    screen: ScreenName.Auth.Register,
                    params: {
                      nameScreen: '',
                    },
                  })
                }
              />
            </Block>
          </Block>
        )}
        {token && (
          <>
            <TextHeight bold style={{color: theme.text}}>{getTranslation('tai_khoan1')}</TextHeight>
            <Block w100 borderWidth={0.5} borderColor={colors.gray3} marV={5} />
            <ButtonOption
              name={getTranslation('thong_tin_ca_nhan')}
              content={getTranslation('thay_doi_thong_tin')}
              iconLeft={IconSRC.icon_user}
              sizeLeft={25}
              borderBottom={0}
              containerStyle={{paddingBottom: -12, paddingTop: 5}}
              onPress={() => navigation.navigate(ScreenName.Main.Information)}
              textColor={theme.text}
            />
            <ButtonOption
              name={getTranslation('don_hang')}
              content={getTranslation('xem_don_hang')}
              iconLeft={IconSRC.icon_order}
              sizeLeft={25}
              borderBottom={0}
              containerStyle={{paddingBottom: -12, paddingTop: 5}}
              onPress={() => navigation.navigate(ScreenName.Main.Orders)}
              textColor={theme.text}
            />
            <ButtonOption
              name={getTranslation('dia_chi')}
              content={getTranslation('ql_dia_chi')}
              iconLeft={IconSRC.icon_address}
              sizeLeft={25}
              borderBottom={0}
              containerStyle={{paddingBottom: -12, marginBottom: 30}}
              onPress={() => navigation.navigate(ScreenName.Main.Address)}
              textColor={theme.text}
            />
          </>
        )}

        <TextHeight bold style={{color: theme.text}}>{getTranslation('khac')}</TextHeight>
        <Block w100 borderWidth={0.5} borderColor={colors.gray3} marV={5} />
        <ButtonOption
          name={getTranslation('ma_giam_gia')}
          content={getTranslation('kho_ma_giam_gia')}
          iconLeft={IconSRC.icon_voucher}
          sizeLeft={25}
          borderBottom={0}
          containerStyle={{paddingBottom: -12, paddingTop: 5}}
          textColor={theme.text}
        />
        <ButtonOption
          name={getTranslation('ngon_ngu')}
          content={language}
          iconLeft={IconSRC.icon_language}
          sizeLeft={25}
          borderBottom={0}
          containerStyle={{paddingBottom: -12, paddingTop: 5}}
          onPress={() => navigation.navigate(ScreenName.Main.Language)}
          textColor={theme.text}        
        />
        <ButtonOption
          name="Chủ đề"
          content="Thay đổi màu sắc"
          iconLeft={IconSRC.icon_theme}
          sizeLeft={25}
          borderBottom={0}
          containerStyle={{paddingBottom: -12, paddingTop: 5, marginBottom: 30}}
          onPress={() => navigation.navigate(ScreenName.Main.Theme)}
          textColor={theme.text}
        />

        <TextHeight bold style={{color: theme.text}}>{getTranslation('chinh_sach_dieu_khoan')}</TextHeight>
        <Block w100 borderWidth={0.5} borderColor={colors.gray3} marV={5} />
        <ButtonOption
          name={getTranslation('dieu_khoan_dieu_kien')}
          content={getTranslation('dieu_khoan_dieu_kien_')}
          iconLeft={IconSRC.icon_terms}
          sizeLeft={25}
          borderBottom={0}
          containerStyle={{paddingBottom: -12, paddingTop: 5}}
          onPress={() => navigation.navigate('DieuKhoan')}
          textColor={theme.text}
        />
        <ButtonOption
          name={getTranslation('chinh_sach_rieng_tu')}
          content={getTranslation('chinh_sach_rieng_tu_')}
          iconLeft={IconSRC.icon_policy}
          sizeLeft={25}
          borderBottom={0}
          containerStyle={{paddingBottom: -12, paddingTop: 5, marginBottom: 30}}
          onPress={() => navigation.navigate('ChinhSach')}
          textColor={theme.text}
        />
        <TextHeight bold style={{color: theme.text}}>{getTranslation('ho_tro')}</TextHeight>
        <Block w100 borderWidth={0.5} borderColor={colors.gray3} marV={5} />
        <ButtonOption
          name={getTranslation('lien_he')}
          content="0986868686"
          iconLeft={IconSRC.icon_contact}
          sizeLeft={25}
          borderBottom={0}
          containerStyle={{paddingBottom: -12, paddingTop: 5}}
          textColor={theme.text}
        />
        <ButtonOption
          name={getTranslation('email')}
          content="admin@gmail.con"
          iconLeft={IconSRC.icon_email}
          sizeLeft={25}
          borderBottom={0}
          containerStyle={{paddingBottom: -12, paddingTop: 5}}
          textColor={theme.text}
        />
        {token && (
          <ButtonBase
            title={getTranslation('dang_xuat')}
            containerStyle={styles.btnLogout}
            size={14}
            icon={IconSRC.icon_logout}
            colorIcon={colors.while}
            onPress={() => {
              Alert.alert(
                getTranslation('thong_bao'),
                getTranslation('thong_bao_dang_xuat'),
                [
                  {text: getTranslation('huy'), style: 'cancel'},
                  {
                    text: 'OK',
                    onPress: () => {
                      dispatch(logout());
                      navigation.reset(ScreenName.Main.MainStack);
                    },
                  },
                ],
                {cancelable: true},
              );
            }}
          />
        )}
      </ScrollView>
    </ContainerView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 5,
  },
  btnLogout: {
    marginTop: 30,
    width: '70%',
    alignSelf: 'center',
  },
});
