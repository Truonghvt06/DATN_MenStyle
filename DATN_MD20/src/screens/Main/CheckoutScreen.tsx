import React, {useState, useEffect, useRef} from 'react';
import {
  ScrollView,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Image,
  TextInput,
  Linking,
  AppState,
  AppStateStatus,
} from 'react-native';
import ContainerView from '../../components/layout/ContainerView';
import Header from '../../components/dataDisplay/Header';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ButtonBase from '../../components/dataEntry/Button/ButtonBase';
import Block from '../../components/layout/Block';
import metrics from '../../constants/metrics';
import {
  TextMedium,
  TextSizeCustom,
  TextSmall,
} from '../../components/dataEntry/TextBase';
import {IconSRC} from '../../constants/icons';
import useLanguage from '../../hooks/useLanguage';
import {useAppTheme} from '../../themes/ThemeContext';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {colors} from '../../themes/colors';
import navigation from '../../navigation/navigation';
import ScreenName from '../../navigation/ScreenName';
import TouchIcon from '../../components/dataEntry/Button/TouchIcon';
import {CreateOrderPayload} from '../../services/orders'; // Thêm dòng này
import {fetchAddresses} from '../../redux/actions/address';
import {fetchPaymentMethods} from '../../redux/actions/payment';
import {createOrder, getOrders} from '../../redux/actions/order';
import Toast from 'react-native-toast-message';
import ModalBottom from '../../components/dataDisplay/Modal/ModalBottom';
import VoucherItem from './Profile/Others/Voucher/VoucherItem';
import {fetchCart, removeCart} from '../../redux/actions/cart/cartAction';
import zaloService from '../../services/zalo';
import ModalCenter from '../../components/dataDisplay/Modal/ModalCenter';

interface CheckoutScreenProps {
  route?: {
    params?: {
      selectedItems: number[];
      list_Cart: any[];
    };
  };
}

const CheckoutScreen = ({route}: CheckoutScreenProps) => {
  const {top} = useSafeAreaInsets();
  const {getTranslation} = useLanguage();
  const theme = useAppTheme();
  const {selectedItems = [], list_Cart = []} = route?.params || {};

  const dispatch = useAppDispatch();
  const {user} = useAppSelector(state => state.auth);
  const {listAddress} = useAppSelector(state => state.address);
  const {listPaymentMethod} = useAppSelector(state => state.paymentMenthod);
  const {vouchers} = useAppSelector(state => state.voucher);
  const {orders} = useAppSelector(state => state.order);

  const voucherOrder = vouchers.filter(vc => {
    vc.voucher_scope === 'order';
  });
  const voucherShipping = vouchers.filter(vc => {
    vc.voucher_scope === 'shipping';
  });

  // State cho form thanh toán
  const [selectedAddress, setSelectedAddress] = useState<any>();
  const [paymentMethod, setPaymentMethod] = useState('COD'); // cod: tiền mặt, bank: chuyển khoản
  const [loading, setLoading] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<any>(null);
  const [showVoucherModal, setShowVoucherModal] = useState(false);

  // Danh sách voucher lấy từ backend
  const [availableVouchers, setAvailableVouchers] = useState<any[]>([]);

  //XU LY SAU KHI THANH TOAN ZALOPAY XONG
  const appState = useRef(AppState.currentState);
  const [showPaymentSuccessModal, setShowPaymentSuccessModal] = useState(false);

  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );
    return () => {
      subscription.remove();
    };
  }, []);
  //

  //DIA CHI
  useEffect(() => {
    dispatch(fetchAddresses());
    dispatch(getOrders());
  }, [dispatch]);

  // console.log('OOO: ', orders);

  //PaymenMethod
  useEffect(() => {
    dispatch(fetchPaymentMethods());
    // dispatch(fetchVouchers());
  }, []);

  useEffect(() => {
    if (listAddress.length === 0) return;

    // Nếu chưa có selectedAddress từ trước , thì chọn địa chỉ mặc định hoặc đầu tiên
    if (
      !selectedAddress ||
      (selectedAddress &&
        selectedAddress._id !== listAddress.find(a => a.is_default)?._id &&
        !listAddress.some(a => a._id === selectedAddress._id))
    ) {
      const defaultAddr = listAddress.find(a => a.is_default);
      setSelectedAddress(defaultAddr);
    }
  }, [listAddress]);

  ///

  useEffect(() => {}, []);

  // Lọc sản phẩm đã chọn
  const selectedProducts = list_Cart.filter((_, index) =>
    selectedItems.includes(index),
  );

  // console.log('PRO: ', selectedProducts);

  // Tính tổng tiền
  const subtotal = selectedProducts.reduce((sum, item) => {
    return sum + parseInt(item.quantity || '1') * (item.productId?.price || 0);
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

  //THONG BAO KHI THANH TOAN THANH CONG
  const handleAppStateChange = async (nextAppState: AppStateStatus) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      // App vừa được mở lại
      // Gọi API kiểm tra trạng thái đơn hàng ZaloPay

      const latestOrder = await dispatch(getOrders()).unwrap();
      const last = latestOrder?.[0];

      if (
        last?.payment_method_id?.code === 'ZALOPAY' &&
        last?.payment_status === 'paid'
      ) {
        // ✅ Hiển thị modal hoặc Toast
        Alert.alert('Thanh toán thành công', 'Cảm ơn bạn đã mua hàng!');
      }
    }

    appState.current = nextAppState;
  };

  // Xử lý thanh toán
  const handleCheckout = async () => {
    if (!selectedAddress) {
      Alert.alert('Lỗi', 'Vui lòng chọn địa chỉ giao hàng');
      return;
    }

    const items = selectedProducts.map(item => ({
      product_id: item.productId._id,
      product_variant_id:
        item.productId.variants?.[item.variantIndex]?._id || '',
      price: item.productId.price,
      quantity: item.quantity,
    }));

    const paymentMethodId =
      listPaymentMethod.find(pm => pm.code === paymentMethod)?._id ?? '';

    const payload: CreateOrderPayload = {
      user_id: user?._id,
      total_amount: total,
      shipping_address_id: selectedAddress._id,
      payment_method_id: paymentMethodId,
      items,
    };

    setLoading(true);

    try {
      // 🧾 COD
      if (paymentMethod === 'COD') {
        const resultAction = await dispatch(createOrder(payload));

        if (createOrder.fulfilled.match(resultAction)) {
          const indexDel = selectedProducts.map(item => ({
            productId: item.productId?._id,
            variantIndex: item.variantIndex,
          }));

          await dispatch(removeCart(indexDel)).unwrap();
          await dispatch(fetchCart());

          Toast.show({
            type: 'notification',
            position: 'top',
            text1: 'Thành công',
            text2: 'Đặt hàng thành công',
            visibilityTime: 1000,
            autoHide: true,
            swipeable: true,
          });

          navigation.navigate(ScreenName.Main.BottonTab);
        } else {
          const error: any = resultAction.payload || 'Đặt hàng thất bại';
          Alert.alert('Lỗi', error);
        }
      }

      // 💳 ZaloPay
      else if (paymentMethod === 'ZALOPAY') {
        const resultAction = await dispatch(createOrder(payload));

        if (createOrder.fulfilled.match(resultAction)) {
          const indexDel = selectedProducts.map(item => ({
            productId: item.productId?._id,
            variantIndex: item.variantIndex,
          }));

          await dispatch(removeCart(indexDel)).unwrap();
          await dispatch(fetchCart());
          await dispatch(getOrders());

          const createdOrder = resultAction.payload?.order;
          const order_id = createdOrder?._id;
          const order_code = createdOrder?.code || `MENSTYLE_${Date.now()}`;

          const zaloRes = await zaloService.createZaloPayOrder({
            amount: total,
            order_id,
            order_code,
            description: 'Thanh toán đơn hàng ZaloPay',
          });

          console.log('ZALO: ', zaloRes);

          const {order_url} = zaloRes;

          if (order_url) {
            //Áp dụng cho zaloPay Sandbox
            Linking.openURL(order_url);

            //Áp dụng cho zaloPay thật
            // const supported = await Linking.canOpenURL(order_url);
            // if (supported) {
            //   Linking.openURL(order_url);
            // } else {
            //   Alert.alert(
            //     'Không thể mở ZaloPay',
            //     'Vui lòng kiểm tra cài đặt app ZaloPay',
            //   );
            // }
          } else {
            Alert.alert('Lỗi', 'Không lấy được link thanh toán ZaloPay');
          }
          Toast.show({
            type: 'notification',
            position: 'top',
            text1: 'Thành công',
            text2: 'Đặt hàng thành công',
            visibilityTime: 1000,
            autoHide: true,
            swipeable: true,
          });

          navigation.navigate(ScreenName.Main.BottonTab);
        } else {
          const error: any = resultAction.payload || 'Đặt hàng thất bại';
          Alert.alert('Lỗi', error);
        }
      }
    } catch (error) {
      console.error('Checkout error:', error);
      Alert.alert('Lỗi', 'Không thể đặt hàng. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ContainerView style={{flex: 1, backgroundColor: theme.background}}>
      <Header
        // visibleLeft
        label="Thanh toán"
        paddingTop={top}
        backgroundColor={theme.background}
        labelColor={theme.text}
        iconColor={theme.text}
      />
      <ModalCenter
        visible={showPaymentSuccessModal}
        content={'Thanh toán ZaloPay thành công!'}
        onClose={() => setShowPaymentSuccessModal(false)}
      />

      <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
        {/* Thông tin địa chỉ */}
        <Block padH={metrics.space} padV={15}>
          <TextMedium bold style={{marginBottom: 10}}>
            Địa chỉ giao hàng
          </TextMedium>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              navigation.navigate(ScreenName.Main.Address);
            }}>
            {selectedAddress ? (
              <Block
                row
                backgroundColor={theme.background_item}
                pad={8}
                borderRadius={8}>
                <TouchIcon icon={IconSRC.icon_address} size={18} />
                <Block marL={8}>
                  <TextMedium bold>{selectedAddress.recipient_name}</TextMedium>
                  <TextSmall color={colors.gray} style={{marginTop: 5}}>
                    {selectedAddress.phone}
                  </TextSmall>
                  <TextSmall color={colors.gray} style={{marginTop: 5}}>
                    {selectedAddress.address_line}, {selectedAddress.ward},{' '}
                    {selectedAddress.district}, {selectedAddress.province}
                  </TextSmall>
                </Block>
              </Block>
            ) : (
              <Block
                backgroundColor={theme.card}
                padH={15}
                padV={12}
                borderRadius={8}
                borderW={0.3}
                borderColor={colors.primary}>
                <TextSmall color={colors.red}>
                  Chưa có địa chỉ giao hàng
                </TextSmall>
              </Block>
            )}
          </TouchableOpacity>
        </Block>

        {/* Chọn voucher */}
        <Block padH={metrics.space} padV={15}>
          <TextMedium bold style={{marginBottom: 10}}>
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
                    <TextSmall color={colors.while} style={{marginTop: 5}}>
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
                borderRadius={8}>
                <Block row justifyBW alignCT>
                  <TextSmall color={colors.gray}>Chưa có mã giảm giá</TextSmall>
                  <TouchIcon
                    icon={IconSRC.icon_back_right}
                    size={16}
                    color={colors.gray}
                  />
                </Block>
              </Block>
            </TouchableOpacity>
          )}
        </Block>

        {/* Danh sách sản phẩm */}
        <Block padH={metrics.space} padV={15}>
          <TextMedium bold style={{marginBottom: 10}}>
            Sản phẩm đã chọn ({selectedProducts.length})
          </TextMedium>
          {selectedProducts.map((item, index) => (
            <Block
              key={index}
              row
              alignCT
              backgroundColor={theme.card}
              pad={8}
              borderRadius={8}
              marB={10}>
              {/* <Block width={60} height={60} borderRadius={6} marR={12} /> */}
              <Image
                source={{
                  uri: item.productId?.variants?.[item.variantIndex]?.image,
                }}
                style={{width: 60, height: 70, borderRadius: 8}}
              />
              <Block flex1 marL={10}>
                <TextSmall medium numberOfLines={2} ellipsizeMode="tail">
                  {item.productId?.name}
                </TextSmall>
                <TextSizeCustom
                  size={12}
                  color={theme.gray}
                  style={{marginTop: 5}}>
                  SL: {item.quantity} x{' '}
                  {item.productId?.price?.toLocaleString('vi-VN')}VND
                </TextSizeCustom>
              </Block>
              <TextSmall medium>
                {(item.quantity * (item.productId?.price || 0)).toLocaleString(
                  'vi-VN',
                )}
                VND
              </TextSmall>
            </Block>
          ))}
        </Block>

        {/* Phương thức thanh toán */}
        <Block padH={metrics.space} padV={15}>
          <TextMedium bold style={{marginBottom: 10}}>
            Phương thức thanh toán
          </TextMedium>
          {listPaymentMethod.map((item, index) => {
            return (
              <Block key={index} row alignCT marB={10}>
                <TouchIcon
                  icon={
                    paymentMethod === item.code
                      ? IconSRC.icon_check
                      : IconSRC.icon_uncheck
                  }
                  size={20}
                  onPress={() => setPaymentMethod(item.code)}
                />
                <Image
                  source={{uri: item.image}}
                  style={{width: 25, height: 25, marginHorizontal: 10}}
                />
                <TextMedium>{item.name}</TextMedium>
              </Block>
            );
          })}
        </Block>

        {/* Tổng tiền */}
        <Block padH={metrics.space} padV={15}>
          <TextMedium bold style={{marginBottom: 10}}>
            Tổng đơn hàng
          </TextMedium>
          <Block row justifyBW marB={8}>
            <TextSmall color={colors.gray}>Tạm tính:</TextSmall>
            <TextSmall color={colors.gray}>
              {subtotal.toLocaleString('vi-VN')}đ
            </TextSmall>
          </Block>
          <Block row justifyBW marB={8}>
            <TextSmall color={colors.gray}>Phí vận chuyển:</TextSmall>
            <TextSmall color={colors.gray}>
              {shippingFee.toLocaleString('vi-VN')}đ
            </TextSmall>
          </Block>
          {discount > 0 && (
            <Block row justifyBW marB={8}>
              <TextSmall color={colors.green}>Giảm giá:</TextSmall>
              <TextSmall color={colors.green}>
                -{discount.toLocaleString('vi-VN')}đ
              </TextSmall>
            </Block>
          )}
          <Block
            row
            justifyBW
            marT={10}
            padT={10}
            borderTopW={0.3}
            borderColor={theme.border_color}>
            <TextMedium bold>Tổng cộng:</TextMedium>
            <TextSizeCustom size={18} bold color={theme.primary}>
              {total.toLocaleString('vi-VN')}VND
            </TextSizeCustom>
          </Block>
        </Block>
      </ScrollView>

      {/* Nút thanh toán */}
      <Block
        padH={metrics.space}
        padT={10}
        padB={45}
        backgroundColor={theme.background}>
        <ButtonBase
          title={`Thanh toán ( ${total.toLocaleString('vi-VN')}VND )`}
          onPress={handleCheckout}
          disabled={loading || !selectedAddress}
        />
      </Block>

      {/* Modal chọn voucher */}
      <ModalBottom
        header
        label={'Chọn voucher'}
        heightModal={metrics.diviceHeight * 0.8}
        visible={showVoucherModal}
        onClose={() => setShowVoucherModal(false)}>
        <ScrollView
          contentContainerStyle={{paddingHorizontal: 8, paddingTop: 15}}>
          <Block
            containerStyle={[
              styles.inputContainer,
              {borderColor: theme.border_color},
            ]}>
            <TextInput
              placeholder="Nhập mã voucher"
              style={{flex: 1, paddingLeft: 10}}
            />
            <TouchableOpacity activeOpacity={0.8} style={styles.btnVc}>
              <TextSmall style={{textAlign: 'center'}}>Áp dụng</TextSmall>
            </TouchableOpacity>
          </Block>
          <Block marT={20}>
            <TextMedium medium>Ưu đãi vận chuyển</TextMedium>
            {voucherOrder.map((item, index) => {
              return (
                <VoucherItem
                  key={index}
                  image={item.image}
                  icon={IconSRC.icon_check}
                  title={item.title}
                  description={item.description}
                  voucher_scope={item.voucher_scope}
                  discount_type={item.discount_type}
                  max_discount_value={item.max_discount_value}
                  discount_value={item.discount_value}
                  min_order_amount={item.min_order_amount}
                  date_from={item.date_from}
                  date_to={item.date_to}
                  code={item.code || ''}
                  onPress={() => {}}
                />
              );
            })}
          </Block>
          <Block marT={20}>
            <TextMedium medium>Mã giảm giá</TextMedium>
            {voucherShipping.map((item, index) => {
              return (
                <VoucherItem
                  key={index}
                  image={item.image}
                  icon={IconSRC.icon_check}
                  title={item.title}
                  description={item.description}
                  voucher_scope={item.voucher_scope}
                  discount_type={item.discount_type}
                  max_discount_value={item.max_discount_value}
                  discount_value={item.discount_value}
                  min_order_amount={item.min_order_amount}
                  date_from={item.date_from}
                  date_to={item.date_to}
                  code={item.code || ''}
                  onPress={() => {}}
                />
              );
            })}
          </Block>
        </ScrollView>
      </ModalBottom>
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
  inputContainer: {
    flexDirection: 'row',
    borderWidth: 0.3,
    borderRadius: 8,
    height: 40,
    overflow: 'hidden',
  },
  btnVc: {
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: colors.gray,
    height: '100%',
  },
});

//  <Modal
//         visible={showVoucherModal}
//         animationType="slide"
//         transparent={true}
//         onRequestClose={() => setShowVoucherModal(false)}>
//         <View style={styles.modalOverlay}>
//           <View
//             style={[styles.modalContent, {backgroundColor: theme.background}]}>
//             {/* Header modal */}
//             <Block row justifyBW alignCT padH={20} padV={15} borderBottomW={1}>
//               <TouchIcon
//                 icon={IconSRC.icon_back_left}
//                 size={20}
//                 onPress={() => setShowVoucherModal(false)}
//               />
//               <TextMedium bold>Chọn mã giảm giá</TextMedium>
//               <Block width={20} />
//             </Block>

//             {/* Danh sách voucher */}
//             <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
//               <Block padH={20} padV={15}>
//                 {availableVouchers
//                   .filter(voucher => subtotal >= voucher.minOrder)
//                   .map(voucher => (
//                     <TouchableOpacity
//                       key={voucher.id}
//                       onPress={() => handleSelectVoucher(voucher)}
//                       style={{
//                         backgroundColor: theme.card,
//                         padding: 15,
//                         borderRadius: 8,
//                         marginBottom: 12,
//                         borderWidth: 1,
//                       }}>
//                       <Block row justifyBW alignCT>
//                         <Block flex1>
//                           <Block row alignCT marB={5}>
//                             <TextMedium bold>{voucher.code}</TextMedium>
//                             {selectedVoucher?.id === voucher.id && (
//                               <Block
//                                 backgroundColor={colors.green}
//                                 padH={8}
//                                 padV={4}
//                                 borderRadius={12}
//                                 marL={10}>
//                                 <TextSmall color={colors.while} bold>
//                                   Đã chọn
//                                 </TextSmall>
//                               </Block>
//                             )}
//                           </Block>
//                           <TextSmall
//                             color={theme.gray}
//                             style={{marginBottom: 5}}>
//                             {voucher.name}
//                           </TextSmall>
//                           <TextSmall color={colors.red}>
//                             Đơn tối thiểu:{' '}
//                             {voucher.minOrder.toLocaleString('vi-VN')}đ
//                           </TextSmall>
//                           {voucher.discount > 0 && (
//                             <TextSmall
//                               color={colors.green}
//                               style={{marginTop: 3}}>
//                               Giảm {voucher.discount}%{' '}
//                               {voucher.maxDiscount
//                                 ? `(tối đa ${voucher.maxDiscount.toLocaleString(
//                                     'vi-VN',
//                                   )}đ)`
//                                 : ''}
//                             </TextSmall>
//                           )}
//                           {voucher.shippingDiscount && (
//                             <TextSmall
//                               color={colors.green}
//                               style={{marginTop: 3}}>
//                               Miễn phí vận chuyển
//                             </TextSmall>
//                           )}
//                         </Block>
//                         {selectedVoucher?.id === voucher.id ? (
//                           <TouchIcon
//                             icon={IconSRC.icon_check}
//                             size={20}
//                             color={colors.green}
//                           />
//                         ) : (
//                           <TouchIcon
//                             icon={IconSRC.icon_back_right}
//                             size={16}
//                             color={theme.gray}
//                           />
//                         )}
//                       </Block>
//                     </TouchableOpacity>
//                   ))}

//                 {availableVouchers.filter(
//                   voucher => subtotal >= voucher.minOrder,
//                 ).length === 0 && (
//                   <Block
//                     backgroundColor={theme.card}
//                     padH={20}
//                     padV={30}
//                     borderRadius={8}
//                     alignCT>
//                     <TextMedium color={theme.gray}>
//                       Không có voucher phù hợp
//                     </TextMedium>
//                     <TextSmall color={theme.gray} style={{marginTop: 5}}>
//                       Đơn hàng tối thiểu để sử dụng voucher: 200.000đ
//                     </TextSmall>
//                   </Block>
//                 )}
//               </Block>
//             </ScrollView>
//           </View>
//         </View>
//       </Modal>
