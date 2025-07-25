import {
  Modal,
  ModalProps,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import React, {useRef} from 'react';
import {colors} from '../../../themes/colors';
import metrics from '../../../constants/metrics';
import {TextHeight, TextMedium, TextSizeCustom} from '../../dataEntry/TextBase';
import Block from '../../layout/Block';
import useLanguage from '../../../hooks/useLanguage';
import {useAppTheme} from '../../../themes/ThemeContext';

interface Props extends ModalProps {
  widthModal?: number;
  heightModal?: number;
  title?: string;
  content?: string;
  radius?: number;
  containerStyle?: ViewStyle;
  isCancle?: boolean;
  onClose?: () => void;
  onPress?: () => void;
}
const ModalCenter = (props: Props) => {
  const {getTranslation} = useLanguage();
  const theme = useAppTheme();
  const {
    widthModal = 320,
    heightModal = 150,
    radius = 16,
    title = getTranslation('thong_bao'),
    content,
    isCancle = false,
    containerStyle,
    onClose,
    onPress,
  } = props;

  return (
    <Modal
      transparent={true}
      statusBarTranslucent
      presentationStyle="overFullScreen"
      {...props}>
      <View
        style={[
          styles.container,
          // {backgroundColor: theme.background_conten_modal},
        ]}>
        <TouchableOpacity style={StyleSheet.absoluteFill} onPress={onClose} />
        <View
          style={[
            styles.modal,
            {
              borderRadius: radius,
              width: widthModal,
              height: heightModal,
              backgroundColor: theme.background_item,
            },
            containerStyle,
          ]}>
          <Block flex1 alignCT justifyCT padH20>
            <TextHeight bold style={{marginBottom: 8}}>
              {title}
            </TextHeight>
            <TextSizeCustom size={14} style={{textAlign: 'center'}}>
              {content}
            </TextSizeCustom>
          </Block>

          {isCancle ? (
            <Block w100 borderTopW={0.3} borderColor={colors.gray1}>
              <TouchableOpacity
                style={{alignItems: 'center', padding: 12}}
                onPress={onClose}>
                <TextMedium bold color={colors.primary}>
                  {'OK'}
                </TextMedium>
              </TouchableOpacity>
            </Block>
          ) : (
            <Block w100 row borderTopW={0.3} borderColor={colors.gray1}>
              <TouchableOpacity
                style={[styles.btn1, {borderColor: colors.gray1}]}
                onPress={onClose}>
                <TextMedium bold>{getTranslation('huy')}</TextMedium>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btn} onPress={onPress}>
                <TextMedium bold color={colors.primary}>
                  {'OK'}
                </TextMedium>
              </TouchableOpacity>
            </Block>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default ModalCenter;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  modal: {
    // flex: 1,
    overflow: 'hidden',
    backgroundColor: colors.while,
    alignItems: 'center',
  },
  btn: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
  },
  btn1: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    borderRightWidth: 0.3,
  },
});
