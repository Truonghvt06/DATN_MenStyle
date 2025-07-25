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
import {IconSRC, ImgSRC} from '../../../../../constants/icons';
import ContainerView from '../../../../../components/layout/ContainerView';
import Header from '../../../../../components/dataDisplay/Header';
import useLanguage from '../../../../../hooks/useLanguage';
import {
  TextMedium,
  TextSizeCustom,
} from '../../../../../components/dataEntry/TextBase';
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
import Toast from 'react-native-toast-message';
import configToast from '../../../../../components/utils/configToast';
import {useAppTheme} from '../../../../../themes/ThemeContext';
import ModalCenter from '../../../../../components/dataDisplay/Modal/ModalCenter';

const InformationScreen = () => {
  const {top} = useSafeAreaInsets();
  const {getTranslation} = useLanguage();
  const theme = useAppTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isOpenBack, setIsOpenBack] = useState(false);
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
  const {user, loading, token} = useAppSelector(state => state.auth);

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

  const hasNewAvatar = !!localAvatar;
  const canSave = isChanged || hasNewAvatar;

  const handleSave = async () => {
    if (!isChanged && !localAvatar) return;
    try {
      if (isChanged) {
        const resultAction = await dispatch(updateUserProfile(dataUser));
        if (!updateUserProfile.fulfilled.match(resultAction)) {
          Alert.alert(getTranslation('thong_bao'), 'Cập nhật thất bại!');
          return;
        }
      }
      if (localAvatar) {
        const formData = buildFormData(localAvatar);
        const result = await dispatch(updateUserAvatar(formData));
        if (!updateUserAvatar.fulfilled.match(result)) {
          Alert.alert('Lỗi', result.payload as string);
          return;
        }
      }
      Toast.show({
        type: 'notification',
        position: 'top',
        text1: 'Thành công',
        text2: 'Cập thật thông tin thành công',
        visibilityTime: 1500,
        autoHide: true,
        swipeable: true,
      });
      navigation.goBack();
    } catch (err) {
      Alert.alert('Lỗi', 'Đã xảy ra lỗi khi cập nhật');
    }
  };

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
        setLocalAvatar(res.assets[0]);
      },
    );
  };

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
              setIsOpenBack(true);
            } else {
              navigation.goBack();
            }
          }}
          backgroundColor={theme.background}
          labelColor={theme.text}
          iconColor={theme.text}
        />
        {/* MODAL BACK  */}
        <ModalCenter
          visible={isOpenBack}
          content={'Có chắc muốn thoát thay đổi?'}
          onClose={() => setIsOpenBack(false)}
          onPress={() => {
            setIsOpenBack(false);
            navigation.goBack();
          }}
        />

        {/* <Toast config={configToast} /> */}
        <ScrollView>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{flex: 1}}>
            <Block alignCT justifyCT h={200} backgroundColor={'#0099FF'}>
              <TouchableOpacity activeOpacity={0.9} onPress={handlePickAvatar1}>
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
                  onPress={handlePickAvatar1}
                />
              </TouchableOpacity>
            </Block>

            <Block pad={metrics.space}>
              <Block padH={8} padV={12} borderRadius={10}>
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
                  containerView={{flexDirection: 'row'}}
                  onPress={() => setIsOpen(true)}
                />
                <InputPlace
                  readOnly
                  is_Focused={isFocused}
                  label={getTranslation('ngay_sinh')}
                  value={dataUser.date_of_birth}
                  iconRight
                  containerView={{flexDirection: 'row'}}
                  onPress={() => setOpen(true)}
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

        {Platform.OS === 'android' ? (
          open && (
            <DateTimePicker
              value={date}
              mode="date"
              display="spinner"
              maximumDate={new Date()}
              onChange={(event, selectedDate) => {
                setOpen(false);
                if (event.type === 'set' && selectedDate) {
                  setDate(selectedDate);
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
            onClose={() => setOpen(false)}>
            <Block alignCT>
              <DateTimePicker
                textColor={theme.text}
                value={date}
                mode="date"
                display="spinner"
                maximumDate={new Date()}
                onChange={(event, selectedDate) => {
                  if (selectedDate) setDate(selectedDate);
                }}
              />
            </Block>
            <Block
              row
              justifyContent="flex-end"
              padH={16}
              padT={20}
              borderTopW={0.3}
              borderColor={theme.border_color}>
              <TouchIcon
                title={getTranslation('xac_nhan')}
                titleStyle={styles.comfor}
                onPress={() => {
                  setDataUser({
                    ...dataUser,
                    date_of_birth: moment(date).format('DD/MM/YYYY'),
                  });
                  setOpen(false);
                }}
              />
            </Block>
          </ModalBottom>
        )}

        <ModalBottom
          visible={isOpen}
          header
          label={getTranslation('tuy_chon')}
          heightModal={300}
          onClose={() => setIsOpen(false)}>
          <ScrollView>
            {genders.map(gender => (
              <TouchableOpacity
                key={gender}
                activeOpacity={0.6}
                style={styles.item}
                onPress={() => {
                  setDataUser({...dataUser, gender});
                  setIsOpen(false);
                }}>
                <TextSizeCustom size={16} color={theme.text}>
                  {gender}
                </TextSizeCustom>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </ModalBottom>
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
  },
  xong: {
    alignItems: 'flex-end',
    marginRight: 20,
  },
  ic_edit: {
    position: 'absolute',
    bottom: 3,
    right: 3,
  },
  btn: {
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
    // borderColor: theme.border,
    alignItems: 'center',
  },
});
