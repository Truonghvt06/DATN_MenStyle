import {
  Image,
  Keyboard,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from 'react-native';
import React from 'react';
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

const ForgotPassScreen = () => {
  const {top} = useSafeAreaInsets();
  const {getTranslation} = useLanguage();
  const [phone, setPhone] = React.useState<string>('');
  const handleContuinue = () => {
    navigation.navigate(ScreenName.Auth.OTPScreen);
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
            value={phone}
            placeholder={getTranslation('nhap_email')}
            // keyboardType="numeric"
            containerStyle={{marginTop: 5}}
            onChangeText={(text: string) => {
              setPhone(text);
            }}
            customLeft={
              <Image style={styles.icon_left} source={IconSRC.icon_email} />
            }
          />
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
});
