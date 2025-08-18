/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
// import 'react-native-gesture-handler';
import messaging from '@react-native-firebase/messaging';
import notifee, {EventType} from '@notifee/react-native';
import {
  backgroundMessageHandler,
  notifeeBackgroundEventHandler,
} from './src/utils/common/firebase/fcmHelper';

AppRegistry.registerComponent(appName, () => App);

// FCM background/data-only
messaging().setBackgroundMessageHandler(backgroundMessageHandler);

// Notifee press ở BG/QUIT
notifee.onBackgroundEvent(notifeeBackgroundEventHandler);
