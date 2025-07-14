import React from 'react';
import {View, StyleSheet,} from 'react-native';
import {ProgressSteps, ProgressStep} from 'react-native-progress-steps';
import {colors} from '../../../themes/colors'; // dùng theme của bạn

const OrderProgress = ({statusIndex = 0}) => {
  return (
    <View style={styles.container}>
      <ProgressSteps
        activeStep={statusIndex}
        completedStepIconColor={colors.green}
        completedProgressBarColor={colors.green}
        activeStepIconBorderColor={colors.green}
        progressBarColor={colors.gray3}
        activeLabelColor={colors.green}
        labelFontSize={12}
        labelColor={colors.gray3}
        completedLabelColor={colors.green}
        borderWidth={2}
        disabledStepIconColor={colors.gray3}
        completedStepNumColor={colors.green}
        activeStepNumColor={colors.green}
        activeStepIconColor={colors.while}>
        <ProgressStep label="Chờ xác nhận" removeBtnRow />
        <ProgressStep label="Đã xác nhận" removeBtnRow />
        <ProgressStep label="Chờ giao hàng" removeBtnRow />
        <ProgressStep label="Đã giao" removeBtnRow />
        {/* <ProgressStep label="Đã huỷ" removeBtnRow /> */}
      </ProgressSteps>
    </View>
  );
};

export default OrderProgress;

const styles = StyleSheet.create({
  container: {
    marginBottom: -20,
    marginTop: -45,
    paddingHorizontal: 10,
  },
});
