import {
  DimensionValue,
  Image,
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
import {TextSizeCustom} from '../../dataEntry/TextBase';
import {IconSRC} from '../../../constants/icons';

interface Props extends ModalProps {
  // children?:
  onClose?: () => void;
  containerStyle?: ViewStyle | any;
  viewStyle?: ViewStyle | any;
  widthModal?: DimensionValue;
  heightModal?: DimensionValue;
  header?: boolean;
  label?: string;
}
const ModalBottom = (props: Props) => {
  const {
    onClose,
    header = false,
    label,
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
            {
              width: widthModal,
              height: heightModal,
              backgroundColor: colors.gray2,
            },
            containerStyle,
          ]}>
          <View
            style={{
              height: 3,
              backgroundColor: colors.black,
              width: 100,
              alignSelf: 'center',
              marginVertical: metrics.space * 2,
              borderRadius: 10,
              // ...props.styleModal,
            }}></View>
          {header && (
            <View style={styles.header}>
              <TextSizeCustom
                bold
                size={20}
                // color="rgba(255, 255, 255, 1)"
              >
                {label?.toLocaleUpperCase()}
              </TextSizeCustom>
              <View
                style={{
                  position: 'absolute',
                  top: 15,
                  bottom: 15,
                  right: metrics.space + 4,
                }}>
                <TouchableOpacity
                  activeOpacity={1}
                  style={{
                    height: 20,
                    width: 20,
                    backgroundColor: 'rgba(235, 235, 245, 0.6)',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 20,
                  }}
                  onPress={props.onClose}>
                  <Image style={styles.image} source={IconSRC.icon_close} />
                </TouchableOpacity>
              </View>
              {/* {rightHeader && rightHeader} */}
            </View>
          )}
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
  image: {
    width: 10,
    height: 10,
    tintColor: colors.black,
  },
  modal: {
    overflow: 'hidden',
    backgroundColor: colors.while,
    // alignSelf: 'center',
    maxWidth: '100%',
    maxHeight: '90%',
    borderTopLeftRadius: metrics.space * 2,
    borderTopRightRadius: metrics.space * 2,
  },
  header: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    borderBottomColor: colors.gray1,
    borderBottomWidth: 0.3,
  },
});
