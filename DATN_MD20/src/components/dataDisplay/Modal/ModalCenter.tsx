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
import {useAppTheme} from '../../../themes/ThemeContext';
import {TextMedium} from '../../dataEntry/TextBase';

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

  const theme = useAppTheme();

  return (
    <Modal transparent={true} {...props}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.container}>
          <View
            style={[
              styles.modal,
              {
                width: widthModal,
                height: heightModal,
                backgroundColor: theme.card,
              },
              containerStyle,
            ]}>
            <TextMedium style={{color: theme.text}}>ModalCenter</TextMedium>
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
    overflow: 'hidden',
    alignItems: 'center',
    maxWidth: '100%',
    maxHeight: '90%',
    borderRadius: 10,
  },
});
