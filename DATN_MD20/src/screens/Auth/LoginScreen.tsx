import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, {useState} from 'react';
import LayoutImage from '../../components/layout/LayoutImage';
import Block from '../../components/layout/Block';
import {colors} from '../../themes/colors';
import {
  TextHeight,
  TextSizeCustom,
  TextSmall,
} from '../../components/dataEntry/TextBase';
import InputBase from '../../components/dataEntry/Input/InputBase';
import metrics from '../../constants/metrics';
import {IconSRC} from '../../constants/icons';
import ButtonBase from '../../components/dataEntry/Button/ButtonBase';
import ScreenName from '../../navigation/ScreenName';
import {useNavigation} from '@react-navigation/native';
import navigation from '../../navigation/navigation';
import MaskedView from '@react-native-masked-view/masked-view';
import LinearGradient from 'react-native-linear-gradient';
import {colorGradient} from '../../themes/theme_gradient';
import {auth} from '../../services/firebase'; // ✅ thêm dòng này

const LoginScreen = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isCheckBox, setIsCheckBox] = useState(false);
  const [focusedInput, setFocusedInput] = useState<any>(null);
  const [errorInp, setErrorInp] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleLogin = async () => {
    try {
      await auth().signInWithEmailAndPassword(email, password);
      navigation.navigate(ScreenName.Main.MainStack);
    } catch (error: any) {
      console.log('Login error:', error);
      if (error.code === 'auth/user-not-found') {
        setErrorInp('Tài khoản không tồn tại!');
      } else if (error.code === 'auth/wrong-password') {
        setErrorInp('Mật khẩu không đúng!');
      } else if (error.code === 'auth/invalid-email') {
        setErrorInp('Email không hợp lệ!');
      } else {
        setErrorInp('Đăng nhập thất bại, thử lại sau!');
      }
    }
  };

  const handleRegister = () => {
    navigation.navigate(ScreenName.Auth.Register);
  };

  const handleForgotPassword = () => {
    navigation.navigate(ScreenName.Auth.ForgotPassword);
  };

  return (
    <LayoutImage>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <Block flex1 middle>
          <Block
            borderRadius={20}
            width={'85%'}
            height={500}
            pad={metrics.space + 5}
            backgroundColor={colors.black65}>
            <Block flex1 justifyCT>
              <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{flex: 1, justifyContent: 'center'}}>
                <TextSizeCustom
                  bold
                  size={30}
                  color={colors.while}
                  style={{textAlign: 'center'}}>
                  Chào mừng!
                </TextSizeCustom>
                <TextHeight
                  color={colors.while}
                  style={{textAlign: 'center', marginBottom: 30}}>
                  Đăng nhập tài khoản
                </TextHeight>

                <InputBase
                  value={email}
                  placeholder="Nhập email hoặc số điện thoại"
                  isFocused={focusedInput === 'email'}
                  onFocus={() => setFocusedInput('email')}
                  onBlur={() => setFocusedInput(null)}
                  onChangeText={(text: string) => {
                    setEmail(text);
                    setErrorInp('');
                  }}
                  inputStyle={{color: colors.while}}
                />
                <InputBase
                  value={password}
                  placeholder="Nhập mật khẩu"
                  secureTextEntry={!showPass}
                  isFocused={focusedInput === 'password'}
                  onFocus={() => setFocusedInput('password')}
                  onBlur={() => setFocusedInput(null)}
                  containerStyle={{marginTop: 10}}
                  iconRight
                  imageName={showPass ? IconSRC.icon_eye : IconSRC.icon_eye_off}
                  iconColor={colors.black65}
                  onChangeText={(text: string) => {
                    setPassword(text);
                    setErrorInp('');
                  }}
                  onPressRight={() => setShowPass(!showPass)}
                  inputStyle={{color: colors.while}}
                />
                {errorInp ? (
                  <TextSizeCustom
                    size={12}
                    color={colors.red}
                    style={{marginTop: 3}}>
                    {errorInp}
                  </TextSizeCustom>
                ) : null}

                <Block row centerBW marT={15} marB={40}>
                  <Block row alignCT>
                    <TouchableOpacity
                      onPress={() => setIsCheckBox(!isCheckBox)}>
                      <Image
                        style={{width: 16, height: 16}}
                        source={
                          isCheckBox ? IconSRC.icon_check : IconSRC.icon_uncheck
                        }
                      />
                    </TouchableOpacity>
                    <TextSizeCustom
                      size={13}
                      color={colors.while}
                      style={{marginLeft: 5}}>
                      Nhớ tài khoản
                    </TextSizeCustom>
                  </Block>

                  <MaskedView
                    maskElement={
                      <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={handleForgotPassword}>
                        <TextSizeCustom size={13} color={colors.green}>
                          Quên mật khẩu?
                        </TextSizeCustom>
                      </TouchableOpacity>
                    }>
                    <TouchableOpacity
                      activeOpacity={0.5}
                      onPress={handleForgotPassword}>
                      <TextSizeCustom size={13} color={colors.green}>
                        Quên mật khẩu?
                      </TextSizeCustom>
                    </TouchableOpacity>
                  </MaskedView>
                </Block>

                <ButtonBase
                  title="Đăng nhập"
                  onPress={
                    () => handleLogin()
                    // navigation.navigate(ScreenName.Main.MainStack)
                  }
                />
              </KeyboardAvoidingView>
            </Block>
            <Block row middle>
              <TextSmall color={colors.while}>
                Bạn không có tài khoản?{' '}
              </TextSmall>
              <TouchableOpacity
                onPress={() => {
                  handleRegister();
                }}>
                <TextSmall color={colors.green} bold>
                  Tạo tài khoản
                </TextSmall>

                {/* <TouchableOpacity onPress={handleRegister}>
                  <TextSmall color={colors.green} bold>
                    Tạo tài khoản
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

export default LoginScreen;

const styles = StyleSheet.create({});
