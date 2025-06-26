import React from 'react';
import {View, StyleSheet, Text, Image} from 'react-native';
import StepIndicator from 'react-native-step-indicator';
import {colors} from '../../../themes/colors';
import {Check} from 'lucide-react-native'; // Hoặc dùng icon từ react-native-vector-icons
import {IconSRC} from '../../../constants/icons';
import {colorGradient} from '../../../themes/theme_gradient';

const labels = ['Chờ xác nhận', 'Đã xác nhận', 'Chờ giao hàng', 'Đã giao'];

const customStyles = {
  stepIndicatorSize: 37,
  currentStepIndicatorSize: 43,
  separatorStrokeWidth: 2,
  stepStrokeCurrentColor: colors.green,
  stepStrokeWidth: 2.5,
  stepStrokeFinishedColor: colors.green,
  stepStrokeUnFinishedColor: colors.gray3,
  separatorUnFinishedColor: colors.gray3,
  separatorFinishedColor: colors.green,
  stepIndicatorFinishedColor: colors.green,
  stepIndicatorUnFinishedColor: colors.gray3,
  stepIndicatorCurrentColor: colors.green,
  stepIndicatorLabelFontSize: 14,
  currentStepIndicatorLabelFontSize: 14,
  stepIndicatorLabelCurrentColor: colors.while,
  stepIndicatorLabelFinishedColor: colors.while,
  stepIndicatorLabelUnFinishedColor: colors.while,
  labelColor: colors.gray3,
  labelSize: 12,
  currentStepLabelColor: colors.green,
};

interface Props {
  status: string;
}

const OrderStatusStep = ({status}: Props) => {
  const statusIndex: any = {
    'Chờ xác nhận': 0,
    'Đã xác nhận': 1,
    'Chờ giao hàng': 2,
    'Đã giao': 3,
  };

  const currentPosition = statusIndex[status] ?? 0;

  // ✅ Custom render để hiển thị dấu tick cho các bước đã hoàn thành
  const renderStepIndicator = ({position, stepStatus}: any) => {
    if (stepStatus === 'finished') {
      return (
        <View style={styles.circle}>
          <Image source={IconSRC.ic_check} style={styles.check} />
        </View>
      );
    }

    return (
      <View
        style={[
          styles.circle,
          {
            backgroundColor:
              stepStatus === 'current' ? colors.green : colors.gray3,
          },
        ]}>
        <Text style={styles.label}>{position + 1}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StepIndicator
        customStyles={customStyles}
        currentPosition={currentPosition}
        labels={labels}
        stepCount={labels.length}
        renderStepIndicator={renderStepIndicator}
      />
    </View>
  );
};

export default OrderStatusStep;

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
  },
  circle: {
    width: 37,
    height: 37,
    borderRadius: 18.5,
    backgroundColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  check: {
    width: 20,
    height: 20,
    tintColor: colors.while,
  },
});
