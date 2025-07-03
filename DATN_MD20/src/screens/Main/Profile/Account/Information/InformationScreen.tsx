import {
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import {IconSRC, ImgSRC} from '../../../../../constants/icons'; // Đảm bảo đường dẫn đúng
import {colors} from '../../../../../themes/colors';
import ContainerView from '../../../../../components/layout/ContainerView';
import Header from '../../../../../components/dataDisplay/Header';
import useLanguage from '../../../../../hooks/useLanguage';
import {TextSizeCustom} from '../../../../../components/dataEntry/TextBase';
import TouchIcon from '../../../../../components/dataEntry/Button/TouchIcon';
import Block from '../../../../../components/layout/Block';
import ButtonBase from '../../../../../components/dataEntry/Button/ButtonBase';
import metrics from '../../../../../constants/metrics';
import ModalBottom from '../../../../../components/dataDisplay/Modal/ModalBottom';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import {useAppDispatch, useAppSelector} from '../../../../../redux/store';
import {ProfileState} from '../../../../../services/auth';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import InputPlace from '../../../../../components/dataEntry/Input/InputPlace';
import {
  updateUserAvatar,
  updateUserProfile,
} from '../../../../../redux/actions/auth';
import ButtonLoading from '../../../../../components/dataEntry/Button/ButtonLoading';
import navigation from '../../../../../navigation/navigation';
import {launchImageLibrary, Asset} from 'react-native-image-picker';

const InformationScreen = () => {
  const {top} = useSafeAreaInsets();
  const {getTranslation} = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [localAvatar, setLocalAvatar] = useState<Asset | null>(null);

  const [dataUser, setDataUser] = useState<ProfileState>({
    name: '',
    gender: '',
    date_of_birth: '',
    phone: '',
    email: '',
  });

  const genders = ['Nam', 'Nữ', 'Khác'];

  const dispatch = useAppDispatch();
  const {user, loading} = useAppSelector(state => state.auth);

  const isChanged = useMemo(() => {
    if (!user) return false;
    const current = {
      name: dataUser.name,
      phone: dataUser.phone,
      email: dataUser.email,
      gender: dataUser.gender,
      date_of_birth: dataUser.date_of_birth,
    };
    const original = {
      name: user.name,
      phone: user.phone,
      email: user.email,
      gender: user.gender,
      date_of_birth: user.date_of_birth,
    };

    return JSON.stringify(current) !== JSON.stringify(original);
  }, [dataUser, user]);

  // Disable lưu
  const hasNewAvatar = !!localAvatar;
  const canSave = isChanged || hasNewAvatar;

  const handleSave = async () => {
    if (!isChanged && !localAvatar) return;

    try {
      // Gửi thông tin profile nếu có thay đổi
      if (isChanged) {
        const resultAction = await dispatch(updateUserProfile(dataUser));
        if (!updateUserProfile.fulfilled.match(resultAction)) {
          Alert.alert(getTranslation('thong_bao'), 'Cập nhật thất bại!');
          return;
        }
      }

      // Gửi avatar nếu có thay đổi
      if (localAvatar) {
        const formData = buildFormData(localAvatar);
        const result = await dispatch(updateUserAvatar(formData));
        if (!updateUserAvatar.fulfilled.match(result)) {
          Alert.alert('Lỗi', result.payload as string);
          return;
        }
      }

      Alert.alert(getTranslation('thong_bao'), 'Cập nhật thành công!');
      navigation.goBack();
    } catch (err) {
      Alert.alert('Lỗi', 'Đã xảy ra lỗi khi cập nhật');
    }
  };

  // form data
  const buildFormData = (asset: Asset) => {
    const data = new FormData();
    data.append('avatar', {
      uri:
        Platform.OS === 'android'
          ? asset.uri!
          : asset.uri!.replace('file://', ''),
      name: asset.fileName ?? `avatar.${asset.type?.split('/')[1] ?? 'jpg'}`,
      type: asset.type ?? 'image/jpeg',
    } as any);
    return data;
  };

  // chọn ảnh

  const handlePickAvatar1 = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        maxWidth: 600,
        maxHeight: 600,
        quality: 0.8,
      },
      res => {
        if (res.didCancel || res.errorCode || !res.assets?.[0]?.uri) return;
        setLocalAvatar(res.assets[0]); // chỉ set vào state
      },
    );
  };
  //   const handlePickAvatar = () => {
  //     launchImageLibrary(
  //       {
  //         mediaType: 'photo',
  //         maxWidth: 600,
  //         maxHeight: 600,
  //         quality: 0.8,
  //       },
  //       async res => {
  //         if (res.didCancel) return;
  //         if (res.errorCode) {
  //           Alert.alert('Lỗi', res.errorMessage || 'Không thể chọn ảnh');
  //           return;
  //         }
  //         const asset = res.assets?.[0];
  //         if (!asset?.uri) return;

  //         const formData = buildFormData(asset);
  //         const result = await dispatch(updateUserAvatar(formData));

  //         if (updateUserAvatar.fulfilled.match(result)) {
  //           Alert.alert('Thành công', 'Ảnh đại diện đã được cập nhật!');
  //         } else {
  //           Alert.alert('Lỗi', result.payload as string);
  //         }
  //       },
  //     );
  //   };

  useEffect(() => {
    if (user) {
      setDataUser({
        name: user.name || '',
        phone: user.phone || '',
        email: user.email || '',
        gender: user.gender || '',
        date_of_birth: user.date_of_birth || '',
      });
      setLocalAvatar(null);
    }
  }, [user]);
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
        setIsFocused(false);
      }}>
      <ContainerView>
        <Header
          label={getTranslation('thong_tin_ca_nhan')}
          paddingTop={top}
          onPressLeft={() => {
            if (canSave) {
              Alert.alert('Thông báo!', 'Có chắc muốn thoát thay đổi?', [
                {
                  text: 'Huỷ',
                  style: 'cancel',
                },
                {text: 'OK', onPress: () => navigation.goBack()},
              ]);
            } else {
              navigation.goBack();
            }
          }}
        />
        <ScrollView>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{flex: 1}}>
            <Block alignCT justifyCT h={200} backgroundColor={colors.sky_blue}>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => {
                  handlePickAvatar1();
                }}>
                <Image
                  style={styles.avatar}
                  source={
                    localAvatar?.uri
                      ? {uri: localAvatar.uri}
                      : user?.avatar
                      ? {uri: user.avatar}
                      : ImgSRC.img_avatar
                  }
                />
                <TouchIcon
                  containerStyle={styles.ic_edit}
                  icon={IconSRC.icon_edit}
                  size={28}
                  color={colors.gray1}
                  onPress={() => {
                    handlePickAvatar1();
                  }}
                />
              </TouchableOpacity>
            </Block>
            <Block pad={metrics.space}>
              <Block
                backgroundColor={colors.while}
                padH={8}
                padV={12}
                borderRadius={10}>
                <InputPlace
                  is_Focused={isFocused}
                  label={getTranslation('ho_va_ten')}
                  value={dataUser.name}
                  onChangeText={(text: string) =>
                    setDataUser({...dataUser, name: text})
                  }
                />

                <InputPlace
                  readOnly
                  is_Focused={isFocused}
                  label={getTranslation('gioi_tinh')}
                  value={dataUser.gender}
                  iconRight
                  containerView={{
                    flexDirection: 'row',
                  }}
                  onPress={() => {
                    setIsOpen(true);
                  }}
                />
                <InputPlace
                  readOnly
                  is_Focused={isFocused}
                  label={getTranslation('ngay_sinh')}
                  value={dataUser.date_of_birth}
                  iconRight
                  //   disabled={!address.province}
                  containerView={{
                    flexDirection: 'row',
                  }}
                  onPress={() => {
                    setOpen(true);
                  }}
                />
                <InputPlace
                  is_Focused={isFocused}
                  label={getTranslation('sdt')}
                  value={dataUser.phone}
                  onChangeText={(text: string) =>
                    setDataUser({...dataUser, phone: text})
                  }
                />

                <InputPlace
                  readOnly
                  is_Focused={isFocused}
                  label={getTranslation('email')}
                  value={dataUser.email}
                  onChangeText={(text: string) =>
                    setDataUser({...dataUser, email: text})
                  }
                />
              </Block>
            </Block>
          </KeyboardAvoidingView>
        </ScrollView>

        <Block containerStyle={styles.btn}>
          <ButtonLoading
            title={getTranslation('luu')}
            loading={loading}
            disabled={!canSave || loading}
            onPress={handleSave}
          />
        </Block>
        {/* Ngoài  */}

        {/* Ngày sinh  */}
        {Platform.OS === 'android' ? (
          open && (
            <DateTimePicker
              value={date}
              mode="date"
              display="spinner" // hoặc 'default', 'compact' tùy bạn muốn
              maximumDate={new Date()}
              style={{borderRadius: 10}}
              onChange={(event, selectedDate) => {
                setOpen(false);
                if (event.type === 'set' && selectedDate) {
                  setDate(selectedDate);
                  // setValueDate(moment(selectedDate).format('DD/MM/YYYY'));
                  setDataUser({
                    ...dataUser,
                    date_of_birth: moment(selectedDate).format('DD/MM/YYYY'),
                  });
                }
              }}
            />
          )
        ) : (
          <ModalBottom
            visible={open}
            header
            label={getTranslation('chon_ngay')}
            heightModal={400}
            onClose={() => setOpen(false)}
            containerStyle={{
              backgroundColor: colors.while,
            }}
            children={
              <>
                <Block alignCT>
                  <DateTimePicker
                    value={date}
                    mode="date"
                    display="spinner"
                    maximumDate={new Date()}
                    onChange={(event, selectedDate) => {
                      if (selectedDate) {
                        setDate(selectedDate);
                      }
                    }}
                    style={{backgroundColor: 'white'}}
                  />
                </Block>

                <Block
                  row
                  justifyContent="flex-end"
                  padH={16}
                  padT={20}
                  borderTopW={0.3}
                  borderColor={colors.gray1}>
                  <TouchIcon
                    title={getTranslation('xac_nhan')}
                    titleStyle={styles.comfor}
                    onPress={() => {
                      setDate(date);
                      setDataUser({
                        ...dataUser,
                        date_of_birth: moment(date).format('DD/MM/YYYY'),
                      });
                      setOpen(false);
                    }}
                  />
                </Block>
              </>
            }
          />
        )}

        {/* Giới tính  */}
        <ModalBottom
          visible={isOpen}
          header
          label={getTranslation('tuy_chon')}
          heightModal={300}
          onClose={() => setIsOpen(false)}
          children={
            <>
              <ScrollView>
                {genders.map(gender => (
                  <TouchableOpacity
                    activeOpacity={0.6}
                    key={gender}
                    style={styles.item}
                    onPress={() => {
                      setDataUser({...dataUser, gender: gender});
                      setIsOpen(false);
                    }}>
                    <TextSizeCustom size={16}>{gender}</TextSizeCustom>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </>
          }
        />
      </ContainerView>
    </TouchableWithoutFeedback>
  );
};

export default InformationScreen;

const styles = StyleSheet.create({
  comfor: {
    textTransform: 'uppercase',
    paddingHorizontal: 20,
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.black,
  },
  xong: {
    alignItems: 'flex-end',
    marginRight: 20,
  },
  ic_edit: {
    flex: 1,
    position: 'absolute',
    bottom: 3,
    right: 3,
  },

  btn: {
    // position: 'absolute',
    // bottom: 35,
    // left: 8,
    paddingHorizontal: 8,
    paddingBottom: 35,
  },

  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 5,
    backgroundColor: '#eee',
  },
  item: {
    paddingVertical: 15,
    paddingHorizontal: 8,
    borderBottomWidth: 0.3,
    borderColor: colors.gray1,
    alignItems: 'center',
  },
});
