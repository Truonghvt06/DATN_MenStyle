import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAppTheme } from '../../../themes/ThemeContext';

const ThemedButton = ({ title, type }: { title: string; type?: 'primary' | 'danger' | 'success' }) => {
  const theme = useAppTheme();
  const backgroundColor =
    type === 'danger' ? theme.danger : type === 'success' ? theme.success : theme.primary;

  return (
    <TouchableOpacity style={[styles.button, { backgroundColor }]}>
      <Text style={[styles.text, { color: '#fff' }]}>{title}</Text>
    </TouchableOpacity>
  );
};

export default ThemedButton;

const styles = StyleSheet.create({
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
  },
});
