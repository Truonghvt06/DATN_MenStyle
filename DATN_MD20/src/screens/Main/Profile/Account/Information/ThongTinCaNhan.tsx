import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import {IconSRC, ImgSRC} from '../../../../../constants/icons'; // Đảm bảo đường dẫn đúng
import {colors} from '../../../../../themes/colors';
import ContainerView from '../../../../../components/layout/ContainerView';
import Header from '../../../../../components/dataDisplay/Header';
import useLanguage from '../../../../../hooks/useLanguage';
import {
  TextSizeCustom,
  TextSmall,
} from '../../../../../components/dataEntry/TextBase';
import TouchIcon from '../../../../../components/dataEntry/Button/TouchIcon';
import Block from '../../../../../components/layout/Block';
import ButtonOption from '../../../../../components/dataEntry/Button/BottonOption';
import ButtonBase from '../../../../../components/dataEntry/Button/ButtonBase';
import metrics from '../../../../../constants/metrics';
import ModalBottom from '../../../../../components/dataDisplay/Modal/ModalBottom';
import {Picker} from '@react-native-picker/picker';
// import DatePicker from 'react-native-date-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';

const ThongTinCaNhan = () => {
  const {getTranslation} = useLanguage();
  const [selectedGender, setSelectedGender] = useState('');
  const [tempGender, setTempGender] = useState('Nam');
  const [isOpen, setIsOpen] = useState(false);

  const [date, setDate] = useState(new Date());
  const [tempDate, setTempDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [valueDate, setValueDate] = useState('');

  const genders = ['Nam', 'Nữ', 'Khác'];
  return (
    <ContainerView>
      <Header label={getTranslation('thong_tin_ca_nhan')} />
      {/* Avatar */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <Block alignCT justifyCT h={200} backgroundColor={colors.sky_blue}>
          <TouchableOpacity activeOpacity={0.9} onPress={() => {}}>
            <Image style={styles.avatar} source={ImgSRC.img_avatar} />
            <TouchIcon
              containerStyle={styles.ic_edit}
              icon={IconSRC.icon_edit}
              size={28}
              color={colors.black}
              onPress={() => {}}
            />
          </TouchableOpacity>
        </Block>

        <Block padH={8} backgroundColor={colors.while}>
          <ButtonOption
            name={getTranslation('ho_va_ten')}
            sizeText={14}
            content1="Hoàng Văn Trường"
          />
          <ButtonOption
            name={getTranslation('gioi_tinh')}
            sizeText={14}
            content1={
              <>
                {selectedGender ? (
                  <TextSmall color={colors.black}>{selectedGender}</TextSmall>
                ) : (
                  <TextSmall color={colors.gray3}>
                    {getTranslation('cap_nhat_ngay')}
                  </TextSmall>
                )}
              </>
            }
            onPress={() => setIsOpen(true)}
          />
          <ButtonOption
            name={getTranslation('ngay_sinh')}
            sizeText={14}
            content1={
              <>
                {valueDate ? (
                  <TextSmall color={colors.black}>{valueDate}</TextSmall>
                ) : (
                  <TextSmall color={colors.gray3}>
                    {getTranslation('cap_nhat_ngay')}
                  </TextSmall>
                )}
              </>
            }
            onPress={() => setOpen(true)}
          />
          <ButtonOption
            name={getTranslation('dien_thoai')}
            sizeText={14}
            content1="0999999999"
          />
          <ButtonOption
            name={getTranslation('email')}
            sizeText={14}
            content1="use@gmail.com"
          />
        </Block>
      </ScrollView>
      <Block containerStyle={styles.btn}>
        <Block>
          <ButtonBase
            containerStyle={{width: metrics.diviceScreenWidth - 16}}
            title={getTranslation('luu')}
            onPress={() => {}}
          />
        </Block>
      </Block>

      {/* Ngoài  */}

      {/* Ngày sinh  */}
      {Platform.OS === 'android' ? (
        open && (
          <DateTimePicker
            value={date}
            mode="date"
            display="spinner" // hoặc 'default', 'compact' tùy bạn muốn
            maximumDate={new Date()}
            style={{borderRadius: 10}}
            onChange={(event, selectedDate) => {
              setOpen(false);
              if (event.type === 'set' && selectedDate) {
                setDate(selectedDate);
                setValueDate(moment(selectedDate).format('DD/MM/YYYY'));
              }
            }}
          />
        )
      ) : (
        <ModalBottom
          visible={open}
          header
          label={getTranslation('chon_ngay')}
          heightModal={400}
          onClose={() => setOpen(false)}
          containerStyle={{
            backgroundColor: colors.while,
          }}
          children={
            <>
              <Block alignCT>
                <DateTimePicker
                  value={date}
                  mode="date"
                  display="spinner"
                  maximumDate={new Date()}
                  onChange={(event, selectedDate) => {
                    if (selectedDate) {
                      setDate(selectedDate);
                    }
                  }}
                  style={{backgroundColor: 'white'}}
                />
              </Block>

              <Block
                row
                justifyContent="flex-end"
                padH={16}
                padT={20}
                borderTopW={0.3}
                borderColor={colors.gray1}>
                <TouchIcon
                  title={getTranslation('xac_nhan')}
                  titleStyle={styles.comfor}
                  onPress={() => {
                    setDate(date);
                    setValueDate(moment(date).format('DD/MM/YYYY'));
                    setOpen(false);
                  }}
                />
              </Block>
            </>
          }
        />
      )}

      {/* Giới tính  */}
      <ModalBottom
        visible={isOpen}
        header
        label={getTranslation('tuy_chon')}
        heightModal={300}
        onClose={() => setIsOpen(false)}
        children={
          <>
            <ScrollView>
              {genders.map(gender => (
                <TouchableOpacity
                  activeOpacity={0.6}
                  key={gender}
                  style={styles.item}
                  onPress={() => {
                    setSelectedGender(gender);
                    setIsOpen(false);
                  }}>
                  <TextSizeCustom size={16}>{gender}</TextSizeCustom>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </>
        }
      />
    </ContainerView>
  );
};

export default ThongTinCaNhan;

const styles = StyleSheet.create({
  comfor: {
    textTransform: 'uppercase',
    paddingHorizontal: 20,
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.black,
  },
  xong: {
    alignItems: 'flex-end',
    marginRight: 20,
  },
  ic_edit: {
    flex: 1,
    position: 'absolute',
    bottom: 3,
    right: 3,
  },

  btn: {
    position: 'absolute',
    bottom: 35,
    left: 8,
  },

  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 5,
    backgroundColor: '#eee',
  },
  item: {
    paddingVertical: 15,
    paddingHorizontal: 8,
    borderBottomWidth: 0.3,
    borderColor: colors.gray1,
    alignItems: 'center',
  },
});
