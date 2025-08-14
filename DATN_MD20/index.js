/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
// import 'react-native-gesture-handler';
import messaging from '@react-native-firebase/messaging';
import notifee, {EventType} from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

AppRegistry.registerComponent(appName, () => App);

// 👇 Nếu server có data-only message, tự hiển thị noti khi app background/quit
// messaging().setBackgroundMessageHandler(async remoteMessage => {
//   await notifee.createChannel({id: 'default', name: 'Thông báo chung'});
//   await notifee.displayNotification({
//     title:
//       remoteMessage?.notification?.title ??
//       remoteMessage?.data?.title ??
//       'Thông báo',
//     body: remoteMessage?.notification?.body ?? remoteMessage?.data?.body ?? '',
//     data: remoteMessage?.data,
//     android: {
//       channelId: 'default',
//       pressAction: {id: 'default', launchActivity: 'default'},
//     },
//   });
// });

// // 👇 Bấm noti khi app đang background/quit (headless)
// // Không thể gọi navigation tại đây → ghi tạm vào storage
// notifee.onBackgroundEvent(async ({type, detail}) => {
//   if (type === EventType.PRESS) {
//     try {
//       await AsyncStorage.setItem(
//         'PENDING_NOTI_DATA',
//         JSON.stringify(detail.notification?.data || {}),
//       );
//     } catch {}
//   }
// });
