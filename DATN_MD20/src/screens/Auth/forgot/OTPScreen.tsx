import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import ContainerView from '../../../components/layout/ContainerView';
import Header from '../../../components/dataDisplay/Header';
import ButtonBase from '../../../components/dataEntry/Button/ButtonBase';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Block from '../../../components/layout/Block';
import { colors } from '../../../themes/colors';
import navigation from '../../../navigation/navigation';
import ScreenName from '../../../navigation/ScreenName';
import axios from 'axios';
import { TextSmall } from '../../../components/dataEntry/TextBase';

const OTPScreen = ({ route }: any) => {
  const { email } = route.params;
  const { top } = useSafeAreaInsets();
  const [otp, setOtp] = useState('');

  const handleVerify = async () => {
    if (!otp.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập mã OTP.');
      return;
    }

    try {
      const res = await axios.post('http://192.168.111.188:3000/api/otp/verify-otp', {
        email,
        otp,
      });

      if (res.data.message === 'OTP hợp lệ') {
        navigation.navigate(ScreenName.Auth.NewPass, { email, otp });
      }
    } catch (error: any) {
      Alert.alert('Lỗi', error?.response?.data?.message || 'Xác thực OTP thất bại.');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <ContainerView>
        <Header label="Xác nhận OTP" paddingTop={top} />
        <Block pad={20}>
          <TextSmall style={{ textAlign: 'center' }}>
            Nhập mã OTP đã gửi tới email <Text style={{ fontWeight: 'bold' }}>{email}</Text>
          </TextSmall>

          <TextInput
            value={otp}
            keyboardType="number-pad"
            onChangeText={setOtp}
            placeholder="Nhập mã OTP"
            style={styles.input}
          />

          <ButtonBase
            title="Xác nhận"
            onPress={handleVerify}
            containerStyle={{ marginTop: 30 }}
          />
        </Block>
      </ContainerView>
    </TouchableWithoutFeedback>
  );
};

export default OTPScreen;

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: colors.gray,
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
    fontSize: 16,
  },
});
