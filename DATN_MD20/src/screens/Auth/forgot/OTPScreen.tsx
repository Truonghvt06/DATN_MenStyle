import {
  Alert,
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, {useState} from 'react';
import ContainerView from '../../../components/layout/ContainerView';
import Header from '../../../components/dataDisplay/Header';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Block from '../../../components/layout/Block';
import {TextMedium, TextSmall} from '../../../components/dataEntry/TextBase';
import ButtonBase from '../../../components/dataEntry/Button/ButtonBase';
import {colors} from '../../../themes/colors';
import navigation from '../../../navigation/navigation';
import ScreenName from '../../../navigation/ScreenName';
import OTPTextInput from 'react-native-otp-textinput';
import useLanguage from '../../../hooks/useLanguage';

const OTPScreen = () => {
  const {top} = useSafeAreaInsets();
  const {getTranslation} = useLanguage();
  const [otpCode, setOtpCode] = useState('');

  const handleNext = () => {
    navigation.navigate(ScreenName.Auth.NewPass);
    // const expectedOTP = '123456'; // Giả sử mã gửi từ server

    // if (otpCode === expectedOTP) {
    //   navigation.navigate(ScreenName.Auth.NewPass);
    // } else {
    //   Alert.alert('Lỗi', 'Mã OTP không đúng, vui lòng thử lại');
    // }
  };
  return (
    <ContainerView>
      <Header label={getTranslation('xac_thuc_otp')} paddingTop={top} />
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
        }}>
        <Block flex1>
          <Block alignCT padT={30}>
            <TextSmall style={{textAlign: 'center'}}>
              {getTranslation('ma_otp_da_gui')}
            </TextSmall>
            <TextSmall style={{textAlign: 'center'}}>
              {getTranslation('nhap_otp')}
            </TextSmall>
          </Block>
          <Block flex1 pad={30} alignCT marT={30}>
            <OTPTextInput
              inputCount={6}
              keyboardType="numeric"
              offTintColor={colors.black03}
              tintColor={colors.black}
              autoFocus
              handleTextChange={text => {
                setOtpCode(text);
                console.log('OTP:', text);
              }}
            />

            <TouchableOpacity onPress={() => {}}>
              <TextMedium bold color={colors.green} style={styles.text}>
                {getTranslation('gui_lai_otp')}
              </TextMedium>
            </TouchableOpacity>
          </Block>

          <ButtonBase
            title={getTranslation('tiep_tuc')}
            containerStyle={{marginBottom: 70, marginHorizontal: 20}}
            onPress={() => {
              handleNext();
            }}
          />
        </Block>
      </TouchableWithoutFeedback>
    </ContainerView>
  );
};

export default OTPScreen;

const styles = StyleSheet.create({
  text: {
    textAlign: 'center',
    marginTop: 40,
    textDecorationLine: 'underline',
  },
});
