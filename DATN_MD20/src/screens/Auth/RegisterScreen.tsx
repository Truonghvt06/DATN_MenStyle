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
console.log('auth', auth); // ✅ THÊM

interface IEroror {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
}

const RegisterScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState<IEroror>({});
  const [showPass, setShowPass] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  const vallidateInputs = () => {
    const newErrors: IEroror = {};

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!name) newErrors.name = 'Vui lòng nhập họ tên!';
    if (!email) {
      newErrors.email = 'Vui lòng nhập email!';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Email không hợp lệ!';
    }

    if (!phone) {
      newErrors.phone = 'Vui lòng nhập số điện thoại!';
    } else if (phone.length !== 10) {
      newErrors.phone = 'Số điện thoại phải có 10 chữ số!';
    }
    if (!password) {
      newErrors.password = 'Vui lòng nhập mật khẩu!';
    } else if (password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự!';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!vallidateInputs()) return;

    try {
      const userCredential = await auth().createUserWithEmailAndPassword(
        email,
        password,
      );
      await userCredential.user.updateProfile({displayName: name});
      console.log('Đăng ký thành công:', userCredential.user.email);
      navigation.navigate(ScreenName.Auth.Login);
    } catch (error: any) {
      console.log('Đăng ký lỗi:', error);
      if (error.code === 'auth/email-already-in-use') {
        setErrors({...errors, email: 'Email đã tồn tại!'});
      } else if (error.code === 'auth/invalid-email') {
        setErrors({...errors, email: 'Email không hợp lệ!'});
      } else if (error.code === 'auth/weak-password') {
        setErrors({...errors, password: 'Mật khẩu quá yếu!'});
      } else {
        setErrors({...errors, email: 'Đăng ký thất bại, thử lại sau!'});
      }
    }
  };

  const handleLogin = () => {
    navigation.navigate(ScreenName.Auth.Login);
  };

  return (
    <LayoutImage>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <Block flex1 middle>
          <Block
            borderRadius={20}
            width={'85%'}
            pad={metrics.space + 5}
            backgroundColor={colors.black65}>
            <Block justifyCT padV={20}>
              <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}>
                <TextSizeCustom
                  size={30}
                  bold
                  color={'white'}
                  style={{textAlign: 'center'}}>
                  Đăng ký
                </TextSizeCustom>
                <TextSmall color={colors.while} style={{textAlign: 'center'}}>
                  MenStyle - Đẳng cấp là mãi mãi!
                </TextSmall>

                <Block marT={30} />
                <InputBase
                  placeholder="Họ và tên"
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
                  placeholder="Email"
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
                  placeholder="Số điện thoại"
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
                  placeholder="Mật khẩu"
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
                  imageName={showPass ? IconSRC.icon_eye : IconSRC.icon_eye_off}
                  iconColor={colors.black65}
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
                  title="Đăng ký"
                  containerStyle={{marginVertical: 40}}
                  onPress={handleRegister}
                />
              </KeyboardAvoidingView>
            </Block>

            <Block row middle>
              <TextSmall color={colors.while}>Bạn đã có tài khoản? </TextSmall>
              <TouchableOpacity
                onPress={() => {
                  handleLogin();
                }}>
                <TextSmall color={colors.green} bold>
                  Đăng nhập
                </TextSmall>

                {/* <TouchableOpacity onPress={handleLogin}>
                  <TextSmall color={colors.green} bold>
                    Đăng nhập
                  </TextSmall>
                </TouchableOpacity> */}
              </TouchableOpacity>
            </Block>
          </Block>
        </Block>
      </TouchableWithoutFeedback>
    </LayoutImage>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({});
