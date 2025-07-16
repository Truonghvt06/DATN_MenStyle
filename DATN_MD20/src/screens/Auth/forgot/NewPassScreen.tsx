import {
  Keyboard,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
} from 'react-native';
import React, { useState } from 'react';
import ContainerView from '../../../components/layout/ContainerView';
import Header from '../../../components/dataDisplay/Header';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Block from '../../../components/layout/Block';
import {
  TextMedium,
  TextSizeCustom,
} from '../../../components/dataEntry/TextBase';
import InputBase from '../../../components/dataEntry/Input/InputBase';
import { IconSRC } from '../../../constants/icons';
import ButtonBase from '../../../components/dataEntry/Button/ButtonBase';
import { colors } from '../../../themes/colors';
import navigation from '../../../navigation/navigation';
import ScreenName from '../../../navigation/ScreenName';
import useLanguage from '../../../hooks/useLanguage';
import { useAppDispatch } from '../../../redux/store';
import { useRoute } from '@react-navigation/native';
import { resetPassword } from '../../../redux/actions/auth';
import { useAppTheme } from '../../../themes/ThemeContext';

interface Error {
  passNew?: string;
  rePassNew?: string;
}

const NewPassScreen = () => {
  const { top } = useSafeAreaInsets();
  const { getTranslation } = useLanguage();
  const theme = useAppTheme();

  const [passNew, setPassNew] = useState('');
  const [rePassNew, setRePassNew] = useState('');
  const [showPassNew, setShowPassNew] = useState(false);
  const [showRePassNew, setShowRePassNew] = useState(false);
  const [errorInp, setErrorInp] = useState<Error>({});
  const [errorGlobal, setErrorGlobal] = useState('');

  const dispatch = useAppDispatch();
  const route = useRoute<any>();
  const email = route.params?.email;

  const validate = () => {
    const newError: Error = {};
    if (passNew.trim() === '') {
      newError.passNew = getTranslation('vui_long_mk_moi');
    }
    if (rePassNew.trim() === '') {
      newError.rePassNew = getTranslation('vui_long_xnh_mk_moi');
    } else if (rePassNew !== passNew) {
      newError.rePassNew = getTranslation('mk_khong_trung');
    }
    setErrorInp(newError);
    return Object.keys(newError).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    const result = await dispatch(resetPassword({ email, newPassword: passNew }));
    if (resetPassword.fulfilled.match(result)) {
      navigation.navigate(ScreenName.Auth.Login);
    } else {
      setErrorGlobal(result.payload as string);
    }
  };

  return (
    <ContainerView containerStyle={{ backgroundColor: theme.background }}>
      <Header
        label={getTranslation('doi_mat_khau')}
        paddingTop={top}
        backgroundColor={theme.background}
        labelColor={theme.text}
        iconColor={theme.text}
      />
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <Block flex1 pad={20}>
          <TextMedium bold style={{ color: theme.text }}>
            {getTranslation('nhap_mk_moi')}:
          </TextMedium>
          <InputBase
            value={passNew}
            placeholder={getTranslation('nhap_mk_moi')}
            secureTextEntry={!showPassNew}
            iconRight
            imageName={showPassNew ? IconSRC.icon_eye_off : IconSRC.icon_eye}
            onChangeText={(text: string) => {
              setPassNew(text);
              setErrorInp({ ...errorInp, passNew: '' });
            }}
            onPressRight={() => setShowPassNew(!showPassNew)}
            containerStyle={styles.input}
          />
          {errorInp.passNew && (
            <TextSizeCustom size={12} color={colors.red} style={{ marginTop: 3 }}>
              {errorInp.passNew}
            </TextSizeCustom>
          )}

          <TextMedium bold style={{ marginTop: 10, color: theme.text }}>
            {getTranslation('xac_nhan_mk_moi')}
          </TextMedium>
          <InputBase
            value={rePassNew}
            placeholder={getTranslation('nhap_lai_mk_moi')}
            secureTextEntry={!showRePassNew}
            iconRight
            imageName={showRePassNew ? IconSRC.icon_eye_off : IconSRC.icon_eye}
            onChangeText={(text: string) => {
              setRePassNew(text);
              setErrorInp({ ...errorInp, rePassNew: '' });
            }}
            onPressRight={() => setShowRePassNew(!showRePassNew)}
            containerStyle={styles.input}
          />
          {errorInp.rePassNew && (
            <TextSizeCustom size={12} color={colors.red} style={{ marginTop: 3 }}>
              {errorInp.rePassNew}
            </TextSizeCustom>
          )}
          {errorGlobal && (
            <TextSizeCustom size={12} color={colors.red} style={{ marginTop: 3 }}>
              {errorGlobal}
            </TextSizeCustom>
          )}
          <ButtonBase
            title={getTranslation('luu')}
            containerStyle={{ marginTop: 50 }}
            onPress={handleSave}
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
