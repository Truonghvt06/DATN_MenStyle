import {
  Alert,
  Keyboard,
  Platform,
  ScrollView,
  StyleSheet,

  TouchableWithoutFeedback,
} from 'react-native';
import React, {useState} from 'react';

  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import React, {createRef, useEffect, useRef, useState} from 'react';

import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ContainerView from '../../../../../components/layout/ContainerView';
import Header from '../../../../../components/dataDisplay/Header';
import Block from '../../../../../components/layout/Block';
import metrics from '../../../../../constants/metrics';
import InputPlace from '../../../../../components/dataEntry/Input/InputPlace';
import {KeyboardAvoidingView} from 'react-native';

import {TextMedium} from '../../../../../components/dataEntry/TextBase';
import {provinces, districts, wards} from 'vietnam-provinces';
import SelectAddress from '../../../../../components/utils/SelectAddress';
import useLanguage from '../../../../../hooks/useLanguage';
import {useAppTheme} from '../../../../../themes/ThemeContext';

import {
  TextMedium,
  TextSizeCustom,
} from '../../../../../components/dataEntry/TextBase';
import {provinces, districts, wards} from 'vietnam-provinces';
import SelectAddress from '../../../../../components/utils/SelectAddress';
import useLanguage from '../../../../../hooks/useLanguage';
import {useAppDispatch, useAppSelector} from '../../../../../redux/store';
import ButtonBase from '../../../../../components/dataEntry/Button/ButtonBase';
import {
  addAddress,
  deleteAddress,
  fetchAddresses,
  updateAddress,
} from '../../../../../redux/actions/address';
import navigation from '../../../../../navigation/navigation';
import {useRoute} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import {
  formatPhoneNumber,
  normalizePhoneNumber,
} from '../../../../../utils/formatPhone';


interface IAddress {
  name: string;
  phone: string;
  province: string;
  district: string;
  ward: string;
  addres_line: string;
  is_default?: boolean;
}
interface Error {
  name?: string;
  phone?: string;
  province?: string;
  district?: string;
  ward?: string;
  addres_line?: string;
}

const AddAddress = () => {
  const {top} = useSafeAreaInsets();
  const {getTranslation} = useLanguage();

  const theme = useAppTheme();

  const route = useRoute();
  const {title, items} = route.params as {title: string; items: any};

  console.log('ADD', items?.phone);


  const [isFocused, setIsFocused] = useState(false);
  const [isSwitch, setIsSwitch] = useState(items?.is_default || false);
  const [address, setAddress] = useState<IAddress>({
    name: items?.recipient_name || '',
    phone: formatPhoneNumber(items?.phone) || '',
    province: items?.province || '',
    district: items?.district || '',
    ward: items?.ward || '',
    addres_line: items?.address_line || '',
    // is_default: items.is_default || false,
  });
  const [districtss, setDistrictss] = useState<any[]>([]);
  const [wardss, setWardss] = useState<any[]>([]);

  const [isOpenProvince, setIsOpenProvince] = useState(false);
  const [isOpenDistrict, setIsOpenDistrict] = useState(false);
  const [isOpenWard, setIsOpenWard] = useState(false);

  const [errorIp, setErrorIp] = useState<Error>({
    name: '',
    phone: '',
    province: '',
    district: '',
    ward: '',
    addres_line: '',
  });


  const [districtss, setDistrictss] = useState<any[]>([]);
  const [wardss, setWardss] = useState<any[]>([]);

  const [isOpenProvince, setIsOpenProvince] = useState(false);
  const [isOpenDistrict, setIsOpenDistrict] = useState(false);
  const [isOpenWard, setIsOpenWard] = useState(false);


  //ACTION
  const dispatch = useAppDispatch();
  const {listAddress} = useAppSelector(state => state.address);


  const getDistrictsByProvinceCode = (provinceCode: string) => {
    return districts.filter(d => d.province_code === provinceCode);
  };

  const getWardsByDistrictCode = (districtCode: string) => {
    return wards.filter(w => w.district_code === districtCode);
  };

  //VALIDATE
  const validateAddress = () => {
    const newError: Error = {};
    if (!address.name.trim()) {
      newError.name = 'Vui lòng nhập họ và tên';
    }
    if (!address.phone.trim()) {
      newError.phone = 'Vui lòng nhập số điện thoại';
    } else {
      const rawPhone = normalizePhoneNumber(address.phone);
      const isValidPhone = /^0\d{9}$/.test(rawPhone); // 10 số, bắt đầu bằng 0
      if (!isValidPhone) {
        newError.phone =
          'Số điện thoại không hợp lệ (cần 10 chữ số và bắt đầu bằng 0)';
      }
    }

    if (!address.province) {
      newError.province = 'Vui lòng chọn tỉnh/thành phố';
    }
    if (!address.district) {
      newError.district = 'Vui lòng chọn quận/huyện';
    }
    if (!address.ward) {
      newError.ward = 'Vui lòng chọn phường/xã';
    }
    if (!address.addres_line.trim()) {
      newError.addres_line = 'Vui lòng nhập tên đường, toà nhà, số nhà';
    }
    setErrorIp(newError);
    return Object.keys(newError).length === 0;
  };

  //LUU: add, update
  const handleSave = async () => {
    const normalizedPhone = normalizePhoneNumber(address.phone);
    if (!validateAddress()) return;

    const data = {
      recipient_name: address.name,
      phone: normalizedPhone,
      province: address.province,
      district: address.district,
      ward: address.ward,
      address_line: address.addres_line,
      is_default: isSwitch,
    };

    try {
      if (title === getTranslation('sua_dia_chi')) {
        await dispatch(updateAddress({id: items._id, data}));
      } else {
        await dispatch(addAddress(data)).unwrap();
      }
      await dispatch(fetchAddresses()); // cập nhật danh sách

      // Alert.alert('Thành công', 'Thêm địa chỉ mới thành công');
      navigation.goBack();
    } catch (err: any) {
      Alert.alert('Lỗi', err?.message || 'Không thể thêm địa chỉ');
    }
  };

  //Delete
  const handleDeleteAddress = async () => {
    Alert.alert(getTranslation('thong_bao'), getTranslation('xoa_dia_chi'), [
      {text: getTranslation('huy'), style: 'cancel'},
      {
        text: 'OK',
        onPress: async () => {
          await dispatch(deleteAddress(items._id));
          dispatch(fetchAddresses());
          navigation.goBack();
        },
      },
    ]);
  };

  // Kiểm tra trường dữ liệu có thây đổi
  const isAddressChanged = () => {
    return (
      address.name !== (items?.recipient_name || '') ||
      address.phone !== (items?.phone || '') ||
      address.province !== (items?.province || '') ||
      address.district !== (items?.district || '') ||
      address.ward !== (items?.ward || '') ||
      address.addres_line !== (items?.address_line || '') ||
      isSwitch !== (items?.is_default || false)
    );
  };

  // BACK
  const handleBack = () => {
    if (isAddressChanged()) {
      Alert.alert(
        getTranslation('thong_bao'),
        'Bạn có chắc muốn thoát thay đổi?',
        [
          {text: getTranslation('huy'), style: 'cancel'},
          {
            text: 'OK',
            onPress: () => {
              navigation.goBack();
            },
          },
        ],
      );
    } else {
      navigation.goBack();
    }
  };

  //Khi có items truyền sang load name lấy code
  useEffect(() => {
    if (items && items.province) {
      const selectedProvince = provinces.find(
        (p: any) => p.name === items.province,
      );
      if (selectedProvince) {
        const districtsByProvince = getDistrictsByProvinceCode(
          selectedProvince.code,
        );
        setDistrictss(districtsByProvince);

        if (items.district) {
          const selectedDistrict = districtsByProvince.find(
            (d: any) => d.name === items.district,
          );
          if (selectedDistrict) {
            const wardsByDistrict = getWardsByDistrictCode(
              selectedDistrict.code,
            );
            setWardss(wardsByDistrict);
          }
        }
      }
    }
  }, []);

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
        setIsFocused(false);
      }}>

      <ContainerView
        containerStyle={{
          backgroundColor: theme.background,
          paddingTop: top,
        }}>
        <Header
          label={getTranslation('dia_chi_moi')}
          paddingTop={top}
          backgroundColor={theme.background}
          textColor={theme.text}
        />

      <ContainerView>
        <Header label={title} paddingTop={top} onPressLeft={handleBack} />

        <ScrollView>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{flex: 1}}>
            <Block pad={metrics.space}>
              <Block
                backgroundColor={theme.card}
                padH={8}
                padV={12}
                borderRadius={10}
                shadowColor={theme.shadowColor || theme.text}>
                <TextMedium medium style={{color: theme.text}}>
                  {getTranslation('dia_chi')}
                </TextMedium>

                <InputPlace
                  is_Focused={isFocused}
                  label={getTranslation('ho_va_ten')}
                  value={address.name}
                  onChangeText={(text: string) => {
                    setAddress({...address, name: text});
                    setErrorIp({...errorIp, name: ''});
                  }}
                />
                {errorIp.name && (
                  <TextSizeCustom
                    style={{marginTop: -5, marginBottom: 5}}
                    color={colors.red}
                    size={11}>
                    {errorIp.name}
                  </TextSizeCustom>
                )}
                <InputPlace
                  is_Focused={isFocused}
                  label={getTranslation('sdt')}
                  value={address.phone}
                  onChangeText={(text: string) => {
                    setAddress({...address, phone: text});
                    setErrorIp({...errorIp, phone: ''});
                  }}
                  onBlur={() => {
                    setAddress(prev => ({
                      ...prev,
                      phone: formatPhoneNumber(prev.phone),
                    }));
                  }}
                />
                {errorIp.phone && (
                  <TextSizeCustom
                    style={{marginTop: -5, marginBottom: 5}}
                    color={colors.red}
                    size={11}>
                    {errorIp.phone}
                  </TextSizeCustom>
                )}
                <InputPlace
                  readOnly
                  is_Focused={isFocused}
                  label={getTranslation('chon_tinh')}
                  value={address.province}
                  iconRight

                  containerView={{flexDirection: 'row'}}
                  onPress={() => setIsOpenProvince(true)}

                  containerView={{
                    flexDirection: 'row',
                  }}
                  onPress={() => {
                    setIsOpenProvince(true);
                    setErrorIp({...errorIp, province: ''});
                  }}

                />
                {errorIp.province && (
                  <TextSizeCustom
                    style={{marginTop: -5, marginBottom: 5}}
                    color={colors.red}
                    size={11}>
                    {errorIp.province}
                  </TextSizeCustom>
                )}
                <InputPlace
                  readOnly
                  is_Focused={isFocused}
                  label={getTranslation('chon_huyen')}
                  value={address.district}
                  iconRight
                  disabled={!address.province}
                  containerView={{flexDirection: 'row'}}
                  onPress={() => {
                    if (!address.province) {
                      Alert.alert('Thông báo', 'Vui lòng chọn Tỉnh trước');
                      return;
                    }
                    setErrorIp({...errorIp, district: ''});
                    setIsOpenDistrict(true);
                  }}
                />
                {errorIp.district && (
                  <TextSizeCustom
                    style={{marginTop: -5, marginBottom: 5}}
                    color={colors.red}
                    size={11}>
                    {errorIp.district}
                  </TextSizeCustom>
                )}
                <InputPlace
                  readOnly
                  is_Focused={isFocused}
                  label={getTranslation('chon_xa')}
                  value={address.ward}
                  iconRight
                  disabled={!address.district}
                  containerView={{flexDirection: 'row'}}
                  onPress={() => {
                    if (!address.province) {
                      Alert.alert('Thông báo', 'Vui lòng chọn Tỉnh trước');
                      return;
                    } else if (!address.district) {
                      Alert.alert('Thông báo', 'Vui lòng chọn Huyện trước');
                      return;
                    }
                    setErrorIp({...errorIp, ward: ''});
                    setIsOpenWard(true);
                  }}
                />

                {errorIp.ward && (
                  <TextSizeCustom
                    style={{marginTop: -5, marginBottom: 5}}
                    color={colors.red}
                    size={11}>
                    {errorIp.ward}
                  </TextSizeCustom>
                )}

                <InputPlace
                  is_Focused={isFocused}
                  label={getTranslation('ten_duong')}
                  value={address.addres_line}
                  onChangeText={(text: string) => {
                    setAddress({...address, addres_line: text});
                    setErrorIp({...errorIp, addres_line: ''});
                  }}
                />
                {errorIp.addres_line && (
                  <TextSizeCustom
                    style={{marginTop: -5, marginBottom: 5}}
                    color={colors.red}
                    size={11}>
                    {errorIp.addres_line}
                  </TextSizeCustom>
                )}
              </Block>


              <Block
                row
                justifyBW
                alignCT
                backgroundColor={theme.card}
                padH={8}
                padV={12}
                marT={10}
                borderRadius={10}
                borderBottomW={0.5}
                borderColor={theme.border}>
                <TextMedium medium style={{color: theme.text}}>
                  {getTranslation('dat_mac_dinh')}
                </TextMedium>
                <Switch
                  value={isSwitch}
                  onValueChange={() => setIsSwitch(!isSwitch)}
                  thumbColor={
                    Platform.OS === 'android' ? theme.text : undefined
                  }
                  trackColor={{false: '#ccc', true: theme.text + '55'}}

              <TouchableOpacity
                activeOpacity={1}
                style={styles.btnDefault}
                onPress={() => {
                  if (listAddress.length === 0) {
                    Alert.alert(
                      getTranslation('thong_bao'),
                      'Địa chỉ đầu tiên sẽ được đặt làm mặc định',
                    );
                  } else if (items?.is_default === true) {
                    Alert.alert(
                      getTranslation('thong_bao'),
                      'Không thể huỷ mặc định tại đây. Vui lòng chọn địa chỉ khác làm mặc định.',
                    );
                  }
                }}>
                <TextMedium medium>{getTranslation('dat_mac_dinh')}</TextMedium>
                <Switch
                  value={listAddress.length === 0 ? true : isSwitch}
                  disabled={
                    listAddress.length === 0 || items?.is_default === true
                      ? true
                      : false
                  }
                  onValueChange={() => {
                    if (listAddress.length === 0) {
                      setIsSwitch(true);
                    } else {
                      setIsSwitch(!isSwitch);
                    }
                  }}

                />
              </TouchableOpacity>
            </Block>
          </KeyboardAvoidingView>
        </ScrollView>

        {/* SAVE, DELETE  */}
        {items && (
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.btnDel}
            onPress={handleDeleteAddress}>
            <TextSizeCustom bold size={18} color={colors.black}>
              {getTranslation('xoa_dia_chi')?.toLocaleUpperCase()}
            </TextSizeCustom>
          </TouchableOpacity>
        )}

        <ButtonBase
          title={getTranslation('luu')}
          containerStyle={styles.btnSave}
          onPress={() => {
            handleSave();
          }}
        />

        <SelectAddress
          label={getTranslation('chon_tinh')}
          visible={isOpenProvince}
          data={provinces}
          onClose={() => setIsOpenProvince(false)}
          onSelect={(province: { code: string; name: string }) => {
            setAddress({
              ...address,
              province: province.name,
              district: '',
              ward: '',
            });
            setDistrictss(getDistrictsByProvinceCode(province.code));
            setWardss([]);
            setIsOpenProvince(false);
          }}
        />

        <SelectAddress
          label={getTranslation('chon_huyen')}
          visible={isOpenDistrict}
          data={districtss}
          onClose={() => setIsOpenDistrict(false)}

          onSelect={(district: { code: string; name: string }) => {
            setAddress({...address, district: district.name, ward: ''});
            setWardss(getWardsByDistrictCode(district.code));

          onSelect={(district: any) => {
            setAddress({
              ...address,
              district: district.name,
              ward: '',
            });
            const newWards = getWardsByDistrictCode(district.code);
            setWardss(newWards);
            setIsOpenDistrict(false);
          }}
        />

        <SelectAddress
          label={getTranslation('chon_xa')}
          visible={isOpenWard}
          data={wardss}
          onClose={() => setIsOpenWard(false)}
          onSelect={(ward: { name: string }) => {
            setAddress({...address, ward: ward.name});
            setIsOpenWard(false);
          }}
        />
      </ContainerView>
    </TouchableWithoutFeedback>
  );
};

export default AddAddress;

const styles = StyleSheet.create({
  tinh: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    paddingBottom: 13,
    borderBottomWidth: 0.3,
    borderColor: colors.gray1,
    marginBottom: 8,
  },
  text: {
    fontWeight: '500',
  },
  item: {
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderColor: colors.gray1,
  },
  btnSave: {
    marginHorizontal: 8,
    marginBottom: 30,
  },
  btnDel: {
    marginHorizontal: 8,
    marginBottom: 10,
    backgroundColor: colors.while,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.gray,
  },
  btnDefault: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.while,
    paddingHorizontal: 8,
    paddingVertical: 12,
    marginTop: 10,
    borderRadius: 10,
  },
});

{
  /* <TouchIcon
                  title={address.province || 'Chọn Tỉnh/Thành phố'}
                  containerStyle={styles.tinh}
                  titleStyle={styles.text}
                  colorTitle={address.province ? colors.black : colors.gray}
                  sizeText={14}
                  icon={isOpenProvince ? IconSRC.icon_up : IconSRC.icon_down}
                  color={colors.gray}
                  size={25}
                  onPress={() => {
                    setIsOpenProvince(true);
                    // refProvince.current?.open();
                  }}
                />
                <TouchIcon
                  title={address.district || 'Chọn Quận/Huyện'}
                  containerStyle={styles.tinh}
                  titleStyle={styles.text}
                  colorTitle={address.district ? colors.black : colors.gray}
                  sizeText={14}
                  icon={isOpenDistrict ? IconSRC.icon_up : IconSRC.icon_down}
                  color={colors.gray}
                  size={25}
                  onPress={() => {
                    // refDistrict.current?.open();
                    setIsOpenDistrict(true);
                  }}
                  disabled={!address.province}
                />
                <TouchIcon
                  title={address.ward || 'Chọn Phường/Xã'}
                  containerStyle={styles.tinh}
                  titleStyle={styles.text}
                  colorTitle={address.ward ? colors.black : colors.gray}
                  sizeText={14}
                  icon={isOpenWard ? IconSRC.icon_down : IconSRC.icon_down}
                  color={colors.gray}
                  size={25}
                  onPress={() => {
                    // refWard.current?.open();
                    setIsOpenWard(true);
                  }}
                  disabled={!address.district}
                /> */
}
