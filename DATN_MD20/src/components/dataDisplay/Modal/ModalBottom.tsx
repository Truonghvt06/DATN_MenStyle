import React, {useRef} from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  ModalProps,
  PanResponder,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
  Platform,
} from 'react-native';
import {colors} from '../../../themes/colors';
import {TextSizeCustom} from '../../dataEntry/TextBase';
import {IconSRC} from '../../../constants/icons';
import {Image} from 'react-native';
import {useAppTheme} from '../../../themes/ThemeContext';
import metrics from '../../../constants/metrics';

const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');

interface Props extends ModalProps {
  onClose?: () => void;
  containerStyle?: ViewStyle;
  viewStyle?: ViewStyle;
  header?: boolean;
  label?: string;
  heightModal?: number;
}

const ModalBottom = (props: Props) => {
  const theme = useAppTheme();
  const {
    onClose,
    header = false,
    label,
    containerStyle,
    viewStyle,
    heightModal = metrics.diviceHeight * 0.6,
  } = props;

  // Animated value for swipe down
  const translateY = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return gestureState.dy > 5; // Chỉ khi swipe xuống
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 100) {
          // Đóng modal nếu kéo xuống nhiều
          onClose && onClose();
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    }),
  ).current;

  return (
    <Modal animationType="fade" transparent statusBarTranslucent {...props}>
      <View style={[styles.overlay, viewStyle]}>
        <TouchableOpacity style={StyleSheet.absoluteFill} onPress={onClose} />

        <Animated.View
          style={[
            styles.modal,
            {
              backgroundColor: theme.background_modal,
              height: heightModal,
              transform: [{translateY}],
            },
            containerStyle,
          ]}
          {...panResponder.panHandlers}>
          {/* Drag handle */}
          <View style={[styles.dragHandle, {backgroundColor: theme.text}]} />

          {header && (
            <View style={[styles.header, {borderColor: theme.border_color}]}>
              <TextSizeCustom
                bold
                size={18}
                style={{textTransform: 'capitalize'}}>
                {label}
              </TextSizeCustom>
              <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                <Image style={styles.image} source={IconSRC.icon_close} />
              </TouchableOpacity>
            </View>
          )}

          {props.children}
        </Animated.View>
      </View>
    </Modal>
  );
};

export default ModalBottom;

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  modal: {
    width: SCREEN_WIDTH,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: SCREEN_HEIGHT * 0.9,
    overflow: 'hidden',
  },
  dragHandle: {
    height: 5,
    width: 100,
    backgroundColor: colors.gray1,
    borderRadius: 3,
    alignSelf: 'center',
    marginVertical: 10,
  },
  header: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 0.3,
  },
  closeBtn: {
    position: 'absolute',
    right: 15,
    height: 25,
    width: 25,
    borderRadius: 20,
    backgroundColor: 'rgba(235,235,245,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 10,
    height: 10,
    tintColor: colors.black,
  },
});
