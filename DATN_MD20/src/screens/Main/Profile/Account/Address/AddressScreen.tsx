import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect} from 'react';
import ContainerView from '../../../../../components/layout/ContainerView';
import Header from '../../../../../components/dataDisplay/Header';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Block from '../../../../../components/layout/Block';
import metrics from '../../../../../constants/metrics';
import AddressItem from '../../../../../components/dataDisplay/AddressItem';
import {
  TextSmall,
} from '../../../../../components/dataEntry/TextBase';
import {IconSRC} from '../../../../../constants/icons';
import navigation from '../../../../../navigation/navigation';
import ScreenName from '../../../../../navigation/ScreenName';
import useLanguage from '../../../../../hooks/useLanguage';
import {useAppTheme} from '../../../../../themes/ThemeContext';

const DataAddress = [
  {
    id: '1',
    name: 'Nguyễn Văn A',
    phone: '0123456789',
    address_line: '123 Đường ABC, Phường 1',
    address_detail: 'Quận 1, TP.HCM',
    isDefault: true,
  },
  {
    id: '2',
    name: 'Nguyễn Văn B',
    phone: '0987654321',
    address_line: '456 Đường DEF, Phường 2',
    address_detail: 'Quận 2, TP.HCM',
    isDefault: false,
  },
];

const AddressScreen = () => {
  const {top} = useSafeAreaInsets();
  const {getTranslation} = useLanguage();
  const theme = useAppTheme();

import {useAppDispatch, useAppSelector} from '../../../../../redux/store';
import {fetchAddresses} from '../../../../../redux/actions/address';
import {formatPhoneNumber} from '../../../../../utils/formatPhone';

const AddressScreen = () => {
  const {top} = useSafeAreaInsets();
  const {getTranslation} = useLanguage();

  const dispatch = useAppDispatch();
  const {listAddress} = useAppSelector(state => state.address);
  // console.log('ADDRESS: ', listAddress);

  useEffect(() => {
    dispatch(fetchAddresses());
  }, []);

  const handleUpdateAddress = (title: string, items: any) => {
    navigation.navigate(ScreenName.Main.AddAddress, {
      title: title,
      items: items,
    });
  };

  return (
    <ContainerView
      containerStyle={{
        paddingTop: top,
        backgroundColor: theme.background,
      }}>
      <Header
        label={getTranslation('dia_chi')}
        paddingTop={top}
        backgroundColor={theme.background}
        textColor={theme.text}
      />
      <FlatList
        data={listAddress}
        keyExtractor={(item, index) => `${item._id} + ${item.index}`}
        ListFooterComponent={() => (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              navigation.navigate(ScreenName.Main.AddAddress, {
                title: getTranslation('dia_chi_moi'),
                items: null,
              });
            }}>
            <Block row alignCT justifyCT padV={15}>
              <Image
                source={IconSRC.icon_add}
                style={{
                  width: 20,
                  height: 20,
                  marginRight: 10,
                  tintColor: theme.text,
                }}
              />
              <TextSmall style={{textTransform: 'capitalize', color: theme.text}}>
                {getTranslation('them_dia_chi')}
              </TextSmall>
            </Block>
          </TouchableOpacity>
        )}
        renderItem={({item}) => (
          <AddressItem
            name={item.recipient_name}
            phone={formatPhoneNumber(item.phone)}
            address_line={item.address_line}
            address_detail={`${item.ward}, ${item.district}, ${item.province}`}
            isDefault={item.is_default}
            onPress={() => {
              handleUpdateAddress(getTranslation('sua_dia_chi'), item);
            }}
          />
        )}
        contentContainerStyle={{
          paddingHorizontal: metrics.space,
          marginTop: 16,
          backgroundColor: theme.background,
        }}
      />
    </ContainerView>
  );
};

export default AddressScreen;

const styles = StyleSheet.create({});
