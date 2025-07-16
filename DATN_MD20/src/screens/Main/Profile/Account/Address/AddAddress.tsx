import {
  Alert,
  Keyboard,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ContainerView from '../../../../../components/layout/ContainerView';
import Header from '../../../../../components/dataDisplay/Header';
import Block from '../../../../../components/layout/Block';
import metrics from '../../../../../constants/metrics';
import InputPlace from '../../../../../components/dataEntry/Input/InputPlace';
import { KeyboardAvoidingView } from 'react-native';
import {
  TextMedium,
  TextSizeCustom,
} from '../../../../../components/dataEntry/TextBase';
import { provinces, districts, wards } from 'vietnam-provinces';
import SelectAddress from '../../../../../components/utils/SelectAddress';
import useLanguage from '../../../../../hooks/useLanguage';
import { useAppDispatch, useAppSelector } from '../../../../../redux/store';
import ButtonBase from '../../../../../components/dataEntry/Button/ButtonBase';
import {
  addAddress,
  deleteAddress,
  fetchAddresses,
  updateAddress,
} from '../../../../../redux/actions/address';
import navigation from '../../../../../navigation/navigation';
import { useRoute } from '@react-navigation/native';
import {
  formatPhoneNumber,
  normalizePhoneNumber,
} from '../../../../../utils/formatPhone';
import { useAppTheme } from '../../../../../themes/ThemeContext';

const AddAddress = () => {
  const { top } = useSafeAreaInsets();
  const { getTranslation } = useLanguage();
  const theme = useAppTheme();
  const route = useRoute();
  const { title, items } = route.params as { title: string; items: any };

  const [isFocused, setIsFocused] = useState(false);
  const [isSwitch, setIsSwitch] = useState(items?.is_default || false);
  const [address, setAddress] = useState({
    name: items?.recipient_name || '',
    phone: formatPhoneNumber(items?.phone) || '',
    province: items?.province || '',
    district: items?.district || '',
    ward: items?.ward || '',
    addres_line: items?.address_line || '',
  });
  const [districtss, setDistrictss] = useState<any[]>([]);
  const [wardss, setWardss] = useState<any[]>([]);

  const [isOpenProvince, setIsOpenProvince] = useState(false);
  const [isOpenDistrict, setIsOpenDistrict] = useState(false);
  const [isOpenWard, setIsOpenWard] = useState(false);

  const [errorIp, setErrorIp] = useState<any>({});

  const dispatch = useAppDispatch();
  const { listAddress } = useAppSelector(state => state.address);

  const getDistrictsByProvinceCode = (provinceCode: string) =>
    districts.filter(d => d.province_code === provinceCode);

  const getWardsByDistrictCode = (districtCode: string) =>
    wards.filter(w => w.district_code === districtCode);

  const validateAddress = () => {
    const newError: any = {};
    if (!address.name.trim()) newError.name = 'Vui lòng nhập họ và tên';
    if (!address.phone.trim()) {
      newError.phone = 'Vui lòng nhập số điện thoại';
    } else {
      const rawPhone = normalizePhoneNumber(address.phone);
      if (!/^0\d{9}$/.test(rawPhone)) {
        newError.phone = 'Số điện thoại không hợp lệ';
      }
    }
    if (!address.province) newError.province = 'Vui lòng chọn tỉnh/thành phố';
    if (!address.district) newError.district = 'Vui lòng chọn quận/huyện';
    if (!address.ward) newError.ward = 'Vui lòng chọn phường/xã';
    if (!address.addres_line.trim())
      newError.addres_line = 'Vui lòng nhập địa chỉ chi tiết';

    setErrorIp(newError);
    return Object.keys(newError).length === 0;
  };

  const handleSave = async () => {
    if (!validateAddress()) return;
    const data = {
      recipient_name: address.name,
      phone: normalizePhoneNumber(address.phone),
      province: address.province,
      district: address.district,
      ward: address.ward,
      address_line: address.addres_line,
      is_default: isSwitch,
    };
    try {
      if (title === getTranslation('sua_dia_chi')) {
        await dispatch(updateAddress({ id: items._id, data }));
      } else {
        await dispatch(addAddress(data)).unwrap();
      }
      await dispatch(fetchAddresses());
      navigation.goBack();
    } catch (err: any) {
      Alert.alert('Lỗi', err?.message || 'Không thể thêm địa chỉ');
    }
  };

  const handleDeleteAddress = async () => {
    Alert.alert(getTranslation('thong_bao'), getTranslation('xoa_dia_chi'), [
      { text: getTranslation('huy'), style: 'cancel' },
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

  useEffect(() => {
    if (items?.province) {
      const selectedProvince = provinces.find(p => p.name === items.province);
      if (selectedProvince) {
        const districtsByProvince = getDistrictsByProvinceCode(
          selectedProvince.code,
        );
        setDistrictss(districtsByProvince);

        const selectedDistrict = districtsByProvince.find(
          d => d.name === items.district,
        );
        if (selectedDistrict) {
          const wardsByDistrict = getWardsByDistrictCode(selectedDistrict.code);
          setWardss(wardsByDistrict);
        }
      }
    }
  }, []);

  return (
    <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss(); setIsFocused(false); }}>
      <ContainerView containerStyle={{ backgroundColor: theme.background }}>
        <Header
          label={title}
          paddingTop={top}
          onPressLeft={() => navigation.goBack()}
          backgroundColor={theme.background}
          labelColor={theme.text} // ✅ FIXED from textColor → labelColor
          iconColor={theme.text}
        />
        <ScrollView>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <Block pad={metrics.space}>
              <Block backgroundColor={theme.card} padH={8} padV={12} borderRadius={10}>
                <TextMedium medium style={{ color: theme.text }}>
                  {getTranslation('dia_chi')}
                </TextMedium>
                <InputPlace
                  is_Focused={isFocused}
                  label={getTranslation('ho_va_ten')}
                  value={address.name}
                  onChangeText={(text : string) => {
                    setAddress({ ...address, name: text });
                    setErrorIp({ ...errorIp, name: '' });
                  }}
                />
                {errorIp.name && <TextSizeCustom size={11} color={theme.danger}>{errorIp.name}</TextSizeCustom>}

                <InputPlace
                  is_Focused={isFocused}
                  label={getTranslation('sdt')}
                  value={address.phone}
                  onChangeText={(text : string)=> {
                    setAddress({ ...address, phone: text });
                    setErrorIp({ ...errorIp, phone: '' });
                  }}
                  onBlur={() => setAddress(prev => ({ ...prev, phone: formatPhoneNumber(prev.phone) }))}
                />
                {errorIp.phone && <TextSizeCustom size={11} color={theme.danger}>{errorIp.phone}</TextSizeCustom>}

                <InputPlace
                  readOnly
                  is_Focused={isFocused}
                  label={getTranslation('chon_tinh')}
                  value={address.province}
                  iconRight
                  containerView={{ flexDirection: 'row' }}
                  onPress={() => {
                    setIsOpenProvince(true);
                    setErrorIp({ ...errorIp, province: '' });
                  }}
                />
                {errorIp.province && <TextSizeCustom size={11} color={theme.danger}>{errorIp.province}</TextSizeCustom>}

                <InputPlace
                  readOnly
                  is_Focused={isFocused}
                  label={getTranslation('chon_huyen')}
                  value={address.district}
                  iconRight
                  disabled={!address.province}
                  containerView={{ flexDirection: 'row' }}
                  onPress={() => {
                    if (!address.province) return;
                    setIsOpenDistrict(true);
                    setErrorIp({ ...errorIp, district: '' });
                  }}
                />
                {errorIp.district && <TextSizeCustom size={11} color={theme.danger}>{errorIp.district}</TextSizeCustom>}

                <InputPlace
                  readOnly
                  is_Focused={isFocused}
                  label={getTranslation('chon_xa')}
                  value={address.ward}
                  iconRight
                  disabled={!address.district}
                  containerView={{ flexDirection: 'row' }}
                  onPress={() => {
                    if (!address.province || !address.district) return;
                    setIsOpenWard(true);
                    setErrorIp({ ...errorIp, ward: '' });
                  }}
                />
                {errorIp.ward && <TextSizeCustom size={11} color={theme.danger}>{errorIp.ward}</TextSizeCustom>}

                <InputPlace
                  is_Focused={isFocused}
                  label={getTranslation('ten_duong')}
                  value={address.addres_line}
                  onChangeText={(text : string) => {
                    setAddress({ ...address, addres_line: text });
                    setErrorIp({ ...errorIp, addres_line: '' });
                  }}
                />
                {errorIp.addres_line && <TextSizeCustom size={11} color={theme.danger}>{errorIp.addres_line}</TextSizeCustom>}
              </Block>

              <TouchableOpacity activeOpacity={1} style={[styles.btnDefault, { backgroundColor: theme.card }]}>
                <TextMedium medium style={{ color: theme.text }}>
                  {getTranslation('dat_mac_dinh')}
                </TextMedium>
                <Switch
                  value={listAddress.length === 0 ? true : isSwitch}
                  disabled={listAddress.length === 0 || items?.is_default === true}
                  onValueChange={() => setIsSwitch(!isSwitch)}
                />
              </TouchableOpacity>
            </Block>
          </KeyboardAvoidingView>
        </ScrollView>

        {items && (
          <TouchableOpacity
            style={[styles.btnDel, { borderColor: theme.border, backgroundColor: theme.card }]}
            onPress={handleDeleteAddress}
          >
            <TextSizeCustom bold size={18} color={theme.text}>
              {getTranslation('xoa_dia_chi')?.toUpperCase()}
            </TextSizeCustom>
          </TouchableOpacity>
        )}

        <ButtonBase
          title={getTranslation('luu')}
          containerStyle={styles.btnSave}
          onPress={handleSave}
        />

        <SelectAddress
          label={getTranslation('chon_tinh')}
          visible={isOpenProvince}
          data={provinces}
          onClose={() => setIsOpenProvince(false)}
          onSelect={(province: any) => {
            setAddress({
              ...address,
              province: province.name,
              district: '',
              ward: '',
            });
            const newDistricts = getDistrictsByProvinceCode(province.code);
            setDistrictss(newDistricts);
            setWardss([]);
            setIsOpenProvince(false);
          }}
        />

        <SelectAddress
          label={getTranslation('chon_huyen')}
          visible={isOpenDistrict}
          data={districtss}
          onClose={() => setIsOpenDistrict(false)}
          onSelect={(district: any) => {
            setAddress({ ...address, district: district.name, ward: '' });
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
          onSelect={(ward: any) => {
            setAddress({ ...address, ward: ward.name });
            setIsOpenWard(false);
          }}
        />
      </ContainerView>
    </TouchableWithoutFeedback>
  );
};

export default AddAddress;

const styles = StyleSheet.create({
  btnSave: {
    marginHorizontal: 8,
    marginBottom: 30,
  },
  btnDel: {
    marginHorizontal: 8,
    marginBottom: 10,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    borderWidth: 1,
  },
  btnDefault: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 12,
    marginTop: 10,
    borderRadius: 10,
  },
});
