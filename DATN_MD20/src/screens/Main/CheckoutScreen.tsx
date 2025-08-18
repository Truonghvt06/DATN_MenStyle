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
import {CreateOrderPayload, VoucherCode} from '../../services/orders'; // Thêm dòng này
import {fetchAddresses} from '../../redux/actions/address';
import {fetchPaymentMethods} from '../../redux/actions/payment';
import {createOrder, getOrders} from '../../redux/actions/order';
import Toast from 'react-native-toast-message';
import ModalBottom from '../../components/dataDisplay/Modal/ModalBottom';
import VoucherItem from './Profile/Others/Voucher/VoucherItem';
import {fetchCart, removeCart} from '../../redux/actions/cart/cartAction';
import zaloService from '../../services/zalo';
import ModalCenter from '../../components/dataDisplay/Modal/ModalCenter';
import {
  fetchAvailableVouchers,
  useVoucherAction,
} from '../../redux/actions/voucher';
import {Voucher} from '../../services/voucher';
import {formatMoneyShort} from '../../utils/formatDate';

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
  const {availableVouchers} = useAppSelector(state => state.voucher);
  const {orders} = useAppSelector(state => state.order);

  // console.log('VOUCHER: ', availableVouchers);

  // State cho form thanh toán
  const [selectedAddress, setSelectedAddress] = useState<any>();
  const [paymentMethod, setPaymentMethod] = useState('COD'); // cod: tiền mặt, bank: chuyển khoản
  const [loading, setLoading] = useState(false);

  //XU LY SAU KHI THANH TOAN ZALOPAY XONG
  const appState = useRef(AppState.currentState);
  const [showPaymentSuccessModal, setShowPaymentSuccessModal] = useState(false);

  //VOUCHER
  // const [selectedVoucher, setSelectedVoucher] = useState<any>(null);
  const [showVoucherModal, setShowVoucherModal] = useState(false);
  const [selectedOrderVoucher, setSelectedOrderVoucher] =
    useState<Voucher | null>(null);
  const [selectedShippingVoucher, setSelectedShippingVoucher] =
    useState<Voucher | null>(null);

  const [showAllOrder, setShowAllOrder] = useState(false);
  const [showAllShipping, setShowAllShipping] = useState(false);
  // thêm 2 state nháp dùng riêng trong modal
  const [draftOrderVoucher, setDraftOrderVoucher] = useState<Voucher | null>(
    null,
  );
  const [draftShippingVoucher, setDraftShippingVoucher] =
    useState<Voucher | null>(null);

  // khi mở modal, copy từ state thật -> state nháp
  useEffect(() => {
    if (showVoucherModal) {
      setDraftOrderVoucher(selectedOrderVoucher);
      setDraftShippingVoucher(selectedShippingVoucher);
    }
  }, [showVoucherModal]);

  //XU LY SAU KHI THANH TOAN ZALOPAY XONG
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
    dispatch(fetchAvailableVouchers());
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

  ///VOUCHER
  const voucherOrder: Voucher[] = [];
  const voucherShipping: Voucher[] = [];
  const applyingVouchersRef = useRef(false);

  availableVouchers.forEach(vc => {
    if (vc?.min_order_amount <= subtotal) {
      (vc.voucher_scope === 'order' ? voucherOrder : voucherShipping).push(vc);
    }
  });

  // console.log('VOUCHER ORDER:', voucherOrder);
  // console.log('VOUCHER SHIPPING:', voucherShipping);

  const applySelectedVouchers = async (orderId?: string) => {
    if (applyingVouchersRef.current) return; // tránh gọi trùng
    applyingVouchersRef.current = true;

    if (!orderId) {
      applyingVouchersRef.current = false;
      return; // chưa có orderId thì không gọi API useVoucher
    }

    const tasks: Promise<any>[] = [];
    if (selectedOrderVoucher?._id) {
      tasks.push(
        dispatch(
          useVoucherAction({voucherId: selectedOrderVoucher._id, orderId}),
        ).unwrap(),
      );
    }
    if (selectedShippingVoucher?._id) {
      tasks.push(
        dispatch(
          useVoucherAction({voucherId: selectedShippingVoucher._id, orderId}),
        ).unwrap(),
      );
    }

    try {
      await Promise.all(tasks);
      // cập nhật lại store để ẩn voucher đã dùng khỏi danh sách
      setSelectedOrderVoucher(null);
      setSelectedShippingVoucher(null);
      dispatch(fetchAvailableVouchers());
    } catch (e) {
      console.log('applySelectedVouchers error:', e);
    }
  };

  const handleRemoveOrderVoucher = () => setSelectedOrderVoucher(null);
  const handleRemoveShippingVoucher = () => setSelectedShippingVoucher(null);
  const handleDraftSelectOrder = (v: Voucher) =>
    setDraftOrderVoucher(prev => (prev?.code === v.code ? null : v));

  const handleDraftSelectShipping = (v: Voucher) =>
    setDraftShippingVoucher(prev => (prev?.code === v.code ? null : v));

  const handleApplyVouchers = () => {
    setSelectedOrderVoucher(draftOrderVoucher);
    setSelectedShippingVoucher(draftShippingVoucher);
    setShowVoucherModal(false);
  };

  const calcOrderDiscount = (vc?: Voucher) => {
    if (!vc) return 0;
    let d = 0;
    if (vc.discount_type === 'percentage')
      d = (subtotal * (vc.discount_value ?? 0)) / 100;
    else d = vc.discount_value ?? 0;
    if (vc.max_discount_value) d = Math.min(d, vc.max_discount_value);
    return Math.max(0, d);
  };

  const calcShippingDiscount = (vc?: Voucher) => {
    if (!vc) return 0;
    let d = 0;
    if (vc.discount_type === 'percentage')
      d = (shippingFee * (vc.discount_value ?? 0)) / 100;
    else d = vc.discount_value ?? 0;
    if (vc.max_discount_value) d = Math.min(d, vc.max_discount_value);
    d = Math.min(d, shippingFee); // không giảm quá phí ship
    return Math.max(0, d);
  };

  const discountOrder = calcOrderDiscount(selectedOrderVoucher ?? undefined);
  const discountShipping = calcShippingDiscount(
    selectedShippingVoucher ?? undefined,
  );

  // Tổng tiền mới
  const total = Math.max(
    0,
    subtotal + shippingFee - discountOrder - discountShipping,
  );

  const getTitle = ({
    discount_type,
    discount_value,
    max_discount_value,
  }: any) => {
    if (discount_type === 'percentage') {
      return `Giảm ${discount_value}% Giảm tối đa ${formatMoneyShort(
        max_discount_value ?? 0,
      )}`;
    } else {
      return `Giảm ${formatMoneyShort(discount_value ?? 0)}`;
    }
  };

  ////////////////////////////////

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
        const orderId = last?._id;
        await applySelectedVouchers(orderId);
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

    const voucher_code: VoucherCode = {
      code_order: selectedOrderVoucher?.code,
      order_discount: discountOrder,
      code_shipping: selectedShippingVoucher?.code,
      shipping_discount: discountShipping,
    };

    const paymentMethodId =
      listPaymentMethod.find(pm => pm.code === paymentMethod)?._id ?? '';

    const payload: CreateOrderPayload = {
      user_id: user?._id,
      total_amount: total,
      shipping_address_id: selectedAddress._id,
      payment_method_id: paymentMethodId,
      items,
      voucher_code,
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
          const createdOrder = resultAction.payload?.order;
          const orderId = createdOrder?._id;

          await dispatch(removeCart(indexDel)).unwrap();
          await dispatch(fetchCart());
          await applySelectedVouchers(orderId);

          // Toast.show({
          //   type: 'notification',
          //   position: 'top',
          //   text1: 'Thành công',
          //   text2: 'Đặt hàng thành công',
          //   visibilityTime: 1000,
          //   autoHide: true,
          //   swipeable: true,
          // });

          navigation.navigate(ScreenName.Main.SuccessCheckout);
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
        <Block padH={metrics.space} padV={10}>
          <TextMedium bold style={{marginBottom: 8}}>
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
        <Block padH={metrics.space} padV={10}>
          <TextMedium bold style={{marginBottom: 8}}>
            Mã giảm giá
          </TextMedium>

          <TouchableOpacity
            activeOpacity={1}
            onPress={() => setShowVoucherModal(true)}>
            <Block
              backgroundColor={theme.card}
              padH={15}
              padV={12}
              borderRadius={8}>
              {selectedOrderVoucher || selectedShippingVoucher ? (
                <>
                  {selectedOrderVoucher && (
                    <Block row justifyBW alignCT marB={8}>
                      <Block flex1>
                        <TextMedium medium>
                          {getTitle(selectedOrderVoucher)}
                        </TextMedium>
                        <TextSmall color={colors.gray}>
                          {selectedOrderVoucher.code}
                        </TextSmall>
                      </Block>
                      <TouchIcon
                        icon={IconSRC.icon_close}
                        size={10}
                        onPress={handleRemoveOrderVoucher}
                        containerStyle={{
                          // backgroundColor: colors.while,
                          padding: 8,
                          borderRadius: 12,
                        }}
                      />
                    </Block>
                  )}
                  {selectedShippingVoucher && (
                    <Block row justifyBW alignCT>
                      <Block flex1>
                        <TextMedium bold>
                          {getTitle(selectedShippingVoucher)}
                        </TextMedium>
                        <TextSmall color={colors.gray}>
                          {selectedShippingVoucher.code}
                        </TextSmall>
                      </Block>
                      <TouchIcon
                        icon={IconSRC.icon_close}
                        size={10}
                        onPress={handleRemoveShippingVoucher}
                        containerStyle={{
                          padding: 8,
                          borderRadius: 12,
                        }}
                      />
                    </Block>
                  )}
                </>
              ) : (
                <Block row justifyBW alignCT>
                  <TextSmall color={colors.gray}>Chưa chọn voucher</TextSmall>
                  <TouchIcon
                    icon={IconSRC.icon_back_right}
                    size={16}
                    color={colors.gray}
                  />
                </Block>
              )}
            </Block>
          </TouchableOpacity>
        </Block>

        {/* Danh sách sản phẩm */}
        <Block padH={metrics.space} padV={10}>
          <TextMedium bold style={{marginBottom: 8}}>
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
                  color={colors.gray}
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
        <Block padH={metrics.space} padV={10}>
          <TextMedium bold style={{marginBottom: 8}}>
            Phương thức thanh toán
          </TextMedium>
          {listPaymentMethod.map((item, index) => {
            return (
              <TouchableOpacity
                key={index}
                activeOpacity={1}
                style={styles.paymentMethod}
                onPress={() => setPaymentMethod(item.code)}>
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
              </TouchableOpacity>
            );
          })}
        </Block>

        {/* Tổng tiền */}
        <Block padH={metrics.space} padV={10}>
          <TextMedium bold style={{marginBottom: 8}}>
            Tổng đơn hàng
          </TextMedium>
          <Block row justifyBW marB={8}>
            <TextSmall color={colors.gray}>Tạm tính:</TextSmall>
            <TextSmall color={colors.gray}>
              {subtotal.toLocaleString('vi-VN')}VND
            </TextSmall>
          </Block>
          <Block row justifyBW marB={8}>
            <TextSmall color={colors.gray}>Phí vận chuyển:</TextSmall>
            <TextSmall color={colors.gray}>
              {shippingFee.toLocaleString('vi-VN')}VND
            </TextSmall>
          </Block>
          {selectedOrderVoucher && (
            <Block row justifyBW marB={8}>
              <TextSmall color={colors.gray}>Giảm giá đơn hàng:</TextSmall>
              <TextSmall color={discountOrder > 0 ? colors.red : colors.gray}>
                {discountOrder > 0
                  ? `-${discountOrder.toLocaleString('vi-VN')}VND`
                  : '0VND'}
              </TextSmall>
            </Block>
          )}

          {selectedShippingVoucher && (
            <Block row justifyBW marB={8}>
              <TextSmall color={colors.gray}>Giảm phí vận chuyển:</TextSmall>
              <TextSmall
                color={discountShipping > 0 ? colors.red : colors.gray}>
                {discountShipping > 0
                  ? `-${discountShipping.toLocaleString('vi-VN')}VND`
                  : '0VND'}
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
          // title={`Thanh toán ( ${total.toLocaleString('vi-VN')}VND )`}
          title={'Đặt hàng'}
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
        <>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 8,
              paddingTop: 15,
              paddingBottom: 50,
            }}>
            <Block
              containerStyle={[
                styles.inputContainer,
                {borderColor: theme.border_color},
              ]}>
              <TextInput
                placeholder="Nhập mã voucher"
                placeholderTextColor={theme.placeholderTextColor}
                style={{flex: 1, paddingLeft: 10}}
              />
              <TouchableOpacity activeOpacity={0.8} style={styles.btnVc}>
                <TextSmall style={{textAlign: 'center'}}>Áp dụng</TextSmall>
              </TouchableOpacity>
            </Block>

            {/* === VOUCHER SHIPPING === */}
            <Block marT={20}>
              <TextMedium medium style={{marginBottom: 8}}>
                Ưu đãi vận chuyển
              </TextMedium>

              {(showAllShipping
                ? voucherShipping
                : voucherShipping.slice(0, 2)
              ).map((item, index) => {
                const isSelected = draftShippingVoucher?.code === item.code; // dùng draft
                return (
                  <VoucherItem
                    key={`${item.code}-${index}`}
                    image={item.image}
                    icon={
                      isSelected ? IconSRC.icon_check : IconSRC.icon_uncheck
                    }
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
                    onPress={() => handleDraftSelectShipping(item)} // <— dùng handler draft
                    onPressAll={() => handleDraftSelectShipping(item)}
                  />
                );
              })}

              {voucherShipping.length > 2 && (
                <TouchableOpacity
                  onPress={() => setShowAllShipping(v => !v)}
                  style={{paddingVertical: 8}}>
                  <TextSmall medium color={colors.primary}>
                    {showAllShipping
                      ? 'Thu gọn'
                      : `Xem thêm (${voucherShipping.length - 2})`}
                  </TextSmall>
                </TouchableOpacity>
              )}
            </Block>

            {/* === VOUCHER ORDER === */}
            <Block marT={20}>
              <TextMedium medium style={{marginBottom: 8}}>
                Ưu đãi đơn hàng
              </TextMedium>

              {(showAllOrder ? voucherOrder : voucherOrder.slice(0, 2)).map(
                (item, index) => {
                  const isSelected = draftOrderVoucher?.code === item.code; // dùng draft
                  return (
                    <VoucherItem
                      key={`${item.code}-${index}`}
                      image={item.image}
                      icon={
                        isSelected ? IconSRC.icon_check : IconSRC.icon_uncheck
                      }
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
                      onPress={() => handleDraftSelectOrder(item)} // <— dùng handler draft
                      onPressAll={() => handleDraftSelectOrder(item)}
                    />
                  );
                },
              )}

              {voucherOrder.length > 2 && (
                <TouchableOpacity
                  onPress={() => setShowAllOrder(v => !v)}
                  style={{paddingVertical: 8}}>
                  <TextSmall medium color={colors.primary}>
                    {showAllOrder
                      ? 'Thu gọn'
                      : `Xem thêm (${voucherOrder.length - 2})`}
                  </TextSmall>
                </TouchableOpacity>
              )}
            </Block>
          </ScrollView>
          <Block padH={8} padB={45} padT={10}>
            <ButtonBase
              title={'Áp dụng'}
              onPress={() => {
                handleApplyVouchers();
              }}
            />
          </Block>
        </>
      </ModalBottom>
    </ContainerView>
  );
};

export default CheckoutScreen;

const styles = StyleSheet.create({
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
  },
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
    borderWidth: 0.5,
    borderRadius: 8,
    height: 40,
    overflow: 'hidden',
  },
  btnVc: {
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: colors.gray3,
    height: '100%',
  },
});
