import React from 'react';
import {ScrollView, StyleSheet, Text} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';

import Header from '../../components/dataDisplay/Header';
import ContainerView from '../../components/layout/ContainerView';
import ButtonOption from '../../components/dataEntry/Button/BottonOption';

const DieuKhoanVaDieuKien = () => {
  const {top} = useSafeAreaInsets();
  const navigation = useNavigation();

  return (
    <ContainerView>
       <Header
        visibleLeft
        label="Điều Khoản"
        paddingTop={top}
        containerStyle={{
          alignItems: 'center',
          justifyContent: 'center',
          height: 45,
        }}
        labelStyle={{
          fontSize: 16,
          fontWeight: '600',
          textAlign: 'center',
        }}
        numberOfLines={1}
      />
      <ScrollView style={styles.container}>
        <Text style={styles.title}>1. Giới thiệu</Text>
        <Text style={styles.text}>
          Bằng việc sử dụng ứng dụng này, bạn đồng ý với các điều khoản và điều kiện được quy định tại đây...
        </Text>

        <Text style={styles.title}>2. Trách nhiệm người dùng</Text>
        <Text style={styles.text}>
          Bạn có trách nhiệm cung cấp thông tin chính xác, không sử dụng ứng dụng vào mục đích gian lận, lừa đảo...
        </Text>

        <Text style={styles.title}>3. Sửa đổi điều khoản</Text>
        <Text style={styles.text}>
          Chúng tôi có thể cập nhật điều khoản bất kỳ lúc nào, và bạn có trách nhiệm theo dõi và tuân thủ...
        </Text>

        <ButtonOption
          name="Quay lại"
          content="Quay về trang tài khoản"
          iconLeft={null}
          sizeLeft={0}
          borderBottom={0}
          onPress={() => navigation.goBack()}
          containerStyle={{
            marginTop: 30,
            marginBottom: 50,
          }}
        />
      </ScrollView>
    </ContainerView>
  );
};

export default DieuKhoanVaDieuKien;

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
