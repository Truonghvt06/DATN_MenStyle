import {
  ActivityIndicator,
  Image,
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
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
import {IconBottomTab, IconSRC} from '../../../constants/icons';
import ButtonBase from '../../../components/dataEntry/Button/ButtonBase';
import {colors} from '../../../themes/colors';
import navigation from '../../../navigation/navigation';
import ScreenName from '../../../navigation/ScreenName';
import useLanguage from '../../../hooks/useLanguage';
import {useAppDispatch, useAppSelector} from '../../../redux/store';
import {sendForgotOTP} from '../../../redux/actions/auth';
import LinearGradient from 'react-native-linear-gradient';
import {colorGradient} from '../../../themes/theme_gradient';

const ForgotPassScreen = () => {
  const {top} = useSafeAreaInsets();
  const {getTranslation} = useLanguage();
  const [email, setEmail] = useState<string>('');
  const [error, setError] = useState('');

  const dispatch = useAppDispatch();
  const loading = useAppSelector(state => state.auth.loading);

  const handleContuinue = async () => {
    if (!email) {
      setError('Vui lòng nhập email!');
      return;
    }
    const result = await dispatch(sendForgotOTP(email));
    if (sendForgotOTP.fulfilled.match(result)) {
      navigation.navigate(ScreenName.Auth.OTPScreen, {email}); // truyền email sang
      setEmail('');
    } else {
      setError(result.payload as string);
    }
  };

  return (
    <ContainerView>
      <Header label={getTranslation('quen_mk')} paddingTop={top} />
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
        }}
        style={{flexGrow: 1}}>
        <Block flex1 pad={20} marT={30}>
          <TextSizeCustom
            size={20}
            bold
            style={{textTransform: 'capitalize', textAlign: 'center'}}>
            {getTranslation('nhap_email_dang_ky')}
          </TextSizeCustom>
          <TextSmall
            style={{textAlign: 'center', marginTop: 10, paddingHorizontal: 40}}>
            {getTranslation('dien_email_dk')}
          </TextSmall>
          <TextMedium bold style={{marginTop: 40, textTransform: 'capitalize'}}>
            {getTranslation('nhap_email')}:
          </TextMedium>
          <InputBase
            value={email}
            placeholder={getTranslation('nhap_email')}
            // keyboardType="numeric"
            containerStyle={{marginTop: 5}}
            onChangeText={(text: string) => {
              setEmail(text);
              setError('');
            }}
            customLeft={
              <Image style={styles.icon_left} source={IconSRC.icon_email} />
            }
          />
          {error && (
            <TextSizeCustom size={12} color={colors.red} style={{marginTop: 3}}>
              {error}
            </TextSizeCustom>
          )}
          {/* {loading ? (
            <ActivityIndicator
              size={'large'}
              color={colors.green}
              style={{marginTop: 40}}
            />
          ) : (
            <ButtonBase
              title={getTranslation('tiep_tuc')}
              radius={10}
              backgroundColor={colors.green}
              size={16}
              color={'white'}
              containerStyle={{marginTop: 40}}
              onPress={() => {
                handleContuinue();
              }}
            />
          )} */}
          <LinearGradient
            colors={colorGradient['theme-10']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={[styles.btn, {borderRadius: 10}]}>
            <TouchableOpacity style={styles.btn1} onPress={handleContuinue}>
              {loading ? (
                <ActivityIndicator size={25} color={colors.while} />
              ) : (
                <TextSizeCustom bold size={18} color={colors.while}>
                  {getTranslation('tiep_tuc')?.toLocaleUpperCase()}
                </TextSizeCustom>
              )}
            </TouchableOpacity>
          </LinearGradient>
        </Block>
      </TouchableWithoutFeedback>
    </ContainerView>
  );
};

export default ForgotPassScreen;

const styles = StyleSheet.create({
  icon_left: {
    width: 25,
    height: 25,
    padding: 2,
    alignSelf: 'center',
    justifyContent: 'center',
    marginLeft: 5,
  },
  btn: {
    height: 45,
    marginTop: 40,
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
