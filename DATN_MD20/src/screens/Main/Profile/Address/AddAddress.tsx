import {
  Alert,
  Image,
  Keyboard,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, {createRef, useRef, useState} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ContainerView from '../../../../components/layout/ContainerView';
import Header from '../../../../components/dataDisplay/Header';
import Block from '../../../../components/layout/Block';
import metrics from '../../../../constants/metrics';
import {colors} from '../../../../themes/colors';
import InputPlace from '../../../../components/dataEntry/Input/InputPlace';
import {KeyboardAvoidingView} from 'react-native';
import {TextMedium} from '../../../../components/dataEntry/TextBase';
import TouchIcon from '../../../../components/dataEntry/Button/TouchIcon';
import {IconSRC} from '../../../../constants/icons';
import {provinces, districts, wards} from 'vietnam-provinces';

import {
  getProvinces,
  //   getDistrictsByProvinceCode,
  //   getWardsByDistrictCode,
} from 'vietnam-provinces';
import SelectAddress from '../../../../components/utils/SelectAddress';

interface IAddress {
  name: string;
  phone: string;
  province: string;
  district: string;
  ward: string;
  addres_line: string;
}
const AddAddress = () => {
  const {top} = useSafeAreaInsets();
  const [isFocused, setIsFocused] = useState(false);
  const [isSwitch, setIsSwitch] = useState(false);
  const [address, setAddress] = useState<IAddress>({
    name: '',
    phone: '',
    province: '',
    district: '',
    ward: '',
    addres_line: '',
  });
  //   const [provinces] = useState(getProvinces());
  const [districtss, setDistrictss] = useState<any[]>([]);
  const [wardss, setWardss] = useState<any[]>([]);

  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedWard, setSelectedWard] = useState('');

  const [isOpenProvince, setIsOpenProvince] = useState(false);
  const [isOpenDistrict, setIsOpenDistrict] = useState(false);
  const [isOpenWard, setIsOpenWard] = useState(false);

  const getDistrictsByProvinceCode = (provinceCode: string) => {
    return districts.filter(d => d.province_code === provinceCode);
  };

  const getWardsByDistrictCode = (districtCode: string) => {
    return wards.filter(w => w.district_code === districtCode);
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
        setIsFocused(false);
      }}>
      <ContainerView>
        <Header label="địa chỉ mới" paddingTop={top} />
        <ScrollView>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{flex: 1}}>
            <Block pad={metrics.space}>
              <Block
                backgroundColor={colors.while}
                padH={8}
                padV={12}
                borderRadius={10}>
                <TextMedium medium>Địa chỉ</TextMedium>
                <InputPlace
                  is_Focused={isFocused}
                  label="Họ và tên"
                  value={address.name}
                  onChangeText={(text: string) =>
                    setAddress({...address, name: text})
                  }
                />
                <InputPlace
                  is_Focused={isFocused}
                  label="Số điện thoại"
                  value={address.phone}
                  onChangeText={(text: string) =>
                    setAddress({...address, phone: text})
                  }
                />
                <InputPlace
                  readOnly
                  is_Focused={isFocused}
                  label="Chọn Tỉnh/Thành phố"
                  value={address.province}
                  iconRight
                  containerView={{
                    flexDirection: 'row',
                  }}
                  onPress={() => {
                    setIsOpenProvince(true);
                  }}
                />
                <InputPlace
                  readOnly
                  is_Focused={isFocused}
                  label="Chọn Quận/Huyện"
                  value={address.district}
                  iconRight
                  disabled={!address.province}
                  containerView={{
                    flexDirection: 'row',
                  }}
                  onPress={() => {
                    if (!address.province) {
                      Alert.alert('Thông báo', 'Vui lòng chọn Tỉnh trước');
                      return;
                    }
                    setIsOpenDistrict(true);
                  }}
                />
                <InputPlace
                  readOnly
                  is_Focused={isFocused}
                  label="Chọn Phường/Xã"
                  value={address.ward}
                  iconRight
                  disabled={!address.district}
                  containerView={{
                    flexDirection: 'row',
                  }}
                  onPress={() => {
                    if (!address.province) {
                      Alert.alert('Thông báo', 'Vui lòng chọn Tỉnh trước');
                      return;
                    } else if (!address.district) {
                      Alert.alert('Thông báo', 'Vui lòng chọn Huyện trước');
                      return;
                    }
                    setIsOpenWard(true);
                  }}
                />

                <InputPlace
                  is_Focused={isFocused}
                  label="Tên đường, Toà nhà, Số nhà"
                  value={address.addres_line}
                  onChangeText={(text: string) =>
                    setAddress({...address, addres_line: text})
                  }
                />
              </Block>
              <Block
                row
                justifyBW
                alignCT
                backgroundColor={colors.while}
                padH={8}
                padV={12}
                marT={10}
                borderRadius={10}>
                <TextMedium medium>Đặt làm mặc định</TextMedium>
                <Switch
                  value={isSwitch}
                  onValueChange={() => setIsSwitch(!isSwitch)}
                />
              </Block>
            </Block>
          </KeyboardAvoidingView>
        </ScrollView>

        <SelectAddress
          label="Chọn Tỉnh"
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
          label="Chọn Huyện"
          visible={isOpenDistrict}
          data={districtss}
          onClose={() => setIsOpenDistrict(false)}
          onSelect={(district: any) => {
            setAddress({...address, district: district.name, ward: ''});
            const newWards = getWardsByDistrictCode(district.code);
            setWardss(newWards);
            setIsOpenDistrict(false);
          }}
        />

        <SelectAddress
          label="Chọn Xã"
          visible={isOpenWard}
          data={wardss}
          onClose={() => setIsOpenWard(false)}
          onSelect={(ward: any) => {
            setAddress({...address, ward: ward});
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
