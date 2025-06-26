import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import React from 'react';
import {ImgSRC} from '../../constants/icons'; // Đảm bảo đường dẫn đúng
import {colors} from '../../themes/colors';

const ThongTinCaNhan = ({navigation}) => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>{'< Quay Lại'}</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Sửa Hồ sơ</Text>

        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveText}>Lưu</Text>
        </TouchableOpacity>
      </View>

      {/* Avatar */}
      <View style={styles.avatarContainer}>
        <Image style={styles.avatar} source={ImgSRC.img_avatar} />
        <Text style={styles.avatarName}>Sửa</Text>
      </View>

      {/* Info Form */}
      <ScrollView style={styles.form}>
        {renderItem('Họ Và Tên', 'Cập Nhập Ngay')}
        {renderItem('Bio', 'Thiết lập ngay', true)}
        {renderItem('Giới tính', 'Nam')}
        {renderItem('Ngày sinh', '**/09/20**')}
        {renderItem('Điện thoại', '********01')}
        {renderItem('Email', 'h*****i@gmail.com', true, 'Xác nhận ngay', 'red')}
        {renderItem('Tài khoản liên kết')}
      </ScrollView>
    </SafeAreaView>
  );
};

const renderItem = (label, value = '', arrow = true, actionText = '', color) => (
  <View style={styles.item}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.itemRight}>
      <Text style={[styles.value, color ? {color} : {}]}>{value}</Text>
      {actionText ? <Text style={[styles.actionText, {color}]}>{actionText}</Text> : null}
      {arrow && <Text style={styles.arrow}>{'›'}</Text>}
    </View>
  </View>
);

export default ThongTinCaNhan;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    position: 'absolute',
    left: 16,
    top: 16,
  },
  saveButton: {
    position: 'absolute',
    right: 16,
    top: 16,
  },
  backText: {
    fontSize: 16,
    color: '#007AFF',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  saveText: {
    fontSize: 16,
    color: '#ccc',
  },
  avatarContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#ff6534',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 5,
    backgroundColor: '#eee',
  },
  avatarName: {
    color: colors.white,
    fontSize: 16,
  },
  form: {
    backgroundColor: '#f5f5f5',
  },
  item: {
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    color: '#333',
  },
  itemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  value: {
    fontSize: 14,
    color: '#999',
    marginRight: 6,
  },
  actionText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  arrow: {
    fontSize: 18,
    color: '#999',
    marginLeft: 4,
  },
});
