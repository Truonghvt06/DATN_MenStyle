import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from 'react-native';
import React from 'react';
import {colors} from '../../../themes/colors';
import metrics from '../../../constants/metrics';

interface Props {
  widthModal?: number;
  heightModal?: number;
  containerStyle?: ViewStyle;
  onClose?: () => void;
}
const ModalCenter = (props: Props) => {
  const {
    widthModal = metrics.diviceWidth,
    heightModal = metrics.diviceHeight,
    containerStyle,
    onClose,
  } = props;
  return (
    <Modal transparent={true} {...props}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.container}>
          <View
            style={[
              styles.modal,
              {width: widthModal, height: heightModal},
              containerStyle,
            ]}>
            <Text>ModalCenter</Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default ModalCenter;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modal: {
    // flex: 1,
    overflow: 'hidden',
    backgroundColor: colors.while,
    alignItems: 'center',
    maxWidth: '100%',
    maxHeight: '90%',
    borderRadius: 10,
  },
});
