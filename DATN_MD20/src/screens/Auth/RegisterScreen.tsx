import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, {useState} from 'react';
import LayoutImage from '../../components/layout/LayoutImage';
import Block from '../../components/layout/Block';
import {
  TextHeight,
  TextSizeCustom,
  TextSmall,
} from '../../components/dataEntry/TextBase';
import {colors} from '../../themes/colors';
import InputBase from '../../components/dataEntry/Input/InputBase';
import metrics from '../../constants/metrics';
import {IconSRC} from '../../constants/icons';
import ButtonBase from '../../components/dataEntry/Button/ButtonBase';
import navigation from '../../navigation/navigation';
import ScreenName from '../../navigation/ScreenName';
import {auth} from '../../services/firebase'; // ✅ THÊM
import useLanguage from '../../hooks/useLanguage';
import {useAppDispatch} from '../../redux/store';
import {registerUser} from '../../redux/actions/auth';
import TouchIcon from '../../components/dataEntry/Button/TouchIcon';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useRoute} from '@react-navigation/native';
import {useAppTheme} from '../../themes/ThemeContext';
console.log('auth', auth); // ✅ THÊM

interface IEroror {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
}

const RegisterScreen = () => {
  const {getTranslation} = useLanguage();
  const theme = useAppTheme();
  const {top} = useSafeAreaInsets();
  const route = useRoute();
  const {nameScreen} = route.params as {nameScreen: string};

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState<IEroror>({});
  const [showPass, setShowPass] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  const dispatch = useAppDispatch();

  const vallidateInputs = () => {
    const newErrors: IEroror = {};

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!name) newErrors.name = getTranslation('vui_long_ho_ten');
    if (!email) {
      newErrors.email = getTranslation('vui_long_email');
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Email không hợp lệ!';
    }

    if (!phone) {
      newErrors.phone = getTranslation('vui_long_sdt');
    } else if (phone.length !== 10) {
      newErrors.phone = 'Số điện thoại phải có 10 chữ số!';
    }
    if (!password) {
      newErrors.password = getTranslation('vui_long_mk');
    } else if (password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự!';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!vallidateInputs()) return;

    try {
      const result = await dispatch(
        registerUser({name, email, phone, password}),
      );

      if (registerUser.fulfilled.match(result)) {
        navigation.navigate(ScreenName.Auth.Login, {
          nameScreen: '',
        });
      } else {
        setErrors({email: result.payload as string});
      }
    } catch (error) {
      console.log('Lỗi đăng ký:', error);
    }
  };

  const handleLogin = (prams: any) => {
    if (nameScreen === 'NextRegister') {
      navigation.goBack();
    } else {
      navigation.navigate(ScreenName.Auth.Login, {nameScreen: prams});
    }
  };

  return (
    <LayoutImage>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <Block flex1 middle>
          <TouchIcon
            icon={IconSRC.icon_back_left}
            size={25}
            color={theme.icon}
            containerStyle={[
              styles.btn,
              {backgroundColor: theme.background_login},
              {top: top},
            ]}
            onPress={() =>
              nameScreen === 'NextRegister'
                ? navigation.goBack()
                : navigation.goBack()
            }
          />
          <Block
            borderRadius={20}
            width={'85%'}
            pad={metrics.space + 5}
            backgroundColor={theme.background_login}>
            <Block justifyCT padV={20}>
              <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}>
                <TextSizeCustom
                  size={30}
                  bold
                  color={theme.text}
                  style={{textAlign: 'center'}}>
                  {getTranslation('dang_ky')}
                </TextSizeCustom>
                <TextSmall color={theme.text} style={{textAlign: 'center'}}>
                  {getTranslation('khau_hieu')}
                </TextSmall>

                <Block marT={30} />
                <InputBase
                  placeholder={getTranslation('nhap_ho_va_ten')}
                  value={name}
                  onChangeText={(text: string) => {
                    setName(text);
                    setErrors({...errors, name: ''});
                  }}
                  isFocused={focusedInput === 'name'}
                  onFocus={() => setFocusedInput('name')}
                  onBlur={() => setFocusedInput(null)}
                  inputStyle={{color: colors.while}}
                />
                {errors.name && (
                  <TextSizeCustom
                    size={12}
                    color={colors.red}
                    style={{marginTop: 3}}>
                    {errors.name}
                  </TextSizeCustom>
                )}

                <InputBase
                  placeholder={getTranslation('nhap_email')}
                  value={email}
                  onChangeText={(text: string) => {
                    setEmail(text);
                    setErrors({...errors, email: ''});
                  }}
                  isFocused={focusedInput === 'email'}
                  onFocus={() => setFocusedInput('email')}
                  onBlur={() => setFocusedInput(null)}
                  containerStyle={{marginTop: 10}}
                  inputStyle={{color: colors.while}}
                />
                {errors.email && (
                  <TextSizeCustom
                    size={12}
                    color={colors.red}
                    style={{marginTop: 3}}>
                    {errors.email}
                  </TextSizeCustom>
                )}

                <InputBase
                  placeholder={getTranslation('nhap_so_dien_thoai')}
                  value={phone}
                  keyboardType="numeric"
                  onChangeText={(text: string) => {
                    setPhone(text);
                    setErrors({...errors, phone: ''});
                  }}
                  isFocused={focusedInput === 'phone'}
                  onFocus={() => setFocusedInput('phone')}
                  onBlur={() => setFocusedInput(null)}
                  containerStyle={{marginTop: 10}}
                  inputStyle={{color: colors.while}}
                />
                {errors.phone && (
                  <TextSizeCustom
                    size={12}
                    color={colors.red}
                    style={{marginTop: 3}}>
                    {errors.phone}
                  </TextSizeCustom>
                )}

                <InputBase
                  placeholder={getTranslation('nhap_mat_khau')}
                  value={password}
                  onChangeText={(text: string) => {
                    setPassword(text);
                    setErrors({...errors, password: ''});
                  }}
                  isFocused={focusedInput === 'password'}
                  onFocus={() => setFocusedInput('password')}
                  onBlur={() => setFocusedInput(null)}
                  secureTextEntry={!showPass}
                  iconRight
                  imageName={
                    !showPass ? IconSRC.icon_eye : IconSRC.icon_eye_off
                  }
                  iconColor={theme.icon}
                  onPressRight={() => setShowPass(!showPass)}
                  containerStyle={{marginTop: 10}}
                  inputStyle={{color: colors.while}}
                />
                {errors.password && (
                  <TextSizeCustom
                    size={12}
                    color={colors.red}
                    style={{marginTop: 3}}>
                    {errors.password}
                  </TextSizeCustom>
                )}

                <ButtonBase
                  title={getTranslation('dang_ky')}
                  containerStyle={{marginVertical: 40}}
                  onPress={handleRegister}
                />
              </KeyboardAvoidingView>
            </Block>

            <Block row middle>
              <TextSmall>{getTranslation('da_co_tk')} </TextSmall>
              <TouchableOpacity
                onPress={() => {
                  handleLogin('NextLogin');
                }}>
                <TextSmall color={theme.primary} bold>
                  {getTranslation('dang_nhap')}
                </TextSmall>
              </TouchableOpacity>
            </Block>
          </Block>
        </Block>
      </TouchableWithoutFeedback>
    </LayoutImage>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  btn: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: 20,

    height: 45,
    width: 45,
    borderRadius: 18,
  },
});
