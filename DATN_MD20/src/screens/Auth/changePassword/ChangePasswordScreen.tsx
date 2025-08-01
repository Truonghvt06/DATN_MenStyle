import {
  Alert,
  Keyboard,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import useLanguage from '../../../hooks/useLanguage';
import {useAppDispatch} from '../../../redux/store';
import navigation from '../../../navigation/navigation';
import ScreenName from '../../../navigation/ScreenName';
import ContainerView from '../../../components/layout/ContainerView';
import Header from '../../../components/dataDisplay/Header';
import Block from '../../../components/layout/Block';
import {
  TextHeight,
  TextMedium,
  TextSizeCustom,
  TextSmall,
} from '../../../components/dataEntry/TextBase';
import InputBase from '../../../components/dataEntry/Input/InputBase';
import {IconSRC} from '../../../constants/icons';
import {colors} from '../../../themes/colors';
import ButtonBase from '../../../components/dataEntry/Button/ButtonBase';
import {useAppTheme} from '../../../themes/ThemeContext';
import Toast from 'react-native-toast-message';
import {verifyOldPassword} from '../../../redux/actions/auth';

const ChangePasswordScreen = () => {
  const {top} = useSafeAreaInsets();
  const {getTranslation} = useLanguage();
  const theme = useAppTheme();
  const [passOld, setPassOld] = useState('');

  const [showPassOld, setShowPassOld] = useState(false);

  const [errorInp, setErrorInp] = useState('');

  const dispatch = useAppDispatch();

  const handleSave = async () => {
    try {
      const resultAction = await dispatch(verifyOldPassword(passOld));

      if (verifyOldPassword.fulfilled.match(resultAction)) {
        Toast.show({
          type: 'notification',
          position: 'top',
          text1: 'Thành công',
          text2: 'Xác minh mật khẩu cũ thành công',
          visibilityTime: 1000,
        });
        // setTimeout(() => {
        navigation.navigate(ScreenName.Main.NewPassChange, {
          passOld: passOld,
        });
        // }, 1000);
        setPassOld('');
      } else {
        const errMsg = resultAction.payload as string;
        setErrorInp(errMsg || 'Mật khẩu cũ không chính xác');
      }
    } catch (error: any) {
      setErrorInp('Có lỗi xảy ra');
    }
  };

  return (
    <ContainerView>
      <Header label={getTranslation('doi_mat_khau')} paddingTop={top} />

      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <Block flex1 padH={8} padT={15}>
          <TextHeight
            bold
            style={{
              textTransform: 'capitalize',
              textAlign: 'center',
              marginTop: 20,
            }}>
            Mật khẩu đã đăng ký
          </TextHeight>
          <TextSmall style={styles.txt}>
            Nhập mật khẩu cũ của bạn để tiếp tục đổi mật khẩu
          </TextSmall>

          <TextMedium medium style={{marginBottom: 3}}>
            {getTranslation('mk_cu')}:
          </TextMedium>
          <InputBase
            value={passOld}
            placeholder={getTranslation('nhap_mk_cu')}
            placeholderTextColor={theme.placeholderTextColor}
            secureTextEntry={!showPassOld}
            iconRight
            iconColor={theme.icon}
            imageName={showPassOld ? IconSRC.icon_eye_off : IconSRC.icon_eye}
            onChangeText={(text: string) => {
              setPassOld(text);
              setErrorInp('');
            }}
            onPressRight={() => setShowPassOld(!showPassOld)}
            containerStyle={styles.input}
            inputStyle={{color: theme.text}}
          />
          {errorInp && (
            <TextSizeCustom size={12} color={colors.red} style={{marginTop: 5}}>
              {errorInp}
            </TextSizeCustom>
          )}

          <ButtonBase
            title={getTranslation('tiep_tuc')}
            containerStyle={styles.btn}
            onPress={() => handleSave()}
          />
        </Block>
      </TouchableWithoutFeedback>
    </ContainerView>
  );
};

export default ChangePasswordScreen;

const styles = StyleSheet.create({
  input: {
    marginTop: 4,
  },
  txt: {
    textAlign: 'center',
    width: 230,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 50,
  },
  btn: {
    // width: '100%',
    // position: 'absolute',
    // bottom: 50,
    // alignSelf: 'center',
    marginTop: 60,
  },
});
