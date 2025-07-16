import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import ContainerView from '../../components/layout/ContainerView';
import Header from '../../components/dataDisplay/Header';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
import { setTheme } from '../../redux/slice/ThemeSlice';
import { useAppTheme } from '../../themes/ThemeContext';

const ThemeScreen = () => {
  const theme = useAppTheme();
  const { top } = useSafeAreaInsets();
  const mode = useSelector((state: RootState) => state.theme.mode);
  const dispatch = useDispatch();

  return (
    <ContainerView style={{ backgroundColor: theme.background }}>
      <Header label="Chủ đề" paddingTop={top - 10}
      backgroundColor={theme.background}
          labelColor={theme.text}
          iconColor={theme.text} />
      <View style={[styles.content, { backgroundColor: theme.background, flex: 1 }]}>
        <Text style={[styles.title, { color: theme.text }]}>Chọn chế độ hiển thị:</Text>
        <TouchableOpacity
          style={[
            styles.button,
            mode === 'light' && { backgroundColor: '#8d1414ff' },
          ]}
          onPress={() => dispatch(setTheme('light'))}
        >
          <Text style={[styles.buttonText,]}>Sáng</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            mode === 'dark' && { backgroundColor: '#8d1414ff' },
          ]}
          onPress={() => dispatch(setTheme('dark'))}
        >
          <Text style={[styles.buttonText,]}>Tối</Text>
        </TouchableOpacity>
      </View>
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