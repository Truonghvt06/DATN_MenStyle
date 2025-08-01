import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Modal,
} from 'react-native';
import ContainerView from '../../components/layout/ContainerView';
import Header from '../../components/dataDisplay/Header';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ButtonBase from '../../components/dataEntry/Button/ButtonBase';
import Block from '../../components/layout/Block';
import metrics from '../../constants/metrics';
import {
  TextMedium,
  TextSizeCustom,
  TextSmall,
} from '../../components/dataEntry/TextBase';
import { IconSRC } from '../../constants/icons';
import useLanguage from '../../hooks/useLanguage';
import { useAppTheme } from '../../themes/ThemeContext';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { colors } from '../../themes/colors';
import navigation from '../../navigation/navigation';
import ScreenName from '../../navigation/ScreenName';
import TouchIcon from '../../components/dataEntry/Button/TouchIcon';
import orderService from '../../services/orders'; // Thêm dòng này
import { axiosInstance } from '../../services';

interface CheckoutScreenProps {
  route?: {
    params?: {
      selectedItems: number[];
      cartData: any[];
    };
  };
}

const FIXED_ADDRESS = {
  recipient_name: "Nguyễn Văn A",
  phone: "0901234567",
  address_line: "123 Đường ABC",
  ward: "Phường 1",
  district: "Quận 1",
  province: "TP.HCM",
  is_default: true,
};

const CheckoutScreen = ({ route }: CheckoutScreenProps) => {
  const { top } = useSafeAreaInsets();
  const { getTranslation } = useLanguage();
  const theme = useAppTheme();
  const { user } = useAppSelector(state => state.auth);
  // const { listAddress } = useAppSelector(state => state.address);

  const { selectedItems = [], cartData = [] } = route?.params || {};
  
  // State cho form thanh toán
  const [selectedAddress, setSelectedAddress] = useState<any>(FIXED_ADDRESS);
  const [paymentMethod, setPaymentMethod] = useState('cod'); // cod: tiền mặt, bank: chuyển khoản
  const [loading, setLoading] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<any>(null);
  const [showVoucherModal, setShowVoucherModal] = useState(false);

  // Danh sách voucher lấy từ backend
  const [availableVouchers, setAvailableVouchers] = useState<any[]>([]);

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const res = await axiosInstance.get('/vouchers/api/vouchers');
        // Chuyển đổi dữ liệu nếu cần để phù hợp với UI
        const vouchers = (res.data.vouchers || []).map((v: any) => ({
          id: v._id,
          code: v.code,
          name: v.description || v.code,
          discount: v.discount_type === 'percentage' ? v.discount_value : 0,
          shippingDiscount: 0, // Nếu có trường riêng cho freeship thì map vào đây
          minOrder: v.min_order_amount || 0,
          maxDiscount: v.discount_type === 'percentage' ? v.max_discount || undefined : undefined,
          ...v,
        }));
        setAvailableVouchers(vouchers);
      } catch (error) {
        setAvailableVouchers([]);
      }
    };
    fetchVouchers();
  }, []);

  // Lọc sản phẩm đã chọn
  const selectedProducts = cartData.filter((_, index) => selectedItems.includes(index));

  // Tính tổng tiền
  const subtotal = selectedProducts.reduce((sum, item) => {
    return sum + (parseInt(item.quantity || '1') * (item.productId?.price || 0));
  }, 0);

  const shippingFee = 30000; // Phí vận chuyển
  
  // Tính giảm giá từ voucher
  const calculateDiscount = () => {
    if (!selectedVoucher) return 0;
    
    let discount = 0;
    
    if (selectedVoucher.discount > 0) {
      // Giảm giá theo %
      discount = (subtotal * selectedVoucher.discount) / 100;
      if (selectedVoucher.maxDiscount) {
        discount = Math.min(discount, selectedVoucher.maxDiscount);
      }
    }
    
    if (selectedVoucher.shippingDiscount) {
      // Giảm phí vận chuyển
      discount += selectedVoucher.shippingDiscount;
    }
    
    return discount;
  };

  const discount = calculateDiscount();
  const total = subtotal + shippingFee - discount;

  // Hàm chọn voucher
  const handleSelectVoucher = (voucher: any) => {
    setSelectedVoucher(voucher);
    setShowVoucherModal(false);
  };

  // Hàm xóa voucher
  const handleRemoveVoucher = () => {
    setSelectedVoucher(null);
  };

  // Xử lý thanh toán
  const handleCheckout = async () => {
    if (!selectedAddress) {
      Alert.alert('Lỗi', 'Vui lòng chọn địa chỉ giao hàng');
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        userId: user?._id,
        products: selectedProducts,
        address: selectedAddress,
        paymentMethod,
        voucher: selectedVoucher,
        subtotal,
        shippingFee,
        discount,
        total,
      };
      await orderService.createOrder(orderData);

      Alert.alert(
        'Thành công',
        'Đơn hàng đã được đặt thành công!',
        [
          {
            text: 'OK',
            onPress: () => {
              navigation.navigate(ScreenName.Main.Cart);
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể đặt hàng. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ContainerView style={{ flex: 1, backgroundColor: theme.background }}>
      <Header
        visibleLeft
        label="Thanh toán"
        paddingTop={top}
        backgroundColor={theme.background}
        labelColor={theme.text}
        iconColor={theme.text}
      />

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* Thông tin địa chỉ */}
        <Block padH={metrics.space} padV={15}>
          <TextMedium bold style={{ marginBottom: 10 }}>
            Địa chỉ giao hàng
          </TextMedium>
          {selectedAddress ? (
            <Block
              backgroundColor={theme.card}
              padH={15}
              padV={12}
              borderRadius={8}
              borderWidth={1}
              >
              <TextMedium bold>{selectedAddress.recipient_name}</TextMedium>
              <TextSmall color={theme.gray} style={{ marginTop: 5 }}>
                {selectedAddress.phone}
              </TextSmall>
              <TextSmall color={theme.gray} style={{ marginTop: 5 }}>
                {selectedAddress.address_line}, {selectedAddress.ward}, {selectedAddress.district}, {selectedAddress.province}
              </TextSmall>
            </Block>
          ) : (
            <Block
              backgroundColor={theme.card}
              padH={15}
              padV={12}
              borderRadius={8}
              borderWidth={1}
              borderColor={colors.red}>
              <TextSmall color={colors.red}>
                Chưa có địa chỉ giao hàng
              </TextSmall>
            </Block>
          )}
        </Block>

        {/* Chọn voucher */}
        <Block padH={metrics.space} padV={15}>
          <TextMedium bold style={{ marginBottom: 10 }}>
            Mã giảm giá
          </TextMedium>
          {selectedVoucher ? (
            <TouchableOpacity onPress={() => setShowVoucherModal(true)}>
              <Block
                backgroundColor={colors.green}
                padH={15}
                padV={12}
                borderRadius={8}
                borderWidth={1}
                borderColor={colors.green}>
                <Block row justifyBW alignCT>
                  <Block flex1>
                    <TextMedium bold color={colors.while}>
                      {selectedVoucher.code}
                    </TextMedium>
                    <TextSmall color={colors.while} style={{ marginTop: 5 }}>
                      {selectedVoucher.name}
                    </TextSmall>
                  </Block>
                  <TouchIcon
                    icon={IconSRC.icon_close}
                    size={16}
                    onPress={handleRemoveVoucher}
                    containerStyle={{
                      backgroundColor: colors.while,
                      padding: 8,
                      borderRadius: 12,
                    }}
                  />
                </Block>
              </Block>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => setShowVoucherModal(true)}>
              <Block
                backgroundColor={theme.card}
                padH={15}
                padV={12}
                borderRadius={8}
                borderWidth={1}
                >
                <Block row justifyBW alignCT>
                  <TextSmall color={theme.gray}>
                    Chưa có mã giảm giá
                  </TextSmall>
                  <TouchIcon
                    icon={IconSRC.icon_back_right}
                    size={16}
                    color={theme.gray}
                  />
                </Block>
              </Block>
            </TouchableOpacity>
          )}
        </Block>

        {/* Danh sách sản phẩm */}
        <Block padH={metrics.space} padV={15}>
          <TextMedium bold style={{ marginBottom: 10 }}>
            Sản phẩm đã chọn ({selectedProducts.length})
          </TextMedium>
          {selectedProducts.map((item, index) => (
            <Block
              key={index}
              row
              alignCT
              backgroundColor={theme.card}
              padH={15}
              padV={12}
              borderRadius={8}
              marB={10}>
              <Block
                
                width={60}
                height={60}
                borderRadius={6}
                marR={12}
              />
              <Block flex1>
                <TextMedium numberOfLines={2}>{item.productId?.name}</TextMedium>
                <TextSmall color={theme.gray} style={{ marginTop: 5 }}>
                  SL: {item.quantity} x {item.productId?.price?.toLocaleString('vi-VN')}đ
                </TextSmall>
              </Block>
              <TextMedium bold>
                {(item.quantity * (item.productId?.price || 0)).toLocaleString('vi-VN')}đ
              </TextMedium>
            </Block>
          ))}
        </Block>

        {/* Phương thức thanh toán */}
        <Block padH={metrics.space} padV={15}>
          <TextMedium bold style={{ marginBottom: 10 }}>
            Phương thức thanh toán
          </TextMedium>
          <Block row alignCT marB={10}>
            <TouchIcon
              icon={paymentMethod === 'cod' ? IconSRC.icon_check : IconSRC.icon_uncheck}
              size={20}
              onPress={() => setPaymentMethod('cod')}
            />
            <TextMedium style={{ marginLeft: 10 }}>Tiền mặt khi nhận hàng</TextMedium>
          </Block>
          <Block row alignCT>
            <TouchIcon
              icon={paymentMethod === 'bank' ? IconSRC.icon_check : IconSRC.icon_uncheck}
              size={20}
              onPress={() => setPaymentMethod('bank')}
            />
            <TextMedium style={{ marginLeft: 10 }}>Chuyển khoản ngân hàng</TextMedium>
          </Block>
        </Block>

        {/* Tổng tiền */}
        <Block padH={metrics.space} padV={15}>
          <TextMedium bold style={{ marginBottom: 10 }}>
            Tổng đơn hàng
          </TextMedium>
          <Block row justifyBW marB={8}>
            <TextSmall color={theme.gray}>Tạm tính:</TextSmall>
            <TextSmall color={theme.gray}>{subtotal.toLocaleString('vi-VN')}đ</TextSmall>
          </Block>
          <Block row justifyBW marB={8}>
            <TextSmall color={theme.gray}>Phí vận chuyển:</TextSmall>
            <TextSmall color={theme.gray}>{shippingFee.toLocaleString('vi-VN')}đ</TextSmall>
          </Block>
          {discount > 0 && (
            <Block row justifyBW marB={8}>
              <TextSmall color={colors.green}>Giảm giá:</TextSmall>
              <TextSmall color={colors.green}>-{discount.toLocaleString('vi-VN')}đ</TextSmall>
            </Block>
          )}
          <Block row justifyBW marT={10} padT={10} borderTopW={1}>
            <TextMedium bold>Tổng cộng:</TextMedium>
            <TextSizeCustom size={18} bold color={colors.red}>
              {total.toLocaleString('vi-VN')}đ
            </TextSizeCustom>
          </Block>
        </Block>
      </ScrollView>

      {/* Nút thanh toán */}
      <Block padH={metrics.space} padV={15} backgroundColor={theme.background}>
        <ButtonBase
          title={loading ? 'Đang xử lý...' : `Thanh toán ${total.toLocaleString('vi-VN')}đ`}
          onPress={handleCheckout}
          disabled={loading || !selectedAddress}
        />
      </Block>

      {/* Modal chọn voucher */}
      <Modal
        visible={showVoucherModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowVoucherModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
            {/* Header modal */}
            <Block
              row
              justifyBW
              alignCT
              padH={20}
              padV={15}
              borderBottomW={1}
              >
              <TouchIcon
                icon={IconSRC.icon_back_left}
                size={20}
                onPress={() => setShowVoucherModal(false)}
              />
              <TextMedium bold>Chọn mã giảm giá</TextMedium>
              <Block width={20} />
            </Block>

            {/* Danh sách voucher */}
            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
              <Block padH={20} padV={15}>
                {availableVouchers
                  .filter(voucher => subtotal >= voucher.minOrder)
                  .map((voucher) => (
                    <TouchableOpacity
                      key={voucher.id}
                      onPress={() => handleSelectVoucher(voucher)}
                      style={{
                        backgroundColor: theme.card,
                        padding: 15,
                        borderRadius: 8,
                        marginBottom: 12,
                        borderWidth: 1,
                        
                      }}>
                      <Block row justifyBW alignCT>
                        <Block flex1>
                          <Block row alignCT marB={5}>
                            <TextMedium bold>{voucher.code}</TextMedium>
                            {selectedVoucher?.id === voucher.id && (
                              <Block
                                backgroundColor={colors.green}
                                padH={8}
                                padV={4}
                                borderRadius={12}
                                marL={10}>
                                <TextSmall color={colors.while} bold>
                                  Đã chọn
                                </TextSmall>
                              </Block>
                            )}
                          </Block>
                          <TextSmall color={theme.gray} style={{ marginBottom: 5 }}>
                            {voucher.name}
                          </TextSmall>
                          <TextSmall color={colors.red}>
                            Đơn tối thiểu: {voucher.minOrder.toLocaleString('vi-VN')}đ
                          </TextSmall>
                          {voucher.discount > 0 && (
                            <TextSmall color={colors.green} style={{ marginTop: 3 }}>
                              Giảm {voucher.discount}% {voucher.maxDiscount ? `(tối đa ${voucher.maxDiscount.toLocaleString('vi-VN')}đ)` : ''}
                            </TextSmall>
                          )}
                          {voucher.shippingDiscount && (
                            <TextSmall color={colors.green} style={{ marginTop: 3 }}>
                              Miễn phí vận chuyển
                            </TextSmall>
                          )}
                        </Block>
                        {selectedVoucher?.id === voucher.id ? (
                          <TouchIcon
                            icon={IconSRC.icon_check}
                            size={20}
                            color={colors.green}
                          />
                        ) : (
                          <TouchIcon
                            icon={IconSRC.icon_back_right}
                            size={16}
                            color={theme.gray}
                          />
                        )}
                      </Block>
                    </TouchableOpacity>
                  ))}
                
                {availableVouchers.filter(voucher => subtotal >= voucher.minOrder).length === 0 && (
                  <Block
                    backgroundColor={theme.card}
                    padH={20}
                    padV={30}
                    borderRadius={8}
                    alignCT>
                    <TextMedium color={theme.gray}>
                      Không có voucher phù hợp
                    </TextMedium>
                    <TextSmall color={theme.gray} style={{ marginTop: 5 }}>
                      Đơn hàng tối thiểu để sử dụng voucher: 200.000đ
                    </TextSmall>
                  </Block>
                )}
              </Block>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ContainerView>
  );
};

export default CheckoutScreen;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    height: '70%',
    borderRadius: 10,
    overflow: 'hidden',
  },
}); 