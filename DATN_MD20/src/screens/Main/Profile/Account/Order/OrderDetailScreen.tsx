import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useMemo, useState} from 'react';
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
import {colors} from '../../../../../themes/colors';
import metrics from '../../../../../constants/metrics';
import {dataItemOrder} from '../../../../../constants/data';
import {IconSRC} from '../../../../../constants/icons';
import OrderProgress from '../../../../../components/dataDisplay/Order/OrderProgress';
import OrderStatusStep from '../../../../../components/dataDisplay/Order/OrderStatusStep';
import ButtonBase from '../../../../../components/dataEntry/Button/ButtonBase';
import ModalBottom from '../../../../../components/dataDisplay/Modal/ModalBottom';
import RadioGroup, {RadioButton} from 'react-native-radio-buttons-group';

const OrderDetailScreen = () => {
  const {top} = useSafeAreaInsets();
  const route = useRoute();
  const {orders} = route.params as {orders?: any};
  const [isOpen, setIsOpen] = useState(false);
  const [showAll, setShowAll] = useState(false); // NEW
  const [selectedId, setSelectedId] = useState<string | undefined>();

  const displayData = showAll ? dataItemOrder : dataItemOrder.slice(0, 2);

  const reasons = [
    {id: '1', label: 'Thay đổi ý định'},
    {id: '2', label: 'Tìm được mẫu ưng hơn'},
    {id: '3', label: 'Thời gian giao hàng chậm'},
    {id: '4', label: 'Chọn nhầm size hoặc màu sắc'},
    {id: '5', label: 'Khác'},
  ];

  const handleToggle = () => {
    setShowAll(prev => !prev);
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'Chờ xác nhận':
        return colors.blue2;
      case 'Đã xác nhận':
        return colors.blue1;
      case 'Chờ giao hàng':
        return colors.orange;
      case 'Đã giao':
        return colors.green1;
      case 'Đã huỷ':
        return colors.red;
      default:
        return colors.gray;
    }
  };
  const getStatusIndex = (status: string) => {
    switch (status) {
      case 'Chờ xác nhận':
        return 0;
      case 'Đã xác nhận':
        return 1;
      case 'Chờ giao hàng':
        return 2;
      case 'Đã giao':
        return 3;
      default:
        return 0;
    }
  };

  return (
    <ContainerView>
      <Header label="Chi tiết đơn hàng" paddingTop={top} />
      <ScrollView contentContainerStyle={{paddingBottom: 80}}>
        <Block padH={metrics.space} padV={20}>
          <Block row justifyBW>
            <Block>
              <TextHeight numberOfLines={1} ellipsizeMode="tail" bold>
                ID: #ABCDEFD
              </TextHeight>
              <TextSizeCustom size={12} color={colors.gray}>
                Đặt hàng: 12/05/2025
              </TextSizeCustom>
            </Block>
            <Block
              containerStyle={[
                styles.status,
                {
                  //   backgroundColor: colors.green1,
                  backgroundColor: getStatusColor(orders?.status),
                },
              ]}>
              <TextSmall color={colors.while}>{orders?.status}</TextSmall>
            </Block>
          </Block>

          {/* Trang thái  */}
          {orders?.status !== 'Đã huỷ' && (
            <Block marT={30}>
              <TextHeight medium>Trạng thái đơn hàng</TextHeight>
              {/* <OrderProgress statusIndex={getStatusIndex(orders?.status)} /> */}
              <OrderStatusStep status={orders?.status} />
            </Block>
          )}
          {/* Sản phẩm   */}
          <Block marT={30}>
            <TextHeight medium>
              Sản phẩm{' '}
              <TextSmall color={colors.gray}>
                ({dataItemOrder.length} sản phẩm)
              </TextSmall>
            </TextHeight>

            {displayData.map(item => (
              <Block
                row
                padV={8}
                borderBottomW={0.3}
                borderColor={colors.gray1}>
                <Image source={item.image} style={styles.image} />
                <Block padH={10} flex5>
                  <TextSmall
                    numberOfLines={2}
                    ellipsizeMode="tail"
                    style={styles.text}
                    medium>
                    {item.name}
                  </TextSmall>
                  <Block row>
                    <TextSizeCustom size={12} color={colors.gray}>
                      Size: {item.size} |{' '}
                    </TextSizeCustom>
                    <TextSizeCustom size={12} color={colors.gray}>
                      Màu: {item.color} |{' '}
                    </TextSizeCustom>
                    <TextSizeCustom size={12} color={colors.gray}>
                      SL: {item.quantity}
                    </TextSizeCustom>
                  </Block>
                  <TextMedium medium color={colors.red}>
                    {item.price.toLocaleString('vi-VN')}đ
                  </TextMedium>
                </Block>
              </Block>
            ))}
            {dataItemOrder.length > 2 ? (
              <TouchableOpacity
                onPress={handleToggle}
                style={{alignItems: 'center', marginTop: 10}}>
                <TextSmall>{showAll ? 'Ẩn bớt ' : 'Xem thêm'}</TextSmall>
              </TouchableOpacity>
            ) : null}
          </Block>

          {/* Địa chỉ  */}
          <Block marT={30}>
            <TextHeight medium>Thông tin giao hàng</TextHeight>
            <Block row marT={5} alignCT>
              <Image source={IconSRC.icon_address} style={styles.icon_add} />
              <TextSmall>
                Phương Canh, Xuân Phương, Nam Từ Liêm, Hà Nội
              </TextSmall>
            </Block>
          </Block>

          {/* Thanh toán  */}
          <Block marT={30}>
            <TextHeight medium>Thanh toán</TextHeight>
            <TextSmall>Phương thức: COD</TextSmall>
          </Block>
          <Block row justifyBW alignCT marV={30}>
            <TextHeight bold>Tổng cộng:</TextHeight>
            <TextHeight bold>890.000đ</TextHeight>
          </Block>
          {orders?.status !== 'Đã huỷ' ? (
            <ButtonBase
              title="Huỷ đơn hàng"
              onPress={() => {
                setIsOpen(true);
              }}
            />
          ) : (
            <ButtonBase
              title="Mua lại"
              onPress={() => {
                setIsOpen(true);
              }}
            />
          )}
        </Block>
      </ScrollView>
      <ModalBottom
        header
        label="Chọn lý do"
        heightModal={metrics.diviceScreenHeight * 0.55}
        visible={isOpen}
        onClose={() => setIsOpen(false)}>
        <View style={{flex: 1, paddingHorizontal: 16, paddingVertical: 12}}>
          <ScrollView
            style={{flexGrow: 0}}
            contentContainerStyle={{paddingBottom: 20}}>
            {reasons.map(reason => (
              <RadioButton
                key={reason.id}
                id={reason.id}
                label={reason.label}
                value={reason.label}
                selected={selectedId === reason.id}
                onPress={setSelectedId}
                labelStyle={styles.label}
                size={20}
                containerStyle={styles.radioContainer}
              />
            ))}
          </ScrollView>

          <View style={styles.btnContainer}>
            <ButtonBase title="Xác nhận huỷ" onPress={() => {}} />
          </View>
        </View>
      </ModalBottom>
    </ContainerView>
  );
};

export default OrderDetailScreen;

const styles = StyleSheet.create({
  image: {
    width: 70,
    height: 85,
    borderRadius: 10,
  },
  status: {
    borderRadius: 20,
    paddingVertical: 5,
    height: 30,
    width: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    // marginRight: 65,
  },
  icon_add: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  radioContainer: {
    alignItems: 'center',
    marginVertical: 13,
    gap: 10,
  },
  label: {
    fontSize: 16,
    marginLeft: 8,
  },
  btnContainer: {
    paddingTop: 12,
  },
});
