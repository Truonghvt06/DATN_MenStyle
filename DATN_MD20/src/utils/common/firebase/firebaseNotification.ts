import messaging from '@react-native-firebase/messaging';
import {Platform} from 'react-native';
import auth from '../../../services/auth';
import {useAppSelector} from '../../../redux/store';

export async function requestUserPermission(userId?: string) {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    const token = await messaging().getToken();
    if (token && userId) {
      await auth.updateFcmToken(token); // gọi API backend
      console.log('📱 FCM Token:', token);
    }
  }
}

async function getFcmToken() {
  const token = await messaging().getToken();

  await auth.updateFcmToken(token);
  console.log('FCM Token:', token);

  // Gửi token này về server lưu theo user
}
