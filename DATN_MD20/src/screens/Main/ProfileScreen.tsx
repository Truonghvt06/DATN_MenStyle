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

const ProfileScreen = () => {
  const {top} = useSafeAreaInsets();

  return (
    <ContainerView>
      <Header visibleLeft label="Tài khoản" paddingTop={top} />
      <ScrollView
        contentContainerStyle={{paddingHorizontal: 8, paddingBottom: 20}}>
        <Block alignCT marT={16} marB={50}>
          <Image style={styles.avatar} source={ImgSRC.img_avatar} />
          <TextSizeCustom size={20} bold>
            Nguyễn Văn A
          </TextSizeCustom>
        </Block>
        <TextHeight bold>Tài Khoản</TextHeight>
        <Block w100 borderWidth={0.5} borderColor={colors.gray3} marV={5} />
        <ButtonOption
          name="Thông tin cá nhân"
          content="Thay đổi thông tin cá nhân"
          iconLeft={IconSRC.icon_user}
          sizeLeft={25}
          borderBottom={0}
          containerStyle={{paddingBottom: -12, paddingTop: 5}}
        />
        <ButtonOption
          name="Đơn hàng"
          content="Xem lịch sử đơn hàng"
          iconLeft={IconSRC.icon_order}
          sizeLeft={25}
          borderBottom={0}
          containerStyle={{paddingBottom: -12, paddingTop: 5}}
        />
        <ButtonOption
          name="Ưa thích"
          content="Sản phẩm đã lưu"
          iconLeft={IconSRC.icon_favorite}
          sizeLeft={25}
          borderBottom={0}
          containerStyle={{paddingBottom: -12, paddingTop: 5}}
        />
        <ButtonOption
          name="Địa chỉ"
          content="Quản lý địa chỉ giao hàng"
          iconLeft={IconSRC.icon_address}
          sizeLeft={25}
          borderBottom={0}
          containerStyle={{paddingBottom: -12, marginBottom: 30}}
          onPress={() => navigation.navigate(ScreenName.Main.Address)}
        />

        <TextHeight bold>Khác</TextHeight>
        <Block w100 borderWidth={0.5} borderColor={colors.gray3} marV={5} />
        <ButtonOption
          name="Voucher"
          content="Kho quà giảm giá"
          iconLeft={IconSRC.icon_voucher}
          sizeLeft={25}
          borderBottom={0}
          containerStyle={{paddingBottom: -12, paddingTop: 5}}
        />
        <ButtonOption
          name="Ngôn ngữ"
          content="Thay đổi ngôn ngữ"
          iconLeft={IconSRC.icon_language}
          sizeLeft={25}
          borderBottom={0}
          containerStyle={{paddingBottom: -12, paddingTop: 5}}
        />
        <ButtonOption
          name="Chủ đề"
          content="Thay đổi màu sắc"
          iconLeft={IconSRC.icon_theme}
          sizeLeft={25}
          borderBottom={0}
          containerStyle={{paddingBottom: -12, paddingTop: 5, marginBottom: 30}}
        />

        <TextHeight bold>Chính Sách & Điều khoản</TextHeight>
        <Block w100 borderWidth={0.5} borderColor={colors.gray3} marV={5} />
        <ButtonOption
          name="Điều khoản & Điều kiện"
          content="Điều khoản và diều kiện của MenStyle"
          iconLeft={IconSRC.icon_terms}
          sizeLeft={25}
          borderBottom={0}
          containerStyle={{paddingBottom: -12, paddingTop: 5}}
        />
        <ButtonOption
          name="Chính sách quyền riêng tư"
          content="Chính sánh về quyền riêng tư "
          iconLeft={IconSRC.icon_policy}
          sizeLeft={25}
          borderBottom={0}
          containerStyle={{paddingBottom: -12, paddingTop: 5, marginBottom: 30}}
        />
        <TextHeight bold>Hỗ Trợ</TextHeight>
        <Block w100 borderWidth={0.5} borderColor={colors.gray3} marV={5} />
        <ButtonOption
          name="Liên hệ"
          content="0986868686"
          iconLeft={IconSRC.icon_contact}
          sizeLeft={25}
          borderBottom={0}
          containerStyle={{paddingBottom: -12, paddingTop: 5}}
        />
        <ButtonOption
          name="Email"
          content="admin@gmail.con"
          iconLeft={IconSRC.icon_email}
          sizeLeft={25}
          borderBottom={0}
          containerStyle={{paddingBottom: -12, paddingTop: 5}}
        />
        <ButtonBase
          title="Đăng xuất"
          containerStyle={styles.btnLogout}
          size={14}
          icon={IconSRC.icon_logout}
          colorIcon={colors.while}
          onPress={() => {
            Alert.alert(
              'Đăng xuất',
              'Bạn có chắc chắn muốn đăng xuất?',
              [
                {text: 'Huỷ', style: 'cancel'},
                {
                  text: 'Đồng ý',
                  onPress: () => navigation.reset(ScreenName.Auth.AuthStack),
                },
              ],
              {cancelable: true},
            );
          }}
        />
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
