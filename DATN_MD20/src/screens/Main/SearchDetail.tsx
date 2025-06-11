import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import ContainerView from '../../components/layout/ContainerView';
import Header from '../../components/dataDisplay/Header';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import ScreenName from '../../navigation/ScreenName';
import navigation from '../../navigation/navigation';

const SearchDetail = () => {
  const {top} = useSafeAreaInsets();
  //   const navigation = useNavigation();
  return (
    <ContainerView>
      <Header
        label="Đổi mật khẩu"
        paddingTop={top}
        onPressLeft={() => {
          navigation.goBackMain(ScreenName.Main.Search);
          //   navigation.goBack();
        }}
      />
    </ContainerView>
  );
};

export default SearchDetail;

const styles = StyleSheet.create({});
