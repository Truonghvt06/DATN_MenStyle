// import {
//   getMessaging,
//   onMessage,
//   onNotificationOpenedApp,
//   getInitialNotification,
// } from '@react-native-firebase/messaging';
// import notifee, {AndroidImportance} from '@notifee/react-native';
// import navigation from '../../../navigation/navigation';
// import ScreenName from '../../../navigation/ScreenName';
// import {ImgSRC} from '../../../constants/icons';

// export const setupNotificationListeners = async () => {
//   const messaging = getMessaging();

//   await notifee.createChannel({
//     id: 'default',
//     name: 'Thông báo chung',
//     importance: AndroidImportance.HIGH,
//   });

//   // Foreground messages
//   onMessage(messaging, async remoteMessage => {
//     console.log('Foreground FCM Message:', remoteMessage);

//     const title: any =
//       remoteMessage.notification?.title ||
//       remoteMessage.data?.title ||
//       'Thông báo';
//     const body: any =
//       remoteMessage.notification?.body || remoteMessage.data?.body || '';

//     await notifee.displayNotification({
//       title,
//       body,
//       android: {
//         channelId: 'default',
//         smallIcon: 'ic_launcher_round',
//         largeIcon: ImgSRC.img_logo,
//       },
//     });
//   });

//   // Background + user tap notification
//   onNotificationOpenedApp(messaging, remoteMessage => {
//     handleNotificationNavigation(remoteMessage.data);
//   });

//   // App opened from quit state
//   const initialNotification = await getInitialNotification(messaging);
//   if (initialNotification) {
//     handleNotificationNavigation(initialNotification.data);
//   }
// };

// function handleNotificationNavigation(data?: {
//   category?: string;
//   orderId?: string;
// }) {
//   if (!data) return;

//   switch (data.category) {
//     case 'order':
//       navigation.navigate(ScreenName.Main.OrderDetail, {
//         screen: 'no',
//         orderId: data.orderId,
//       });
//       break;
//     case 'promotion':
//       navigation.navigate(ScreenName.Main.Voucher);
//       break;
//     case 'system':
//       navigation.navigate(ScreenName.Main.Notifications);
//       break;
//   }
// }

// notifications.ts
// import {Platform, Linking} from 'react-native';
// import messaging, {
//   FirebaseMessagingTypes,
// } from '@react-native-firebase/messaging';
// import notifee, {
//   AndroidImportance,
//   EventType,
//   Notification,
// } from '@notifee/react-native';
// import navigation from '../../../navigation/navigation';
// import ScreenName from '../../../navigation/ScreenName';

// type NotiData = {
//   // payload từ backend
//   category?: string; // 'order' | 'promotion' | 'system'
//   type?: string; // 'ORDER_STATUS' | 'PAYMENT_STATUS' | ...
//   orderId?: string;
//   deeplink?: string;
//   web_url?: string;
//   title?: string;
//   body?: string;
//   [k: string]: any;
// };

// export const setupNotificationListeners = async () => {
//   if (Platform.OS === 'android') {
//     await notifee.createChannel({
//       id: 'default',
//       name: 'Thông báo chung',
//       importance: AndroidImportance.HIGH,
//     });
//   }

//   const displayLocal = async (rm: FirebaseMessagingTypes.RemoteMessage) => {
//     const title =
//       (typeof rm.notification?.title === 'string' && rm.notification.title) ||
//       (typeof rm.data?.title === 'string' && rm.data.title) ||
//       'Thông báo';

//     const body =
//       (typeof rm.notification?.body === 'string' && rm.notification.body) ||
//       (typeof rm.data?.body === 'string' && rm.data.body) ||
//       '';

//     // quan trọng: đính kèm data để khi bấm Notifee lấy lại được
//     const data: Record<string, string> = Object.fromEntries(
//       Object.entries(rm.data ?? {}).map(([k, v]) => [k, String(v ?? '')]),
//     );

//     await notifee.displayNotification({
//       title,
//       body,
//       data, // <—
//       android: {
//         channelId: 'default',
//         smallIcon: 'ic_notification', // tên resource trong /res/drawable-*/mipmap-*
//         // largeIcon: 'ic_notification_large', // optional
//         pressAction: {id: 'default'}, // <— để bấm được
//       },
//     });
//   };

//   // 1) Foreground FCM -> hiển thị local Notifee
//   const unsubMsg = messaging().onMessage(async rm => {
//     console.log('Foreground FCM:', rm);
//     await displayLocal(rm);
//   });

//   // 2) Người dùng bấm vào thông báo do OS hiển thị (background)
//   const unsubOpen = messaging().onNotificationOpenedApp(rm => {
//     handleNotificationNavigation(rm?.data);
//   });

//   // 3) App mở từ trạng thái quit bởi FCM
//   const initialRM = await messaging().getInitialNotification();
//   if (initialRM?.data) {
//     handleNotificationNavigation(initialRM.data);
//   }

//   // 4) Người dùng bấm vào Notifee local (foreground)
//   const unsubNotifeeFg = notifee.onForegroundEvent(({type, detail}) => {
//     if (type === EventType.PRESS) {
//       handleNotificationNavigation(detail.notification?.data);
//     }
//   });

//   // 5) App mở từ trạng thái quit bởi Notifee local
//   const initialNotifee = await notifee.getInitialNotification();
//   if (initialNotifee?.notification?.data) {
//     handleNotificationNavigation(initialNotifee.notification.data);
//   }

//   // Trả cleanup để bạn gọi khi unmount app root nếu cần
//   return () => {
//     unsubMsg();
//     unsubOpen();
//     unsubNotifeeFg();
//   };
// };

// export function handleNotificationNavigation(raw?: Record<string, any>) {
//   if (!raw) return;

//   // Chuẩn hóa data về string
//   const data: NotiData = Object.keys(raw).reduce((acc, k) => {
//     const v = raw[k];
//     acc[k] = typeof v === 'string' ? v : String(v ?? '');
//     return acc;
//   }, {} as NotiData);

//   // Ưu tiên deeplink nếu có
//   if (data.deeplink) {
//     Linking.openURL(data.deeplink).catch(() => {});
//   }

//   // Hỗ trợ cả category và type (từ backend)
//   const category = (data.category || data.type || '').toLowerCase();

//   if (category.startsWith('order')) {
//     if (data.orderId) {
//       // điều hướng thẳng vào chi tiết
//       navigation.navigate(ScreenName.Main.OrderDetail, {
//         screen: 'no',
//         orderId: data.orderId,
//       });
//     } else {
//       // fallback: danh sách đơn
//       navigation.navigate(ScreenName.Main.Orders);
//     }
//     return;
//   }

//   if (category === 'promotion') {
//     navigation.navigate(ScreenName.Main.Voucher);
//     return;
//   }

//   // mặc định: hộp thông báo
//   navigation.navigate(ScreenName.Main.Notifications);
// }

// ✅ Thay import
import messaging from '@react-native-firebase/messaging';
import notifee, {AndroidImportance, EventType} from '@notifee/react-native';
import {Linking, AppState} from 'react-native';
import navigation, {queueNotificationNav} from '../../../navigation/navigation';
import ScreenName from '../../../navigation/ScreenName';
import {ImgSRC} from '../../../constants/icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// export const flushStoredNotificationIfAny = async () => {
//   try {
//     const raw = await AsyncStorage.getItem('PENDING_NOTI_DATA');
//     if (raw) {
//       await AsyncStorage.removeItem('PENDING_NOTI_DATA');
//       const data = JSON.parse(raw);
//       queueNotificationNav(data);
//     }
//   } catch {}
// };

export const setupNotificationListeners = async () => {
  await notifee.createChannel({
    id: 'default',
    name: 'Thông báo chung',
    importance: AndroidImportance.HIGH,
  });

  // Foreground push -> show local Notifee + giữ nguyên data
  messaging().onMessage(async remoteMessage => {
    const title: any =
      remoteMessage.notification?.title ??
      remoteMessage.data?.title ??
      'Thông báo';
    const body: any =
      remoteMessage.notification?.body ?? remoteMessage.data?.body ?? '';

    await notifee.displayNotification({
      title,
      body,
      data: remoteMessage.data, // 👈 dữ liệu để điều hướng
      android: {
        channelId: 'default',
        smallIcon: 'ic_launcher_round',
        // 👇 BẮT BUỘC có để click tạo event
        pressAction: {id: 'default', launchActivity: 'default'},
        // largeIcon có thể là tên resource trong mipmap/drawable. Nếu ImgSRC là require(), nên đổi sang tên resource.
      },
    });
  });

  // User bấm thông báo (app background)
  messaging().onNotificationOpenedApp(remoteMessage => {
    queueNotificationNav(remoteMessage?.data);
  });

  // App mở từ trạng thái quit vì user bấm thông báo
  const initial = await messaging().getInitialNotification();
  if (initial) {
    queueNotificationNav(initial.data);
  }

  // Notifee: bấm local/remote notification (foreground)
  notifee.onForegroundEvent(({type, detail}) => {
    if (type === EventType.PRESS) {
      queueNotificationNav(detail.notification?.data);
    }
  });

  // Notifee: bấm khi app background/quit
  notifee.onBackgroundEvent(async ({type, detail}) => {
    if (type === EventType.PRESS) {
      queueNotificationNav(detail.notification?.data);
    }
  });
};

export function handleNotificationNavigation(data?: {
  category?: string;
  orderId?: string;
  deeplink?: string;
  web_url?: string;
}) {
  if (!data) return;

  // Ưu tiên deep link nếu có
  if (data.deeplink) {
    Linking.openURL(data.deeplink).catch(() => {
      fallbackRoute(data);
    });
    return;
  }

  fallbackRoute(data);
}

function fallbackRoute(data: any) {
  switch (data.category) {
    case 'order':
      // Nếu OrderDetail nằm trong MainStack:
      // navigation.navigate(ScreenName.Main.MainStack, {
      //   screen: ScreenName.Main.OrderDetail,
      //   params: {screen: 'noti', orderId: String(data.orderId || '')},
      // });
      navigation.navigate(ScreenName.Main.OrderDetail, {
        screen: 'no',
        orderId: data.orderId,
      });
      break;
    case 'promotion':
      navigation.navigate(ScreenName.Main.Voucher);
      break;
    case 'system':
      navigation.navigate(ScreenName.Main.Notifications);
      break;
    default:
      break;
  }
}
