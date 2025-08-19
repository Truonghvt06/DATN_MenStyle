import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import ContainerView from '../../components/layout/ContainerView';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import useLanguage from '../../hooks/useLanguage';
import {useAppTheme} from '../../themes/ThemeContext';
import Header from '../../components/dataDisplay/Header';
import Block from '../../components/layout/Block';
import {TextHeight, TextSmall} from '../../components/dataEntry/TextBase';
import {IconSRC} from '../../constants/icons';
import ButtonBase from '../../components/dataEntry/Button/ButtonBase';
import navigation from '../../navigation/navigation';
import ScreenName from '../../navigation/ScreenName';

const SuccessCheckout = () => {
  const {top} = useSafeAreaInsets();
  const {getTranslation} = useLanguage();
  const theme = useAppTheme();

  return (
    <ContainerView>
      <Header label="Thành công" paddingTop={top} />
      <Block alignCT>
        <Image source={IconSRC.tick} style={styles.img} />
        <TextHeight style={{marginBottom: 10}} bold>
          {'Chờ xác nhận đơn hàng'}
        </TextHeight>
        {/* <TextSmall style={{width: 200, textAlign: 'center'}}>
          {'Đơn hàng của bạn đã được xác nhận và sẽ sớm được xử lý.'}
        </TextSmall> */}
        <TextSmall>{'Cảm ơn bạn đã mua hàng!'}</TextSmall>
      </Block>
      <Block row padH={30} padT={20}>
        <ButtonBase
          title={'Trang chủ'}
          size={14}
          onPress={() => navigation.replace(ScreenName.Main.BottonTab)}
          containerStyle={{flex: 1, marginRight: 15, height: 40}}
        />
        <ButtonBase
          title={'Đơn hàng'}
          size={14}
          onPress={() =>
            navigation.replace(ScreenName.Main.Orders, {
              screen: 'order_payment',
            })
          }
          containerStyle={{flex: 1, height: 40}}
        />
      </Block>
    </ContainerView>
  );
};

export default SuccessCheckout;

const styles = StyleSheet.create({
  img: {
    width: 100,
    height: 100,
    marginTop: 60,
    marginBottom: 20,
    resizeMode: 'contain',
  },
});
