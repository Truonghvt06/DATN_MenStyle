import {Alert, Image, ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
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
import {useAppDispatch, useAppSelector} from '../../redux/hooks';
import useLanguage from '../../hooks/useLanguage';
import {logout} from '../../redux/reducers/auth';
import {useAppTheme} from '../../themes/ThemeContext';
import ModalCenter from '../../components/dataDisplay/Modal/ModalCenter';
import {clearFavorites} from '../../redux/actions/favorite';
import {clearFavorite} from '../../redux/reducers/favorite';

const ProfileScreen = () => {
  const {top} = useSafeAreaInsets();
  const {getTranslation} = useLanguage();
  const language = useAppSelector(state => state.application.lang.label);
  const theme = useAppTheme();
  const dispatch = useAppDispatch();
  const {user, token} = useAppSelector(state => state.auth);
  const [isOpenLogout, setisOpenLogout] = useState(false);

  return (
    <ContainerView>
      <Header
        visibleLeft
        label={getTranslation('tai_khoan')}
        paddingTop={top}
      />
      <ScrollView
        // Thêm dòng này
        contentContainerStyle={{paddingHorizontal: 8, paddingBottom: 20}}
        showsVerticalScrollIndicator={false}>
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
            <TextHeight bold style={{color: theme.text}}>
              {getTranslation('tai_khoan1')}
            </TextHeight>
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
              containerStyle={{paddingBottom: -12, paddingTop: 5}}
              onPress={() => navigation.navigate(ScreenName.Main.Address)}
              textColor={theme.text}
            />
            <ButtonOption
              name={getTranslation('danh_gia')}
              content={getTranslation('ql_danh_gia')}
              iconLeft={IconSRC.icon_review}
              sizeLeft={25}
              borderBottom={0}
              containerStyle={{paddingBottom: -12, paddingTop: 5}}
              onPress={() =>
                navigation.navigate(ScreenName.Main.ManageReviewScreen)
              }
              textColor={theme.text}
            />
            <ButtonOption
              name={getTranslation('doi_mat_khau')}
              content={getTranslation('thay_mat_khau')}
              iconLeft={IconSRC.icon_change_pass}
              sizeLeft={22}
              borderBottom={0}
              containerStyle={{
                paddingBottom: -12,
                marginBottom: 30,
                paddingTop: 5,
              }}
              onPress={() =>
                navigation.navigate(ScreenName.Main.ChangePassword)
              }
              textColor={theme.text}
            />
          </>
        )}

        <TextHeight bold style={{color: theme.text}}>
          {getTranslation('khac')}
        </TextHeight>
        <Block w100 borderWidth={0.5} borderColor={colors.gray3} marV={5} />
        <ButtonOption
          name={getTranslation('ma_giam_gia')}
          content={getTranslation('kho_ma_giam_gia')}
          iconLeft={IconSRC.icon_voucher}
          sizeLeft={25}
          borderBottom={0}
          containerStyle={{paddingBottom: -12, paddingTop: 5}}
          textColor={theme.text}
          onPress={() => navigation.navigate(ScreenName.Main.Voucher)}
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
          name={getTranslation('chu_de')}
          content={getTranslation('thay_doi_chu_de')}
          iconLeft={IconSRC.icon_theme}
          sizeLeft={25}
          borderBottom={0}
          containerStyle={{paddingBottom: -12, paddingTop: 5, marginBottom: 30}}
          onPress={() => navigation.navigate(ScreenName.Main.Theme)}
          textColor={theme.text}
        />

        <TextHeight bold style={{color: theme.text}}>
          {getTranslation('chinh_sach_dieu_khoan')}
        </TextHeight>
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
        <TextHeight bold style={{color: theme.text}}>
          {getTranslation('ho_tro')}
        </TextHeight>
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
              setisOpenLogout(true);
            }}
          />
        )}
      </ScrollView>
      <ModalCenter
        visible={isOpenLogout}
        content={getTranslation('thong_bao_dang_xuat')}
        onClose={() => setisOpenLogout(false)}
        onPress={() => {
          setisOpenLogout(false);
          dispatch(logout());
          dispatch(clearFavorite());
          navigation.reset(ScreenName.Main.MainStack);
        }}
      />
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
