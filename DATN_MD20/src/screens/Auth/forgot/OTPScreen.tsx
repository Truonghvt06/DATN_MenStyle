import {
  Alert,
  ActivityIndicator,
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Image,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import ContainerView from '../../../components/layout/ContainerView';
import Header from '../../../components/dataDisplay/Header';
import {useFocusEffect, useRoute} from '@react-navigation/native';
import Block from '../../../components/layout/Block';
import {
  TextMedium,
  TextSizeCustom,
  TextSmall,
} from '../../../components/dataEntry/TextBase';
import ButtonBase from '../../../components/dataEntry/Button/ButtonBase';
import {colors} from '../../../themes/colors';
import navigation from '../../../navigation/navigation';
import ScreenName from '../../../navigation/ScreenName';
import OTPTextInput from 'react-native-otp-textinput';
import useLanguage from '../../../hooks/useLanguage';
import {useAppDispatch, useAppSelector} from '../../../redux/store';
import {verifyOTP, sendForgotOTP} from '../../../redux/actions/auth';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {colorGradient} from '../../../themes/theme_gradient';
import LinearGradient from 'react-native-linear-gradient';

const OTPScreen = () => {
  const {top} = useSafeAreaInsets();
  const {getTranslation} = useLanguage();
  const dispatch = useAppDispatch();

  const [otpCode, setOtpCode] = useState('');
  const [error, setError] = useState('');
  const [counter, setCounter] = useState(60);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const route = useRoute<any>();
  const email = route.params?.email;

  const loading = useAppSelector(state => state.auth.loading);

  // Đếm ngược
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCounter(prev => {
        if (prev === 1 && timerRef.current) clearInterval(timerRef.current);
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleNext = async () => {
    if (otpCode.length !== 6) {
      setError('Mã OTP phải gồm 6 số');
      return;
    }

    const result = await dispatch(verifyOTP({email, otp: otpCode}));
    if (verifyOTP.fulfilled.match(result)) {
      navigation.navigate(ScreenName.Auth.NewPass, {email});
    } else {
      setError(result.payload as string);
    }
  };

  const handleResend = async () => {
    const result = await dispatch(sendForgotOTP(email));
    if (sendForgotOTP.fulfilled.match(result)) {
      setCounter(60); // reset timer
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setCounter(prev => {
          if (prev === 1 && timerRef.current) clearInterval(timerRef.current);
          return prev - 1;
        });
      }, 1000);
    } else {
      Alert.alert('Lỗi', result.payload as string);
    }
  };

  return (
    <ContainerView>
      <Header label={getTranslation('xac_thuc_otp')} paddingTop={top} />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
              // value={otpCode}
              inputCount={6}
              keyboardType="numeric"
              offTintColor={colors.black03}
              tintColor={colors.black}
              autoFocus
              handleTextChange={text => {
                setOtpCode(text);
                setError('');
              }}
            />
            {error && (
              <TextSizeCustom
                size={12}
                color={colors.red}
                style={{marginTop: 3}}>
                {error}
              </TextSizeCustom>
            )}

            <Block row alignCT marT={30}>
              <TextSmall>Gửi lại OTP sau {counter}s </TextSmall>
              <TouchableOpacity onPress={handleResend} disabled={counter > 0}>
                <TextSmall
                  bold
                  color={counter > 0 ? colors.gray : colors.green}
                  style={styles.text}>
                  {getTranslation('gui_lai_otp')}
                </TextSmall>
              </TouchableOpacity>
            </Block>
          </Block>

          <Block padH={20} padB={70}>
            {loading ? (
              <ActivityIndicator size="large" color={colors.green} />
            ) : (
              <ButtonBase
                title={getTranslation('tiep_tuc')}
                onPress={handleNext}
              />
            )}
          </Block>
        </Block>
      </TouchableWithoutFeedback>
    </ContainerView>
  );
};

export default OTPScreen;

const styles = StyleSheet.create({
  text: {
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  btn: {
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btn1: {
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
