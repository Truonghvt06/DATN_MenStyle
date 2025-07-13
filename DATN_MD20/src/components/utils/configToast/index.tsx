import {Image, Platform, Text, TouchableOpacity, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/AntDesign';
import {TextMedium, TextSizeCustom, TextSmall} from '../../dataEntry/TextBase';
import {IconSRC, ImgSRC} from '../../../constants/icons';

//Tự tạo thông báo toast

export default {
  notification: (internalState: any) => {
    const {top} = useSafeAreaInsets();
    return (
      <View
        style={{
          backgroundColor: 'rgb(121, 248, 125)',
          width: '95%',
          paddingHorizontal: 10,
          paddingVertical: 7,
          borderRadius: 8,
          shadowColor: '#000',
          shadowOffset: {width: 0, height: 2},
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: Platform.OS === 'ios' ? 13 : 0,
          zIndex: 999,
        }}>
        {/* <Icon name="notification" style={{fontSize: 20, color: '#3d3d3d'}} /> */}
        <Image
          source={IconSRC.icon_megaphone}
          style={{width: 25, height: 25}}
        />

        <TouchableOpacity
          style={{flex: 1, paddingLeft: 10}}
          onPress={() => {
            Toast.hide();
            internalState.onPress();
          }}>
          <TextSmall bold>{internalState.text1}</TextSmall>
          <TextSizeCustom size={13}>{internalState.text2}</TextSizeCustom>
        </TouchableOpacity>
        {/* <TouchableOpacity style={{padding: 10}} onPress={() => Toast.hide()}>
          <AntDesign name="close" style={{fontSize: 20, color: 'red'}} />
        </TouchableOpacity> */}
      </View>
    );
  },
};
