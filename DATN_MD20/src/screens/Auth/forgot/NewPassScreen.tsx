import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import ContainerView from '../../../components/layout/ContainerView';
import Header from '../../../components/dataDisplay/Header';
import ButtonBase from '../../../components/dataEntry/Button/ButtonBase';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Block from '../../../components/layout/Block';
import { colors } from '../../../themes/colors';
import axios from 'axios';
import navigation from '../../../navigation/navigation';
import ScreenName from '../../../navigation/ScreenName';
import InputBase from '../../../components/dataEntry/Input/InputBase';
import { IconSRC } from '../../../constants/icons';
import { TextMedium } from '../../../components/dataEntry/TextBase';

const NewPasswordScreen = ({ route }: any) => {
  const { top } = useSafeAreaInsets();
  const { email, otp } = route.params;

  const [passNew, setPassNew] = useState('');
  const [reNewPassword, setReNewPassword] = useState('');
  const [showPassNew, setShowPassNew] = useState(false);
  const [errorInp, setErrorInp] = useState<{ passNew?: string }>({});

  const handleSave = async () => {
    if (!passNew || !reNewPassword) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin');
      return;
    }
    if (passNew !== reNewPassword) {
      Alert.alert('Lỗi', 'Mật khẩu không khớp');
      return;
    }

    try {
      const res = await axios.post('http://192.168.111.188:3000/api/otp/update-password', {
        email,
        otp,
        newPassword: passNew,
      });

      if (res.data.message === 'Mật khẩu đã được cập nhật') {
        Alert.alert('Thành công', 'Đổi mật khẩu thành công!', [
          {
            text: 'OK',
            onPress: () => navigation.navigate(ScreenName.Auth.Login),
          },
        ]);
      }
    } catch (error: any) {
      Alert.alert('Lỗi', error?.response?.data?.message || 'Đổi mật khẩu thất bại');
    }
  };

  return (
    <ContainerView>
      <Header label="Đổi mật khẩu" paddingTop={top - 10} />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
              setErrorInp({ ...errorInp, passNew: '' });
            }}
            onPressRight={() => setShowPassNew(!showPassNew)}
            containerStyle={styles.input}
          />

          <Text style={{ marginTop: 10 }}>Xác nhận mật khẩu:</Text>
          <InputBase
            value={reNewPassword}
            placeholder="Nhập lại mật khẩu"
            secureTextEntry
            onChangeText={setReNewPassword}
            containerStyle={styles.input}
          />

          <ButtonBase
            title="Lưu"
            onPress={handleSave}
            containerStyle={{ marginTop: 40 }}
          />
        </Block>
      </TouchableWithoutFeedback>
    </ContainerView>
  );
};

export default NewPasswordScreen;

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: colors.gray,
    padding: 10,
    borderRadius: 8,
    marginTop: 5,
  },
});
