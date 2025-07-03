import {StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import ContainerView from '../../../../../components/layout/ContainerView';
import Header from '../../../../../components/dataDisplay/Header';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import useLanguage from '../../../../../hooks/useLanguage';
import {useRoute} from '@react-navigation/native';
import InputBase from '../../../../../components/dataEntry/Input/InputBase';
import Block from '../../../../../components/layout/Block';
import ButtonBase from '../../../../../components/dataEntry/Button/ButtonBase';
import navigation from '../../../../../navigation/navigation';

const UpdateInfor = () => {
  const {top} = useSafeAreaInsets();
  const {getTranslation} = useLanguage();
  const route = useRoute();
  const {name, title, onSave} = route.params as {
    name: string;
    title: string;
    onSave: (newValue: string) => void;
  };

  const [value, setValue] = useState(name || '');

  return (
    <ContainerView>
      <Header label={title} paddingTop={top} />
      <Block containerStyle={styles.container}>
        <InputBase
          value={value}
          onChangeText={text => {
            setValue(text);
          }}
        />
        <Block marT={40}>
          <ButtonBase
            title={getTranslation('luu')}
            onPress={() => {
              onSave?.(value); // Gửi dữ liệu về màn trước
              navigation.goBack();
            }}
          />
        </Block>
      </Block>
    </ContainerView>
  );
};

export default UpdateInfor;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingTop: 20,
  },
});
