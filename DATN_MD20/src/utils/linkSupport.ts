// utils/externalLinks.ts
import {Alert, Linking, Platform} from 'react-native';

export async function openPhone(phone: string) {
  const cleaned = phone.replace(/[^\d+]/g, '');
  const url = `tel:${cleaned}`;
  try {
    await Linking.openURL(url);
  } catch (e: any) {
    Alert.alert('Lỗi', 'Không thể mở ứng dụng gọi điện');
  }
}

export async function composeEmail({
  to,
  subject = '',
  body = '',
}: {
  to: string | string[];
  subject?: string;
  body?: string;
}) {
  const toStr = Array.isArray(to) ? to.join(',') : to;
  const enc = (s: string) => encodeURIComponent(s);

  // Android: dùng mailto
  const mailtoUrl = `mailto:${enc(toStr)}?subject=${enc(subject)}&body=${enc(
    body,
  )}`;

  // iOS (tuỳ chọn): có thể thử googlegmail trước rồi fallback mailto
  const iosGmailUrl = `googlegmail://co?to=${enc(toStr)}&subject=${enc(
    subject,
  )}&body=${enc(body)}`;

  try {
    if (Platform.OS === 'ios' && (await Linking.canOpenURL(iosGmailUrl))) {
      await Linking.openURL(iosGmailUrl);
      return;
    }
    await Linking.openURL(mailtoUrl);
  } catch (e: any) {
    Alert.alert('Lỗi', 'Không thể mở ứng dụng email');
  }
}

// mở Messenger theo userId (số) hoặc username (ví dụ: "yourpage")
export async function openMessenger(opts: {
  userId?: string;
  username?: string;
}) {
  const {userId, username} = opts || {};
  const urls: string[] = [];

  // Ưu tiên deep-link app
  if (Platform.OS === 'ios') {
    if (userId) urls.push(`fb-messenger://user-thread/${userId}`);
  } else {
    if (userId) urls.push(`fb-messenger://user/${userId}`);
  }

  // Fallback mở m.me (sẽ nhảy vào app Messenger nếu có)
  if (username) urls.push(`https://m.me/${encodeURIComponent(username)}`);
  if (userId && !username)
    urls.push(`https://m.me/${encodeURIComponent(userId)}`);

  // Thử lần lượt
  for (const url of urls) {
    try {
      const can = await Linking.canOpenURL(url);
      if (can) {
        await Linking.openURL(url);
        return;
      }
    } catch {}
  }
  Alert.alert(
    'Lỗi',
    'Không thể mở Messenger. Hãy cài đặt hoặc đăng nhập ứng dụng.',
  );
}

// mở Zalo theo uid (Zalo ID) hoặc số điện thoại
export async function openZalo(opts: {uid?: string; phone?: string}) {
  const {uid, phone} = opts || {};
  const urls: string[] = [];

  // Deep-link (nhiều máy hỗ trợ 1 trong 2 dạng dưới)
  if (uid) {
    urls.push(`zalo://chat?uid=${encodeURIComponent(uid)}`);
    urls.push(`zalo://conversation?uid=${encodeURIComponent(uid)}`);
  }
  if (phone) {
    urls.push(`zalo://chat?phone=${encodeURIComponent(phone)}`);
    urls.push(`zalo://conversation?phone=${encodeURIComponent(phone)}`);
  }

  // Fallback web (sẽ tự bật app Zalo nếu có)
  const id = uid ?? phone;
  if (id) urls.push(`https://zalo.me/${encodeURIComponent(id)}`);

  for (const url of urls) {
    try {
      const can = await Linking.canOpenURL(url);
      if (can) {
        await Linking.openURL(url);
        return;
      }
    } catch {}
  }
  Alert.alert('Lỗi', 'Không thể mở Zalo. Hãy cài đặt hoặc đăng nhập ứng dụng.');
}
