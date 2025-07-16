import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Header from '../../../../../components/dataDisplay/Header';
import { useRoute } from '@react-navigation/native';
import { useAppTheme } from '../../../../../themes/ThemeContext';

const AddressDetailScreen = () => {
  const { top } = useSafeAreaInsets();
  const theme = useAppTheme();
  const route = useRoute();
  const { address } = route.params as { address: any };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Header
        label="Chi tiết địa chỉ"
        paddingTop={top}
        labelColor={theme.text}
        iconColor={theme.text}
        backgroundColor={theme.background}
      />
      <View style={styles.detailContainer}>
        <Text style={[styles.label, { color: theme.text }]}>Họ tên:</Text>
        <Text style={[styles.value, { color: theme.text }]}>{address.name}</Text>

        <Text style={[styles.label, { color: theme.text }]}>Số điện thoại:</Text>
        <Text style={[styles.value, { color: theme.text }]}>{address.phone}</Text>

        <Text style={[styles.label, { color: theme.text }]}>Địa chỉ:</Text>
        <Text style={[styles.value, { color: theme.text }]}>{address.fullAddress}</Text>
      </View>
    </View>
  );
};

export default AddressDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  detailContainer: {
    padding: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    marginBottom: 12,
  },
});
