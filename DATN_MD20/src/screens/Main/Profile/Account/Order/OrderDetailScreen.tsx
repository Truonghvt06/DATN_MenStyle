import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import ContainerView from '../../../../../components/layout/ContainerView';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Header from '../../../../../components/dataDisplay/Header';
import {useRoute} from '@react-navigation/native';
import Block from '../../../../../components/layout/Block';
import {
  TextHeight,
  TextMedium,
  TextSizeCustom,
  TextSmall,
} from '../../../../../components/dataEntry/TextBase';
import metrics from '../../../../../constants/metrics';
import {dataItemOrder} from '../../../../../constants/data';
import {IconSRC} from '../../../../../constants/icons';
import OrderStatusStep from '../../../../../components/dataDisplay/Order/OrderStatusStep';
import ButtonBase from '../../../../../components/dataEntry/Button/ButtonBase';
import ModalBottom from '../../../../../components/dataDisplay/Modal/ModalBottom';
import RadioGroup, {RadioButton} from 'react-native-radio-buttons-group';
import useLanguage from '../../../../../hooks/useLanguage';
import {useAppTheme} from '../../../../../themes/ThemeContext';
import navigation from '../../../../../navigation/navigation';
import ScreenName from '../../../../../navigation/ScreenName';
import {useAppDispatch, useAppSelector} from '../../../../../redux/store';
import {fetchNotifications} from '../../../../../redux/actions/notification';
import {colors} from '../../../../../themes/colors';
import {getOrderDetail} from '../../../../../redux/actions/order';
import moment from 'moment';

const OrderDetailScreen = () => {
  const {top} = useSafeAreaInsets();
  const {getTranslation} = useLanguage();
  const {orderId, screen} = useRoute().params as {
    orderId?: any;
    screen?: string;
  };
  const [isOpen, setIsOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [selectedId, setSelectedId] = useState<string | undefined>();
  const theme = useAppTheme();

  const dispatch = useAppDispatch();
  const {order} = useAppSelector(state => state.order);

  console.log('AAAA', order);

  const displayData = showAll ? dataItemOrder : dataItemOrder.slice(0, 2);
  const reasons = [
    {id: '1', label: getTranslation('thay_doi_y')},
    {id: '2', label: getTranslation('tim_mau_moi')},
    {id: '3', label: getTranslation('thoi_gian_cham')},
    {id: '4', label: getTranslation('chon_nhan_size')},
    {id: '5', label: getTranslation('khac')},
  ];

  useEffect(() => {
    dispatch(getOrderDetail(orderId));
  }, []);

  // Lấy 2 ký tự đầu
  const first2 = order?._id?.slice(0, 2);
  // Lấy 4 ký tự giữa (ví dụ từ vị trí 10 đến 14)
  const middle4 = order?._id?.slice(10, 14);
  // Lấy 2 ký tự cuối
  const last2 = order?._id?.slice(-2);
  // Gộp thành mã đơn hàng
  const orderCode = `${first2}${middle4}${last2}`.toUpperCase();

  const formattedItems =
    order?.items?.map((item: any) => {
      const variant = item.product_id?.variants.find(
        (v: any) => v._id === item.product_variant_id,
      );
      // {
      //   order.items?.product_id?.name;
      // }
      // {
      //   order.quantity;
      // }
      // {
      //   order.items.price?.toLocaleString('vi-VN');
      // }
      return {
        ...item,
        image: variant?.image, // FlatList dùng Image source = { uri: ... }
        color: variant?.color,
        size: variant?.size,
      };
    }) || [];

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Chờ xác nhận';
      case 'confirmed':
        return 'Đã xác nhận';
      case 'shipping':
        return 'Chờ giao hàng';
      case 'delivered':
        return 'Đã giao';
      case 'cancelled':
        return 'Đã huỷ';
      default:
        return 'Không rõ';
    }
  };

  const handleToggle = () => setShowAll(prev => !prev);

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'pending':
        return colors.blue2;
      case 'confirmed':
        return colors.blue1;
      case 'shipping':
        return colors.orange;
      case 'delivered':
        return colors.green1;
      case 'cancelled':
        return colors.red;
      default:
        return colors.gray;
    }
  };

  const handleBack = async () => {
    if (screen === 'notification') {
      await dispatch(fetchNotifications());
      navigation.goBack();
    } else {
      navigation.goBack();
    }
  };

  return (
    <ContainerView containerStyle={{backgroundColor: theme.background}}>
      <Header
        label={getTranslation('chi_tiet_don_hang')}
        paddingTop={top}
        backgroundColor={theme.background}
        labelColor={theme.text}
        onPressLeft={handleBack}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 80}}>
        <Block padH={metrics.space} padV={20}>
          <Block row justifyBW>
            <Block>
              <TextHeight
                numberOfLines={1}
                ellipsizeMode="tail"
                bold
                color={theme.text}>
                ID: #{orderCode}
              </TextHeight>
              <TextSizeCustom size={12} color={colors.gray}>
                {getTranslation('ngay')}:{' '}
                {moment(order?.createdAt).format('DD/MM/YYYY')}
              </TextSizeCustom>
            </Block>
            <Block
              containerStyle={[
                styles.status,
                {backgroundColor: getStatusColor(order?.status)},
              ]}>
              <TextSmall color={colors.while}>
                {getStatusText(order?.status)}
              </TextSmall>
            </Block>
          </Block>

          {order?.status !== 'cancelled' && (
            <Block marT={30}>
              <TextHeight medium color={theme.text}>
                {getTranslation('trang_thai_don_hang')}
              </TextHeight>
              <OrderStatusStep status={order?.status} />
            </Block>
          )}

          <Block marT={30}>
            <TextHeight medium color={theme.text}>
              {getTranslation('san_pham')}{' '}
              <TextSmall color={colors.gray}>
                ({order?.items?.length} {getTranslation('san_pham_')})
              </TextSmall>
            </TextHeight>
            {formattedItems.map((item: any, index: number) => {
              return (
                <Block
                  key={index}
                  row
                  padV={8}
                  borderBottomW={0.3}
                  borderColor={theme.border_color}>
                  <Image source={{uri: item?.image}} style={styles.image} />
                  <Block padH={10} flex5>
                    <TextSmall
                      numberOfLines={2}
                      ellipsizeMode="tail"
                      style={styles.text}
                      medium>
                      {item.product_id?.name}
                    </TextSmall>
                    <Block row>
                      <TextSizeCustom size={12} color={colors.gray}>
                        Size: {item?.size} |{' '}
                      </TextSizeCustom>
                      <TextSizeCustom size={12} color={colors.gray}>
                        {getTranslation('mau')}: {item?.color} |{' '}
                      </TextSizeCustom>
                      <TextSizeCustom size={12} color={colors.gray}>
                        SL: {item?.quantity}
                      </TextSizeCustom>
                    </Block>
                    <TextMedium medium color={colors.primary}>
                      {item?.price?.toLocaleString('vi-VN')}VND
                    </TextMedium>
                  </Block>
                </Block>
              );
            })}
            {order?.items?.length > 2 && (
              <TouchableOpacity
                onPress={handleToggle}
                style={{alignItems: 'center', marginTop: 10}}>
                <TextSmall color={theme.text}>
                  {showAll
                    ? getTranslation('an_bot')
                    : getTranslation('xem_them')}
                </TextSmall>
              </TouchableOpacity>
            )}
          </Block>

          <Block marT={30}>
            <TextHeight medium color={theme.text}>
              {getTranslation('thong_tin_giao_hang')}
            </TextHeight>
            <Block row marT={5} alignCT>
              <Image
                source={IconSRC.icon_address}
                style={[styles.icon_add, {tintColor: theme.icon}]}
              />
              <TextSmall color={theme.text}>
                {`${order?.shipping_address_id?.address_line}, ${order?.shipping_address_id?.ward}, ${order?.shipping_address_id?.district}, ${order?.shipping_address_id?.province}`}
              </TextSmall>
            </Block>
          </Block>

          <Block marT={30}>
            <TextHeight medium color={theme.text}>
              {getTranslation('thanh_toan')}
            </TextHeight>
            <TextSmall color={theme.text}>
              {getTranslation('phuong_thuc_thanh_toan')}:{' '}
              {`${order?.payment_method_id?.code}`}
            </TextSmall>
          </Block>

          <Block row justifyBW alignCT marV={30}>
            <TextHeight medium color={theme.text}>
              {getTranslation('tong_cong')}:
            </TextHeight>
            <TextHeight medium color={theme.text}>
              {order?.total_amount?.toLocaleString('vi-VN')}VND
            </TextHeight>
          </Block>

          <ButtonBase
            title={
              order?.status !== 'cancelled'
                ? getTranslation('huy_don')
                : getTranslation('mua_lai')
            }
            onPress={() => setIsOpen(true)}
          />
        </Block>
      </ScrollView>

      <ModalBottom
        header
        label={getTranslation('chon_ly_do')}
        heightModal={450}
        visible={isOpen}
        onClose={() => setIsOpen(false)}>
        <ScrollView style={{flex: 1, padding: 8}}>
          {reasons.map(reason => (
            <RadioButton
              key={reason.id}
              id={reason.id}
              label={reason.label}
              value={reason.label}
              selected={selectedId === reason.id}
              onPress={setSelectedId}
              labelStyle={[styles.label, {color: theme.text}]}
              containerStyle={styles.radioContainer}
              size={20}
            />
          ))}
          <ButtonBase
            containerStyle={{marginTop: 30}}
            title={getTranslation('xac_nhan_huy')}
            onPress={() => {}}
          />
        </ScrollView>
      </ModalBottom>
    </ContainerView>
  );
};

export default OrderDetailScreen;

const styles = StyleSheet.create({
  image: {width: 70, height: 85, borderRadius: 10},
  status: {
    borderRadius: 20,
    paddingVertical: 5,
    height: 30,
    width: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {},
  icon_add: {width: 20, height: 20, marginRight: 10},
  radioContainer: {alignItems: 'center', marginVertical: 13, gap: 10},
  label: {fontSize: 16, marginLeft: 8},
});
