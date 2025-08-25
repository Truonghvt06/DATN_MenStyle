// src/utils/common/firebase/fcmHelper.ts
import {Linking, Platform} from 'react-native';
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import notifee, {
  AndroidImportance,
  EventType,
  Notification,
} from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import navigation, {
  isReadyRef,
  navigationRef,
} from '../../../navigation/navigation';
import ScreenName from '../../../navigation/ScreenName';
import {CommonActions} from '@react-navigation/native';

// ====== CHANNEL & GROUP (có âm thanh + cộng dồn) ======
export const ANDROID_CHANNEL_ID = 'orders'; // kênh mới để đảm bảo có sound
const ANDROID_CHANNEL_NAME = 'Thông báo đơn hàng';
const ANDROID_GROUP_ID = 'orders-group'; // group để cộng dồn
const PENDING_NAV_KEY = '@pending_noti_nav';
const UNREAD_COUNT_KEY = '@orders_unread_count';

// ⚠️ Đổi các hằng tên route cho khớp app của bạn.
const ROOT_STACK = ScreenName.Main.MainStack;
const ORDER_DETAIL = ScreenName.Main.OrderDetail;
const BOTTOM_TAB = ScreenName.Main.BottonTab;

let listenersInstalled = false; // chặn đăng ký nhiều lần
let lastOrderNavigated = ''; // chặn double navigate

// ==== Điều hướng tới chi tiết đơn hàng (đổi theo app của bạn) ====
// function navigateToOrderDetail(orderId: string) {
//   navigation.navigate(ScreenName.Main.MainStack, {
//     screen: ScreenName.Main.OrderDetail, // <-- screen con
//     params: {orderId, screen: 'bg_notification'},
//   });
// }

// Ưu tiên reset để tránh kẹt state từ tab/stack khác
function navigateToOrderDetail(orderId: string) {
  if (!isReadyRef?.current || !navigation?.navigate) return;

  // A) Thử reset về đúng stack rồi mở OrderDetail
  try {
    navigation.resetToStackWithScreen(ROOT_STACK, ORDER_DETAIL, {
      orderId,
      screen: 'bg_notification',
    });
    return;
  } catch {}

  // B) Fallback: dispatch navigate lồng (MainStack -> OrderDetail)
  try {
    const action = CommonActions.navigate({
      name: ROOT_STACK,
      params: {
        screen: ORDER_DETAIL,
        params: {orderId, screen: 'bg_notification'},
      },
    });
    navigationRef.current?.dispatch(action);
    return;
  } catch {}

  // C) Fallback cuối: mở tab gốc rồi vào OrderDetail
  try {
    const action = CommonActions.navigate({
      name: ROOT_STACK,
      params: {
        screen: BOTTOM_TAB,
        params: {
          screen: ORDER_DETAIL,
          params: {orderId, screen: 'bg_notification'},
        },
      },
    });
    navigationRef.current?.dispatch(action);
  } catch (e) {
    console.log('navigateToOrderDetail fallback error:', e);
  }
}

// ====== Kiểu dữ liệu data của thông báo ======
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
    deeplink: d?.deeplink,
  };
};

// ====== Channel (Android 8+) có âm thanh ======
async function ensureChannels() {
  if (Platform.OS !== 'android') return;

  // Tạo kênh "orders" có sound. (Nếu đã có với cấu hình khác, Android sẽ giữ cấu hình cũ.)
  await notifee.createChannel({
    id: ANDROID_CHANNEL_ID,
    name: ANDROID_CHANNEL_NAME,
    importance: AndroidImportance.HIGH,
    sound: 'default',
    vibration: true,
  });

  // (Tùy chọn) cố gắng tạo thêm "default" có sound để phòng backend gửi vào default
  // Không đảm bảo ghi đè nếu kênh đã tồn tại.
  await notifee.createChannel({
    id: 'default',
    name: 'Mặc định',
    importance: AndroidImportance.HIGH,
    sound: 'default',
    vibration: true,
  });
}

// ====== Đếm & hiển thị summary (tùy chọn nhưng nên có để thấy tổng số) ======
async function incrementUnreadAndShowSummary() {
  try {
    const old = Number(await AsyncStorage.getItem(UNREAD_COUNT_KEY)) || 0;
    const unread = old + 1;
    await AsyncStorage.setItem(UNREAD_COUNT_KEY, String(unread));

    // Hiện/refresh summary gom nhóm
    await notifee.displayNotification({
      id: 'orders-summary', // id cố định cho summary
      title: 'MenStyle',
      body: `Bạn có ${unread} cập nhật đơn hàng`,
      android: {
        channelId: ANDROID_CHANNEL_ID,
        groupId: ANDROID_GROUP_ID,
        groupSummary: true,
        // bấm vào summary → mở app (có thể dẫn tới danh sách thông báo)
        pressAction: {id: 'open-summary', launchActivity: 'default'},
        smallIcon: 'ic_launcher',
      },
      ios: {sound: undefined}, // iOS không dùng group summary như Android
    });
  } catch {}
}

export async function resetUnreadSummary() {
  await AsyncStorage.setItem(UNREAD_COUNT_KEY, '0');
  // Có thể hủy summary nếu muốn:
  // await notifee.cancelNotification('orders-summary');
}

// ====== HIỂN THỊ LOCAL (Foreground / data-only trong BG) ======
export async function displayLocalNotification(
  input: FirebaseMessagingTypes.RemoteMessage | NotiData,
) {
  const data = parseNotiData(input);
  await ensureChannels();

  // id unique để cộng dồn (không replace)
  const uniqueId = `${data.orderId || 'order'}-${Date.now()}`;

  await notifee.displayNotification({
    id: uniqueId,
    title: data.title || 'MenStyle',
    body: data.body || 'Bạn có thông báo mới',
    data: toStringData(data),
    android: {
      channelId: ANDROID_CHANNEL_ID,
      groupId: ANDROID_GROUP_ID, // ✅ gom nhóm
      pressAction: {id: 'open-order', launchActivity: 'default'}, // mở app
      smallIcon: 'ic_launcher',
    },
    ios: {
      sound: 'default', // ✅ âm thanh local ở iOS
    },
  });

  // cập nhật summary
  await incrementUnreadAndShowSummary();
}

// ====== XỬ LÝ NHẤN THÔNG BÁO → ĐIỀU HƯỚNG ======
export async function handleNotificationNavigation(payload?: NotiData) {
  const data = parseNotiData(payload);
  const orderId = data.orderId || data.order_id;
  if (!orderId) return;

  // Nếu nav chưa sẵn sàng, lưu pending
  if (!isReadyRef?.current) {
    await AsyncStorage.setItem(
      PENDING_NAV_KEY,
      JSON.stringify({orderId, ts: Date.now()}),
    );
    return;
  }

  // Chống double navigate (bấm nhanh 2 lần)
  if (lastOrderNavigated === orderId) return;
  lastOrderNavigated = orderId;

  // Nếu đã cấu hình deep link, ưu tiên deeplink
  if (data.deeplink) {
    try {
      await Linking.openURL(data.deeplink);
      return;
    } catch {}
  }

  navigateToOrderDetail(orderId);
}

// Gọi khi NavigationContainer onReady
export async function tryProcessPendingNotiNav() {
  const raw = await AsyncStorage.getItem(PENDING_NAV_KEY);
  if (!raw) return;

  await AsyncStorage.removeItem(PENDING_NAV_KEY);
  try {
    const parsed = JSON.parse(raw);
    if (parsed?.orderId) {
      await handleNotificationNavigation({orderId: parsed.orderId});
    }
  } catch {}
}

// ====== ĐĂNG KÝ LISTENERS (gọi 1 lần khi app mount) ======
export async function setupNotificationListeners() {
  if (listenersInstalled) return () => {};
  listenersInstalled = true;

  await ensureChannels();

  // Foreground: FCM tới → tự hiện local (OS không hiện khi app foreground)
  const unsubOnMessage = messaging().onMessage(async rm => {
    await displayLocalNotification(rm);
  });

  // App đang background, user bấm thông báo do OS hiển thị (FCM có "notification")
  const unsubOpened = messaging().onNotificationOpenedApp(rm => {
    console.log('onNotificationOpenedApp data:', rm?.data);
    handleNotificationNavigation(rm as any);
  });

  // App mở từ QUIT do bấm thông báo của OS
  const initial = await messaging().getInitialNotification();
  console.log('getInitialNotification data:', initial?.data);
  if (initial) {
    // lưu/điều hướng – nếu nav chưa sẵn sàng tryProcessPendingNotiNav sẽ xử tiếp

    await handleNotificationNavigation(initial as any);
  }

  // Bấm vào thông báo do Notifee hiển thị khi app đang foreground
  const unsubNotifeeFg = notifee.onForegroundEvent(async ({type, detail}) => {
    if (type === EventType.PRESS || type === EventType.ACTION_PRESS) {
      console.log('notifee press data:', detail.notification?.data);
      await handleNotificationNavigation(detail.notification?.data);
    }
    // (tùy chọn) clear/unread khi DISMISSED...
  });

  // Nếu có pending từ BG/QUIT
  await tryProcessPendingNotiNav();

  return () => {
    unsubOnMessage();
    unsubOpened();
    unsubNotifeeFg();
    listenersInstalled = false;
  };
}

// ====== HANDLER CHO BG/QUIT (đăng ký ở index.js) ======
// A) FCM data-only khi app ở BG/QUIT → tự hiển thị local
export async function backgroundMessageHandler(
  rm: FirebaseMessagingTypes.RemoteMessage,
) {
  // Nếu payload có "notification", OS sẽ tự hiển thị -> KHÔNG hiển thị local nữa để tránh trùng
  if (rm?.notification) return;
  await displayLocalNotification(rm);
}

// B) Nhấn thông báo do Notifee hiển thị khi app BG/QUIT
export async function notifeeBackgroundEventHandler({
  type,
  detail,
}: {
  type: EventType;
  detail: {notification?: Notification};
}) {
  if (type === EventType.PRESS || type === EventType.ACTION_PRESS) {
    const data = parseNotiData(detail.notification?.data);
    if (data?.orderId || data?.order_id) {
      await AsyncStorage.setItem(
        PENDING_NAV_KEY,
        JSON.stringify({
          orderId: data.orderId || data.order_id,
          ts: Date.now(),
        }),
      );
    }
  }
}
