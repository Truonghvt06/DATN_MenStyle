import {
  Keyboard,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  Alert,
} from 'react-native';
import React, {useState} from 'react';
import ContainerView from '../../../components/layout/ContainerView';
import Header from '../../../components/dataDisplay/Header';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  TextMedium,
  TextSizeCustom,
  TextSmall,
} from '../../../components/dataEntry/TextBase';
import Block from '../../../components/layout/Block';
import InputBase from '../../../components/dataEntry/Input/InputBase';
import {IconSRC} from '../../../constants/icons';
import ButtonBase from '../../../components/dataEntry/Button/ButtonBase';
import {colors} from '../../../themes/colors';
import navigation from '../../../navigation/navigation';
import ScreenName from '../../../navigation/ScreenName';
import axios from 'axios';

const ForgotPassScreen = () => {
  const {top} = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleContinue = async () => {
    if (!email.trim()) {
      setError('Vui lòng nhập email!');
      return;
    }

    try { 
      const res = await axios.post('http://192.168.111.188:3000/api/otp/send-otp', { //thay ip của máy r chạy postman
        email: email.trim(),
      });

      Alert.alert('Thành công', res.data.message, [
        {
          text: 'OK',
          onPress: () =>
            navigation.navigate(ScreenName.Auth.OTPScreen, { email }),
        },
      ]);
    } catch (err: any) {
      const message =
        err?.response?.data?.message || 'Gửi OTP thất bại. Vui lòng thử lại.';
      Alert.alert('Lỗi', message);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <ContainerView>
        <Header label="Quên mật khẩu" paddingTop={top - 5} />
        <Block pad={20} marT={30}>
          <TextSizeCustom
            size={20}
            bold
            style={{ textTransform: 'capitalize', textAlign: 'center' }}>
            Email đăng ký
          </TextSizeCustom>
          <TextSmall
            style={{ textAlign: 'center', marginTop: 10, paddingHorizontal: 40 }}>
            Nhập email đã đăng ký tài khoản MenStyle. Chúng tôi sẽ gửi mã OTP để bạn đặt lại mật khẩu.
          </TextSmall>

          <TextMedium bold style={{ marginTop: 40 }}>Nhập email:</TextMedium>
          <InputBase
            value={email}
            placeholder="Nhập email"
            keyboardType="email-address"
            containerStyle={{ marginTop: 5 }}
            onChangeText={(text: string) => {
              setEmail(text);
              setError('');
            }}
          />
          {error ? (
            <Text style={{ color: colors.red, marginTop: 5 }}>{error}</Text>
          ) : null}

          <ButtonBase
            title="Tiếp tục"
            radius={10}
            backgroundColor={colors.green}
            size={16}
            color="white"
            containerStyle={{ marginTop: 40 }}
            onPress={handleContinue}
          />
        </Block>
      </ContainerView>
    </TouchableWithoutFeedback>
  );
};

export default ForgotPassScreen;

const styles = StyleSheet.create({});
