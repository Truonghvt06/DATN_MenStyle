// src/firebase/fcmHelper.ts

import messaging from '@react-native-firebase/messaging';
import {Alert} from 'react-native';
import {AppState} from 'react-native';
import navigation from '../../../navigation/navigation';
import ScreenName from '../../../navigation/ScreenName';
import Toast from 'react-native-toast-message';
import notifee, {AndroidImportance, AndroidStyle} from '@notifee/react-native';
import {ImgSRC} from '../../../constants/icons';

export const setupNotificationListeners = async () => {
  await notifee.createChannel({
    id: 'default',
    name: 'Thông báo chung',
    importance: AndroidImportance.HIGH,
  });

  // Xử lý khi app đang mở
  messaging().onMessage(async remoteMessage => {
    console.log('Foreground FCM Message:', remoteMessage);

    await notifee.displayNotification({
      title:
        typeof remoteMessage.notification?.title === 'string'
          ? remoteMessage.notification.title
          : typeof remoteMessage.data?.title === 'string'
          ? remoteMessage.data.title
          : 'Thông báo',
      body:
        typeof remoteMessage.notification?.body === 'string'
          ? remoteMessage.notification.body
          : typeof remoteMessage.data?.body === 'string'
          ? remoteMessage.data.body
          : '',
      android: {
        channelId: 'default',
        smallIcon: 'ic_launcher_round', // thay bằng tên icon đã khai báo trong android/app/src/main/res/drawable

        // style: {
        //   type: AndroidStyle.BIGPICTURE,
        //   //   picture: ImgSRC.img_logo,
        // },
        largeIcon: ImgSRC.img_logo, // ảnh avatar hoặc logo
      },
    });
  });

  // Khi app đang mở (foreground)
  //   messaging().onMessage(async remoteMessage => {
  //     const {title, body} = remoteMessage.notification || {};
  //     // Alert.alert(title || 'Thông báo', body || '');
  //     Toast.show({
  //       type: 'notification', // Có thể là 'success', 'error', 'info'
  //       position: 'top',
  //       text1: title || 'Thông báo',
  //       text2: body || '',
  //       visibilityTime: 3000, // số giây hiển thị Toast
  //       autoHide: true,
  //       swipeable: true,
  //     });

  //     // TODO: dispatch Redux hoặc lưu local nếu cần
  //   });

  // Khi app ở background & user nhấn vào thông báo
  messaging().onNotificationOpenedApp(remoteMessage => {
    const {type} = remoteMessage.data || {};

    if (type === 'order') {
      navigation.navigate(ScreenName.Main.OrderDetail, {orders: null});
    } else if (type === 'promotion') {
      navigation.navigate(ScreenName.Main.Voucher);
    } else if (type === 'system') {
      navigation.navigate(ScreenName.Main.Notifications);
    }
  });

  // Khi app bị kill & mở từ notification
  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        const {type} = remoteMessage.data || {};

        if (type === 'order') {
          navigation.navigate(ScreenName.Main.OrderDetail, {orders: null});
        } else if (type === 'promotion') {
          navigation.navigate(ScreenName.Main.Voucher);
        } else if (type === 'system') {
          navigation.navigate(ScreenName.Main.Notifications);
        }
      }
    });
};
