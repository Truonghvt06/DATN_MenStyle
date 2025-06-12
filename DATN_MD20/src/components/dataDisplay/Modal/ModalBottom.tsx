import {
  DimensionValue,
  Modal,
  ModalProps,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import React from 'react';
import {colors} from '../../../themes/colors';
import metrics from '../../../constants/metrics';

interface Props extends ModalProps {
  // children?:
  onClose?: () => void;
  containerStyle?: ViewStyle | any;
  viewStyle?: ViewStyle | any;
  widthModal?: DimensionValue;
  heightModal?: DimensionValue;
}
const ModalBottom = (props: Props) => {
  const {
    onClose,
    containerStyle,
    viewStyle,
    widthModal = metrics.diviceWidth,
    heightModal = metrics.diviceHeight,
  } = props;
  return (
    <Modal transparent={true} {...props}>
      <View style={[styles.container, viewStyle]}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={{height: '100%', width: '100%'}}
          onPress={onClose}></TouchableOpacity>

        <View
          style={[
            styles.modal,
            {width: widthModal, height: heightModal},
            containerStyle,
          ]}>
          {props.children}
        </View>
      </View>
    </Modal>
  );
};

export default ModalBottom;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  modal: {
    overflow: 'hidden',
    backgroundColor: colors.while,
    borderRadius: 10,
    alignSelf: 'center',
    maxWidth: '100%',
    maxHeight: '90%',
    borderTopLeftRadius: metrics.space * 2,
    borderTopRightRadius: metrics.space * 2,
  },
});
