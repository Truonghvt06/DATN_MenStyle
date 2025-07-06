import { StyleSheet, Text, View, FlatList, Image, Alert, TouchableOpacity, Modal, Pressable } from 'react-native';
import React, { useState } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import Header from '../../components/dataDisplay/Header';
import useLanguage from '../../hooks/useLanguage';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ButtonBase from '../../components/dataEntry/Button/ButtonBase';
import ContainerView from '../../components/layout/ContainerView';
import Block from '../../components/layout/Block';
import metrics from '../../constants/metrics';
import {colors} from '../../themes/colors';
import {
  TextMedium,
  TextSizeCustom,
} from '../../components/dataEntry/TextBase';

const VOUCHERS = [
  { code: 'SALE20K', discount: 20000, label: 'Giảm 20.000đ cho đơn từ 100.000đ' },
  { code: 'SALE50K', discount: 50000, label: 'Giảm 50.000đ cho đơn từ 300.000đ' },
  { code: 'FREESHIP', discount: 15000, label: 'Giảm 15.000đ phí vận chuyển' },
];

const PAYMENT_METHODS = [
  { code: 'CASH', label: 'Thanh toán khi nhận hàng' },
  { code: 'BANK', label: 'Chuyển khoản ngân hàng' },
  { code: 'EWALLET', label: 'Ví điện tử' },
];

const PaymentScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const {getTranslation} = useLanguage();
  const {top} = useSafeAreaInsets();
  const items = route.params?.items || [];

  // State cho voucher và modal
  const [voucher, setVoucher] = useState<{code: string, discount: number, label: string} | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<{code: string, label: string} | null>(null);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);

  // Tạm tính
  const subTotal = items.reduce(
    (sum: number, item: any) => sum + Number(item.price) * Number(item.quantity),
    0
  );
  // Giảm giá voucher
  const voucherDiscount = voucher ? voucher.discount : 0;
  // Thành tiền
  const total = Math.max(subTotal - voucherDiscount, 0);

  const handlePayment = () => {
    Alert.alert('Thanh toán thành công!');
    navigation.goBack();
  };

  // Chọn voucher từ modal
  const handleSelectVoucher = (v: any) => {
    setVoucher(v);
    setModalVisible(false);
  };

  return (
    <ContainerView>
      <Header
        visibleLeft
        label={getTranslation('Thanh toán')}
        paddingTop={top}
      />

      <View style={{flex: 1}}>
        <FlatList
          data={items}
          keyExtractor={(item) => item.id + ''}
          renderItem={({ item }) => (
            <View style={styles.itemRow}>
              <Image source={item.image} style={styles.image} />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.info}>Màu: {item.color} | Size: {item.size}</Text>
                <Text style={styles.info}>Số lượng: {item.quantity}</Text>
              </View>
              <Text style={styles.price}>{Number(item.price).toLocaleString('vi-VN')}đ</Text>
            </View>
          )}
          contentContainerStyle={{paddingBottom: 220}}
        />

        {/* Nút chọn voucher */}
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={[
            styles.voucherRow,
            { marginVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: colors.primary, backgroundColor: '#fffbe6' }
          ]}
        >
          <Text style={[styles.voucherText, { fontWeight: 'bold', color: colors.primary }]}>
            {voucher ? `Voucher: ${voucher.code} (-${voucher.discount.toLocaleString('vi-VN')}đ)` : 'Chọn voucher'}
          </Text>
          <Text style={{color: colors.primary, fontSize: 22}}>{'>'}</Text>
        </TouchableOpacity>

        {/* Nút chọn phương thức thanh toán */}
        <TouchableOpacity
          onPress={() => setPaymentModalVisible(true)}
          style={[
            styles.voucherRow,
            { marginVertical: 0, borderRadius: 8, borderWidth: 1, borderColor: colors.primary, backgroundColor: '#e6f7ff' }
          ]}
        >
          <Text style={[styles.voucherText, { fontWeight: 'bold', color: colors.primary }]}>
            {paymentMethod ? ` ${paymentMethod.label}` : 'Chọn phương thức thanh toán'}
          </Text>
          <Text style={{color: colors.primary, fontSize: 22}}>{'>'}</Text>
        </TouchableOpacity>
      </View>

      {/* Modal chọn voucher */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <View style={styles.modalContent}>
            <Text style={{fontWeight: 'bold', fontSize: 18, marginBottom: 12}}>Chọn voucher</Text>
            {VOUCHERS.map(v => (
              <TouchableOpacity
                key={v.code}
                style={[
                  styles.voucherItem,
                  voucher?.code === v.code && {borderColor: colors.primary, borderWidth: 2}
                ]}
                onPress={() => {
                  setVoucher(v);
                  setModalVisible(false);
                }}
              >
                <Text style={{fontSize: 16, fontWeight: 'bold'}}>{v.code}</Text>
                <Text style={{fontSize: 14, color: '#555'}}>{v.label}</Text>
                <Text style={{color: colors.green, marginTop: 4}}>-{v.discount.toLocaleString('vi-VN')}đ</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>

      {/* Modal chọn phương thức thanh toán */}
      <Modal
        visible={paymentModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setPaymentModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setPaymentModalVisible(false)}>
          <View style={styles.modalContent}>
            <Text style={{fontWeight: 'bold', fontSize: 18, marginBottom: 12}}>Chọn phương thức thanh toán</Text>
            {PAYMENT_METHODS.map(pm => (
              <TouchableOpacity
                key={pm.code}
                style={[
                  styles.voucherItem,
                  paymentMethod?.code === pm.code && {borderColor: colors.primary, borderWidth: 2}
                ]}
                onPress={() => {
                  setPaymentMethod(pm);
                  setPaymentModalVisible(false);
                }}
              >
                <Text style={{fontSize: 16, fontWeight: 'bold'}}>{pm.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>

      {/* Chi tiết tổng tiền */}
      <Block
        w100
        padV={5}
        padH={metrics.space}
        backgroundColor={colors.while}
        borderBottomW={0.6}
        borderColor={colors.gray3}
        positionA
        bottom0
        style={{zIndex: 10}}
      >
        <Block marB={6} row justifyBW alignCT>
          <TextMedium>Tạm tính:</TextMedium>
          <TextSizeCustom size={18} color={colors.black}>
            {subTotal.toLocaleString('vi-VN')}đ
          </TextSizeCustom>
        </Block>
        <Block marB={6} row justifyBW alignCT>
          <TextMedium>Voucher giảm giá:</TextMedium>
          <TextSizeCustom size={18} color={colors.green}>
            -{voucherDiscount.toLocaleString('vi-VN')}đ
          </TextSizeCustom>
        </Block>
        <Block marB={10} row justifyBW alignCT>
          <TextMedium bold>Thành tiền:</TextMedium>
          <TextSizeCustom size={20} bold color={colors.red}>
            {total.toLocaleString('vi-VN')}đ
          </TextSizeCustom>
        </Block>
        <ButtonBase title={getTranslation('thanh_toan')} onPress={handlePayment} />
      </Block>
    </ContainerView>
  );
};

export default PaymentScreen;

const styles = StyleSheet.create({
  itemRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  image: { width: 60, height: 60, borderRadius: 8, backgroundColor: '#eee' },
  name: { fontSize: 16, fontWeight: 'bold' },
  info: { fontSize: 14, color: '#555' },
  price: { fontSize: 16, fontWeight: 'bold', color: '#e53935', marginLeft: 8 },
  voucherRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f7f7f7',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  voucherText: { fontSize: 16, color: '#333' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    elevation: 5,
  },
  voucherItem: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    marginBottom: 12,
    borderColor: '#eee',
    borderWidth: 1,
  },
});