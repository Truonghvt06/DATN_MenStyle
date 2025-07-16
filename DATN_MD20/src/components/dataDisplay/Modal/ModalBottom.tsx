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
import {useAppTheme} from '../../../themes/ThemeContext';

interface Props extends ModalProps {
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

  const theme = useAppTheme();

  return (
    <Modal transparent={true} {...props}>
      <View style={[styles.container, viewStyle]}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={{height: '100%', width: '100%'}}
          onPress={onClose}
        />
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
          <View
            style={{
              height: 5,
              backgroundColor: theme.text,
              width: 80,
              alignSelf: 'center',
              marginVertical: metrics.space * 2,
              borderRadius: 10,
            }}
          />
          {header && (
            <View
              style={[
                styles.header,
                {borderBottomColor: theme.border},
              ]}>
              <TextSizeCustom
                bold
                size={20}
                color={theme.text}
                style={{textTransform: 'capitalize'}}>
                {label}
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
                  style={[styles.close, {backgroundColor: theme.background}]}
                  onPress={props.onClose}>
                  <Image
                    style={[styles.image, {tintColor: theme.text}]}
                    source={IconSRC.icon_close}
                  />
                </TouchableOpacity>
              </View>
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
  },
  modal: {
    overflow: 'hidden',
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
    borderBottomWidth: 0.3,
  },
  close: {
    height: 20,
    width: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
});
