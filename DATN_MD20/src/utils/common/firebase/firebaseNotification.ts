// import messaging from '@react-native-firebase/messaging';
// import {Platform} from 'react-native';
// import auth from '../../../services/auth';
// import {useAppSelector} from '../../../redux/store';

// export async function requestUserPermission(userId?: string) {
//   const authStatus = await messaging().requestPermission();
//   const enabled =
//     authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
//     authStatus === messaging.AuthorizationStatus.PROVISIONAL;

//   if (enabled) {
//     const token = await messaging().getToken();
//     if (token && userId) {
//       await auth.updateFcmToken(token); // gọi API backend
//       console.log('📱 FCM Token:', token);
//     }
//   }
// }

// async function getFcmToken() {
//   const token = await messaging().getToken();

//   await auth.updateFcmToken(token);
//   console.log('FCM Token:', token);

//   // Gửi token này về server lưu theo user
// }

import {
  getMessaging,
  requestPermission,
  getToken,
  AuthorizationStatus,
} from '@react-native-firebase/messaging';
import auth from '../../../services/auth';

export async function requestUserPermission(userId?: string) {
  const messaging = getMessaging();
  const authStatus = await requestPermission(messaging);
  const enabled =
    authStatus === AuthorizationStatus.AUTHORIZED ||
    authStatus === AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    const token = await getToken(messaging);
    if (token && userId) {
      await auth.updateFcmToken(token);
      console.log('📱 FCM Token:', token);
    }
  }
}

export async function getFcmToken() {
  const messaging = getMessaging();
  const token = await getToken(messaging);
  await auth.updateFcmToken(token);
  console.log('FCM Token:', token);
}
