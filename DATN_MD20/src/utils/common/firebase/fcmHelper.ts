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

import {Platform} from 'react-native';
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import notifee, {
  AndroidImportance,
  EventType,
  Notification,
} from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import navigation, {isReadyRef} from '../../../navigation/navigation';
import ScreenName from '../../../navigation/ScreenName';

// ====== TÙY CHỈNH NHẸ THEO APP CỦA BẠN ======
const ANDROID_CHANNEL_ID = 'default';
const ANDROID_CHANNEL_NAME = 'Thông báo chung';
const PENDING_NAV_KEY = '@pending_noti_nav';

// TODO: Sửa lại tên stack/screen cho đúng app của bạn.
// Ví dụ dưới đây: reset về MainStack, rồi mở màn OrderDetail truyền { id: orderId }.
function navigateToOrderDetail(orderId: string) {
  // Nếu bạn chỉ dùng navigate thẳng: navigation.navigate(ScreenName.OrderDetail, { id: orderId })
  // Ở đây dùng resetToStackWithScreen để đảm bảo back-stack sạch.
  navigation.resetToStackWithScreen(
    ScreenName.Main.MainStack,
    ScreenName.Main.OrderDetail,
    {
      screen: 'noti',
      orderId: orderId,
    },
  );
}

// ==================================================

export type NotiData = {
  category?: string; // 'order' | 'promotion' | 'system'
  type?: string; // 'ORDER_STATUS' | 'PAYMENT_STATUS' | ...
  orderId?: string;
  order_id?: string;
  deeplink?: string;
  web_url?: string;
  title?: string;
  body?: string;
  [k: string]: any;
};

const toStringData = (obj: Record<string, any> = {}) =>
  Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [k, String(v ?? '')]),
  ) as Record<string, string>;

const parseNotiData = (
  input?: FirebaseMessagingTypes.RemoteMessage | Partial<Notification> | any,
): NotiData => {
  const rm: any = input || {};
  const d: any = rm.data || rm || {};
  return {
    ...d,
    title: rm?.notification?.title ?? d?.title,
    body: rm?.notification?.body ?? d?.body,
    orderId: d?.orderId || d?.order_id,
  };
};

// ====== HIỂN THỊ LOCAL NOTIFICATION (Foreground / data-only BG) ======
export async function displayLocalNotification(
  input: FirebaseMessagingTypes.RemoteMessage | NotiData,
) {
  const data = parseNotiData(input);

  if (Platform.OS === 'android') {
    await notifee.createChannel({
      id: ANDROID_CHANNEL_ID,
      name: ANDROID_CHANNEL_NAME,
      importance: AndroidImportance.HIGH,
    });
  }

  await notifee.displayNotification({
    title: data.title,
    body: data.body,
    data: toStringData(data),
    android: {
      channelId: ANDROID_CHANNEL_ID,
      // Khi bấm thông báo do Notifee hiển thị, ta sẽ nhận trong onForegroundEvent/onBackgroundEvent
      pressAction: {id: 'default'},
      smallIcon: 'ic_launcher', // đổi nếu bạn có custom small icon
    },
    ios: {
      // iOS sẽ hiện bình thường (đã được APNs/FCM cho phép ở backend)
    },
  });
}

// ====== ĐIỀU HƯỚNG SAU KHI BẤM THÔNG BÁO ======
let lastOrderNavigated = ''; // chống double navigate nhanh

export async function handleNotificationNavigation(payload?: NotiData) {
  const data = parseNotiData(payload);
  const orderId = data.orderId || data.order_id;

  if (!orderId) return;

  // Nếu navigation chưa sẵn sàng (app chưa mount), ta lưu pending để xử lý sau
  if (!isReadyRef?.current) {
    await AsyncStorage.setItem(
      PENDING_NAV_KEY,
      JSON.stringify({orderId, ts: Date.now()}),
    );
    return;
  }

  if (lastOrderNavigated === orderId) return;
  lastOrderNavigated = orderId;

  navigateToOrderDetail(orderId);
}

// Gọi hàm này khi NavigationContainer onReady để xử lý pending (app mở từ "quit")
export async function tryProcessPendingNotiNav() {
  const raw = await AsyncStorage.getItem(PENDING_NAV_KEY);
  if (!raw) return;

  await AsyncStorage.removeItem(PENDING_NAV_KEY);
  try {
    const parsed = JSON.parse(raw);
    if (parsed?.orderId) {
      handleNotificationNavigation({orderId: parsed.orderId});
    }
  } catch {}
}

// ====== ĐĂNG KÝ LISTENERS KHI APP ĐANG CHẠY (Foreground) ======
export async function setupNotificationListeners() {
  // Channel Android
  if (Platform.OS === 'android') {
    await notifee.createChannel({
      id: ANDROID_CHANNEL_ID,
      name: ANDROID_CHANNEL_NAME,
      importance: AndroidImportance.HIGH,
    });
  }

  // 1) Foreground: nhận FCM -> tự hiển thị local notification
  const unsubOnMessage = messaging().onMessage(async rm => {
    await displayLocalNotification(rm);
  });

  // 2) App đang background, user bấm vào thông báo do OS hiển thị (FCM có "notification")
  const unsubOpened = messaging().onNotificationOpenedApp(rm => {
    handleNotificationNavigation(rm as any);
  });

  // 3) App mở từ trạng thái QUIT do bấm thông báo của OS
  const initial = await messaging().getInitialNotification();
  if (initial) {
    // Navigation chưa ready ngay lập tức -> lưu pending
    await handleNotificationNavigation(initial as any);
  }

  // 4) Bấm vào thông báo mà chính Notifee hiển thị (Foreground)
  const unsubNotifeeFg = notifee.onForegroundEvent(async ({type, detail}) => {
    if (type === EventType.PRESS || type === EventType.ACTION_PRESS) {
      const data = parseNotiData(detail.notification?.data);
      await handleNotificationNavigation(data);
    }
  });

  // 5) Thử xử lý pending (nếu background handler đã lưu)
  await tryProcessPendingNotiNav();

  return () => {
    unsubOnMessage();
    unsubOpened();
    unsubNotifeeFg();
  };
}

// ====== CÁC HANDLER BẮT BUỘC ĐĂNG KÝ Ở index.js (Background / Quit) ======
// (A) Android/iOS: xử lý FCM data-only khi app ở BG/QUIT -> hiện local notification
export async function backgroundMessageHandler(
  rm: FirebaseMessagingTypes.RemoteMessage,
) {
  // Chỉ bị gọi với data-only. Nếu backend có "notification", OS sẽ tự hiển thị và KHÔNG gọi vào đây.
  await displayLocalNotification(rm);
}

// (B) Bấm thông báo Notifee khi app đang BG/QUIT
// Phải đăng ký ở scope global (index.js). Ta chỉ lưu pending để điều hướng sau khi app sẵn sàng.
export async function notifeeBackgroundEventHandler({
  type,
  detail,
}: {
  type: EventType;
  detail: {notification?: Notification};
}) {
  if (type === EventType.PRESS || type === EventType.ACTION_PRESS) {
    const data = parseNotiData(detail.notification?.data);
    if (data?.orderId) {
      await AsyncStorage.setItem(
        PENDING_NAV_KEY,
        JSON.stringify({orderId: data.orderId, ts: Date.now()}),
      );
    }
  }
}
