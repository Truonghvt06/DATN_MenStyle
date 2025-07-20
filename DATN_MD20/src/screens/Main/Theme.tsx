import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Switch} from 'react-native';
import ContainerView from '../../components/layout/ContainerView';
import Header from '../../components/dataDisplay/Header';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useSelector, useDispatch} from 'react-redux';
import {RootState} from '../../redux/store';
import {setTheme} from '../../redux/slice/ThemeSlice';
import {useAppTheme} from '../../themes/ThemeContext';
import useLanguage from '../../hooks/useLanguage';
import Block from '../../components/layout/Block';
import {TextMedium} from '../../components/dataEntry/TextBase';

const ThemeScreen = () => {
  const theme = useAppTheme();
  const {getTranslation} = useLanguage();
  const {top} = useSafeAreaInsets();

  const [isSwitch, setIsSwitch] = useState(false);

  const mode = useSelector((state: RootState) => state.theme.mode);
  const dispatch = useDispatch();

  return (
    <ContainerView style={{backgroundColor: theme.background}}>
      <Header label={getTranslation('chu_de')} paddingTop={top} />

      <Block
        row
        alignCT
        justifyBW
        padH={8}
        padV={16}
        backgroundColor={theme.background_item}>
        <TextMedium>Chuyển sang chủ đề tối</TextMedium>
        <Switch
          value={isSwitch}
          onValueChange={value => {
            setIsSwitch(value);
            dispatch(setTheme(value ? 'dark' : 'light'));
          }}
          trackColor={{false: '#CCCCCC', true: '#33CC00'}}
          thumbColor={isSwitch ? '#fff' : '##EEEEEE'}
          ios_backgroundColor="#CCCCCC"
        />
      </Block>
    </ContainerView>
  );
};

export default ThemeScreen;

const styles = StyleSheet.create({
  content: {
    marginTop: 30,
    alignItems: 'center',
    width: '100%',
    minHeight: 200,
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 18,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  button: {
    width: 200,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#eee',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '500',
  },
});
