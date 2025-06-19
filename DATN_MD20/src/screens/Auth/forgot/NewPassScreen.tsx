import {
  Keyboard,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, {useState} from 'react';
import ContainerView from '../../../components/layout/ContainerView';
import Header from '../../../components/dataDisplay/Header';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Block from '../../../components/layout/Block';
import {
  TextMedium,
  TextSizeCustom,
} from '../../../components/dataEntry/TextBase';
import InputBase from '../../../components/dataEntry/Input/InputBase';
import {IconSRC} from '../../../constants/icons';
import ButtonBase from '../../../components/dataEntry/Button/ButtonBase';
import {colors} from '../../../themes/colors';
import navigation from '../../../navigation/navigation';
import ScreenName from '../../../navigation/ScreenName';

interface Error {
  passNew?: string;
  rePassNew?: string;
}
const NewPassScreen = () => {
  const {top} = useSafeAreaInsets();
  const [passNew, setPassNew] = useState('');
  const [rePassNew, setRePassNew] = useState('');
  const [showPassNew, setShowPassNew] = useState(false);
  const [showRePassNew, setShowRePassNew] = useState(false);
  const [errorInp, setErrorInp] = useState<Error>({});

  const validate = () => {
    const newError: Error = {};
    if (passNew.trim() === '') {
      newError.passNew = 'Vui lòng nhập mật khẩu mới!';
    }
    if (rePassNew.trim() === '') {
      newError.rePassNew = 'Vui lòng xác nhận mật khẩu mới!';
    } else if (rePassNew !== passNew) {
      newError.rePassNew = 'Mật khẩu xác nhận không khớp!';
    }
    setErrorInp(newError);
    return Object.keys(newError).length === 0;
  };
  const handleSave = () => {
    if (!validate()) return;
    navigation.navigate(ScreenName.Auth.Login);
  };
  return (
    <ContainerView>
      <Header label="Đổi mật khẩu" paddingTop={top - 10} />
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <Block flex1 pad={20}>
          <TextMedium bold>Nhập mật khẩu mới:</TextMedium>
          <InputBase
            value={passNew}
            placeholder="Nhập mật khẩu mới"
            secureTextEntry={!showPassNew}
            iconRight
            imageName={showPassNew ? IconSRC.icon_eye_off : IconSRC.icon_eye}
            onChangeText={(text: string) => {
              setPassNew(text);
              setErrorInp({...errorInp, passNew: ''});
            }}
            onPressRight={() => setShowPassNew(!showPassNew)}
            containerStyle={styles.input}
          />
          {errorInp.passNew && (
            <TextSizeCustom size={12} color={colors.red} style={{marginTop: 3}}>
              {errorInp.passNew}
            </TextSizeCustom>
          )}

          <TextMedium bold style={{marginTop: 10}}>
            Xác nhận mật khẩu mới:
          </TextMedium>
          <InputBase
            value={rePassNew}
            placeholder="Nhập mật khẩu mới"
            secureTextEntry={!showRePassNew}
            iconRight
            imageName={showRePassNew ? IconSRC.icon_eye_off : IconSRC.icon_eye}
            onChangeText={(text: string) => {
              setRePassNew(text);
              setErrorInp({...errorInp, rePassNew: ''});
            }}
            onPressRight={() => setShowRePassNew(!showRePassNew)}
            containerStyle={styles.input}
          />
          {errorInp.rePassNew && (
            <TextSizeCustom size={12} color={colors.red} style={{marginTop: 3}}>
              {errorInp.rePassNew}
            </TextSizeCustom>
          )}
          <ButtonBase
            title="Lưu"
            containerStyle={{marginTop: 50}}
            onPress={() => handleSave()}
          />
        </Block>
      </TouchableWithoutFeedback>
    </ContainerView>
  );
};

export default NewPassScreen;

const styles = StyleSheet.create({
  input: {
    marginTop: 3,
  },
});
