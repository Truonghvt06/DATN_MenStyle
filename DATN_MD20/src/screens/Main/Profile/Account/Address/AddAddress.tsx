import {
  Alert,
  Keyboard,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  TouchableWithoutFeedback,
} from 'react-native';
import React, {useState} from 'react';
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
  const {getTranslation} = useLanguage();
  const theme = useAppTheme();

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

  const [districtss, setDistrictss] = useState<any[]>([]);
  const [wardss, setWardss] = useState<any[]>([]);

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
                  onChangeText={(text: string) =>
                    setAddress({...address, name: text})
                  }
                />
                <InputPlace
                  is_Focused={isFocused}
                  label={getTranslation('sdt')}
                  value={address.phone}
                  onChangeText={(text: string) =>
                    setAddress({...address, phone: text})
                  }
                />
                <InputPlace
                  readOnly
                  is_Focused={isFocused}
                  label={getTranslation('chon_tinh')}
                  value={address.province}
                  iconRight
                  containerView={{flexDirection: 'row'}}
                  onPress={() => setIsOpenProvince(true)}
                />
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
                    setIsOpenDistrict(true);
                  }}
                />
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
                    setIsOpenWard(true);
                  }}
                />
                <InputPlace
                  is_Focused={isFocused}
                  label={getTranslation('ten_duong')}
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
                />
              </Block>
            </Block>
          </KeyboardAvoidingView>
        </ScrollView>

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
