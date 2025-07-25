import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, {useState} from 'react';
import ContainerView from '../../../../../components/layout/ContainerView';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Header from '../../../../../components/dataDisplay/Header';
import {useAppTheme} from '../../../../../themes/ThemeContext';
import useLanguage from '../../../../../hooks/useLanguage';
import Block from '../../../../../components/layout/Block';
import {IconSRC, ImgSRC} from '../../../../../constants/icons';
import {
  TextMedium,
  TextSizeCustom,
  TextSmall,
} from '../../../../../components/dataEntry/TextBase';
import ButtonBase from '../../../../../components/dataEntry/Button/ButtonBase';

const AddReviewScreen = () => {
  const {top} = useSafeAreaInsets();
  const theme = useAppTheme();
  const {getTranslation} = useLanguage();

  const [rating, setRating] = useState(5);
  const [note, setNote] = useState('');

  const handleSend = () => {};

  return (
    <ContainerView style={{flex: 1}}>
      <Header label={getTranslation('danh_gia')} paddingTop={top} />

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <ScrollView>
            <Block padH={8} padT={16}>
              <Block row marB={20}>
                <Image source={ImgSRC.img_pro} style={styles.image} />
                <Block>
                  <TextMedium bold>Áo Polo Nam Coolmate Premium</TextMedium>
                  <TextSizeCustom size={12}>Đơn hàng #DH005</TextSizeCustom>
                  <TextSizeCustom size={12}>
                    Phân loại: Size L, Màu xanh
                  </TextSizeCustom>
                </Block>
              </Block>

              <TextMedium bold style={{textAlign: 'center'}}>
                Đánh giá{' '}
              </TextMedium>
              <View style={styles.star}>
                {[1, 2, 3, 4, 5].map((star, index) => (
                  <TouchableOpacity key={star} onPress={() => setRating(star)}>
                    <Image
                      key={`revirew-${index}`}
                      source={
                        star <= rating ? IconSRC.icon_star : IconSRC.icon_unstar
                      }
                      style={{width: 35, height: 35, marginRight: 2}}
                    />
                  </TouchableOpacity>
                ))}
              </View>

              <Block>
                <TextMedium bold>Chia sẻ trải nghiệm của bạn</TextMedium>
                <TextInput
                  style={[
                    styles.textArea,
                    {
                      borderColor: theme.border_color,
                      color: theme.text,
                    },
                  ]}
                  placeholder="Hãy chia sẻ cảm nhận của bạn về sản phẩm này..."
                  placeholderTextColor={theme.placeholderTextColor}
                  multiline={true}
                  numberOfLines={5}
                  maxLength={500}
                  value={note}
                  onChangeText={setNote}
                />
                <TextSmall style={styles.txtInp}>{note.length}/500</TextSmall>
              </Block>
              <>
                <TextMedium bold>💡 Mẹo viết đánh giá </TextMedium>
                <TextSmall>
                  • Chia sẻ cảm nhận thật về chất lượng sản phẩm
                </TextSmall>
                <TextSmall>• Đề cập đến size, màu sắc, chất liệu</TextSmall>
              </>

              <ButtonBase
                title={'Gửi'}
                containerStyle={styles.btn}
                onPress={() => {
                  handleSend();
                }}
              />
            </Block>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </ContainerView>
  );
};

export default AddReviewScreen;

const styles = StyleSheet.create({
  image: {
    width: 60,
    height: 75,
    borderRadius: 8,
    marginRight: 10,
  },
  star: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  btn: {
    marginTop: 50,
  },
  txtInp: {
    textAlign: 'right',
    position: 'absolute',
    right: 8,
    bottom: 35,
  },
  textArea: {
    height: 120, // tương ứng khoảng 5 dòng
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    textAlignVertical: 'top', // để text bắt đầu từ trên xuống
    fontSize: 16,
    marginTop: 10,
    marginBottom: 30,
  },
});
