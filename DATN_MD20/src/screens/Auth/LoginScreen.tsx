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
import React, {useEffect, useState} from 'react';
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
import {useNavigation, useRoute} from '@react-navigation/native';
import navigation from '../../navigation/navigation';
import MaskedView from '@react-native-masked-view/masked-view';
import LinearGradient from 'react-native-linear-gradient';
import {colorGradient} from '../../themes/theme_gradient';
import {auth} from '../../services/firebase'; // ✅ thêm dòng này
import useLanguage from '../../hooks/useLanguage';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {loginUser} from '../../redux/actions/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TouchIcon from '../../components/dataEntry/Button/TouchIcon';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useAppTheme} from '../../themes/ThemeContext';
import InputPlace from '../../components/dataEntry/Input/InputPlace';
import Toast from 'react-native-toast-message';
import configToast from '../../components/utils/configToast';

const LoginScreen = () => {
  const {top} = useSafeAreaInsets();
  const {getTranslation} = useLanguage();
  const theme = useAppTheme();
  const route = useRoute();
  const {nameScreen} = route.params as {nameScreen: string};

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isCheckBox, setIsCheckBox] = useState(false);
  const [focusedInput, setFocusedInput] = useState<any>(null);
  const [errorInp, setErrorInp] = useState('');
  const [showPass, setShowPass] = useState(false);

  const dispatch = useAppDispatch();
  const {loading, error, user, token} = useAppSelector(state => state.auth);

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorInp('Vui lòng nhập đầy đủ');
      return;
    }

    const resultAction = await dispatch(loginUser({email, password}));

    if (loginUser.fulfilled.match(resultAction)) {
      if (isCheckBox) {
        await AsyncStorage.setItem(
          'autoLogin',
          JSON.stringify({email, password}),
        );
      } else {
        await AsyncStorage.removeItem('autoLogin');
      }

      Toast.show({
        type: 'notification', // Có thể là 'success', 'error', 'info'
        position: 'top',
        text1: 'Thành công',
        text2: 'Đăng nhập thành công',
        visibilityTime: 2000, // số giây hiển thị Toast
        autoHide: true,
        swipeable: true,
      });
      navigation.resetToStackWithScreen(
        ScreenName.Main.MainStack,
        ScreenName.Main.BottonTab,
      );
    } else {
      setErrorInp(resultAction.payload as string);
    }
  };

  useEffect(() => {
    const loadRememberedAccount = async () => {
      const saved = await AsyncStorage.getItem('autoLogin');
      if (saved) {
        const {email, password} = JSON.parse(saved);
        setEmail(email);
        setPassword(password);
        setIsCheckBox(true);
      }
    };

    loadRememberedAccount();
  }, []);

  const handleRegister = (prams: any) => {
    if (nameScreen === 'NextLogin') {
      navigation.goBack();
    } else {
      navigation.navigate(ScreenName.Auth.Register, {nameScreen: prams});
    }
  };

  const handleForgotPassword = () => {
    navigation.navigate(ScreenName.Auth.ForgotPassword);
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
              nameScreen === 'NextLogin'
                ? navigation.goBack()
                : navigation.goBack()
            }
          />
          <Block
            borderRadius={20}
            width={'85%'}
            height={500}
            pad={metrics.space + 5}
            backgroundColor={theme.background_login}>
            <Block flex1 justifyCT>
              <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{flex: 1, justifyContent: 'center'}}>
                <TextSizeCustom bold size={30} style={{textAlign: 'center'}}>
                  {getTranslation('chao_mung')}
                </TextSizeCustom>
                <TextHeight style={{textAlign: 'center', marginBottom: 30}}>
                  {getTranslation('dang_nhap_tk')}
                </TextHeight>

                {/* <InputPlace
                  // is_Focused={isFocused}
                  label={getTranslation('email')}
                  value={email}
                  onChangeText={(text: string) => {
                    setEmail(text);
                    setErrorInp('');
                  }}
                /> */}

                <InputBase
                  value={email}
                  placeholder={getTranslation('nhap_email')}
                  isFocused={focusedInput === 'email'}
                  onFocus={() => setFocusedInput('email')}
                  onBlur={() => setFocusedInput(null)}
                  onChangeText={(text: string) => {
                    setEmail(text);
                    setErrorInp('');
                  }}
                  inputStyle={{color: theme.text}}
                />
                <InputBase
                  value={password}
                  placeholder={getTranslation('nhap_mat_khau')}
                  secureTextEntry={!showPass}
                  isFocused={focusedInput === 'password'}
                  onFocus={() => setFocusedInput('password')}
                  onBlur={() => setFocusedInput(null)}
                  containerStyle={{marginTop: 10}}
                  iconRight
                  imageName={showPass ? IconSRC.icon_eye_off : IconSRC.icon_eye}
                  iconColor={theme.icon}
                  onChangeText={(text: string) => {
                    setPassword(text);
                    setErrorInp('');
                  }}
                  onPressRight={() => setShowPass(!showPass)}
                  inputStyle={{color: theme.text}}
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
                    {/* <TouchableOpacity
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
                      {getTranslation('nho_tk')}
                    </TextSizeCustom> */}
                  </Block>

                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={handleForgotPassword}>
                    <TextSizeCustom size={13} color={theme.text}>
                      {getTranslation('quen_mk')}
                    </TextSizeCustom>
                  </TouchableOpacity>
                </Block>

                <ButtonBase
                  title={getTranslation('dang_nhap')}
                  onPress={
                    () => handleLogin()
                    // navigation.navigate(ScreenName.Main.MainStack)
                  }
                />
              </KeyboardAvoidingView>
            </Block>
            <Block row middle>
              <TextSmall>{getTranslation('khong_co_tk')} </TextSmall>
              <TouchableOpacity
                onPress={() => {
                  handleRegister('NextRegister');
                }}>
                <TextSmall bold color={theme.primary}>
                  {getTranslation('tao_tk')}
                </TextSmall>
              </TouchableOpacity>
            </Block>
          </Block>
        </Block>
      </TouchableWithoutFeedback>
    </LayoutImage>
  );
};

export default LoginScreen;

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
