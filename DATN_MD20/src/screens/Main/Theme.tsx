import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import ContainerView from '../../components/layout/ContainerView';
import Header from '../../components/dataDisplay/Header';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store/index';
import { setTheme } from '../../redux/slice/ThemeSlice';
import { useAppTheme } from '../../themes/ThemeContext';

const ThemeScreen = () => {
  const theme = useAppTheme(); // object chứa màu sắc
  const { top } = useSafeAreaInsets();
  const mode = useSelector((state: RootState) => state.theme.mode); // 'light' | 'dark'
  const dispatch = useDispatch();

  return (
    <ContainerView style={{ backgroundColor: theme.background }}>
      <Header label="Chủ đề" paddingTop={top - 10} />
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.text }]}>Chọn chế độ hiển thị:</Text>
        <TouchableOpacity
          style={[
            styles.button,
            mode === 'light' && styles.selected,
          ]}
          onPress={() => dispatch(setTheme('light'))}
        >
          <Text style={[styles.buttonText]}>Sáng</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            mode === 'dark' && styles.selected,
          ]}
          onPress={() => dispatch(setTheme('dark'))}
        >
          <Text style={[styles.buttonText, { color: theme.text }]}>Tối</Text>
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
  },
  title: {
    fontSize: 18,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  button: {
    width: 120,
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#eee',
    alignItems: 'center',
    marginBottom: 15,
  },
  selected: {
    backgroundColor: '#4caf50',
  },
  buttonText: {
    fontSize: 16,
    color: '#222',
  },
});