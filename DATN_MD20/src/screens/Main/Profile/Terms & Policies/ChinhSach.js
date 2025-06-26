import React from 'react';
import {ScrollView, StyleSheet, Text} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import Header from '../../../../components/dataDisplay/Header';
import ContainerView from '../../../../components/layout/ContainerView';
import ButtonOption from '../../../../components/dataEntry/Button/BottonOption';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const ChinhSach = () => {
  const {top} = useSafeAreaInsets();
  const navigation = useNavigation();

  return (
    <ContainerView>
      <Header label="Chính sách riêng tư" paddingTop={top} />
      <ScrollView style={styles.container}>
        <Text style={styles.title}>1. Thu thập thông tin</Text>
        <Text style={styles.text}>
          Chúng tôi thu thập các thông tin cá nhân của bạn như họ tên, địa chỉ,
          số điện thoại, email khi bạn đăng ký tài khoản hoặc mua hàng...
        </Text>

        <Text style={styles.title}>2. Sử dụng thông tin</Text>
        <Text style={styles.text}>
          Chúng tôi sử dụng thông tin cá nhân để xử lý đơn hàng, cải thiện dịch
          vụ, gửi thông tin khuyến mãi và chăm sóc khách hàng...
        </Text>

        <Text style={styles.title}>3. Bảo mật</Text>
        <Text style={styles.text}>
          Chúng tôi cam kết bảo mật thông tin của bạn, không chia sẻ cho bên thứ
          ba nếu không có sự cho phép...
        </Text>
      </ScrollView>
    </ContainerView>
  );
};

export default ChinhSach;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 6,
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
  },
});
