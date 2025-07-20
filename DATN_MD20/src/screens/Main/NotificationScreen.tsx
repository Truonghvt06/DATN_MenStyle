import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import Header from '../../components/dataDisplay/Header';
import navigation from '../../navigation/navigation';
import ScreenName from '../../navigation/ScreenName';
import {notifications as demoNotifications} from '../../constants/data';
import ContainerView from '../../components/layout/ContainerView';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import metrics from '../../constants/metrics';
import {colors} from '../../themes/colors';
import useLanguage from '../../hooks/useLanguage';
import {useAppTheme} from '../../themes/ThemeContext';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {Notification} from '../../redux/reducers/notification';
import {
  fetchNotifications,
  markNotificationAsRead,
} from '../../redux/actions/notification';
import moment from 'moment';

export default function NotificationScreen() {
  const {top} = useSafeAreaInsets();
  const {getTranslation} = useLanguage();
  const theme = useAppTheme();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const dispatch = useAppDispatch();
  const {listNotifications, loading} = useAppSelector(
    state => state.notification,
  );

  // Lấy danh sách thông báo từ Redux
  useEffect(() => {
    dispatch(fetchNotifications());
  }, []);

  //găn danh sách thông báo vào state
  useEffect(() => {
    setNotifications(listNotifications);
  }, [listNotifications]);

  // Xử lý khi người dùng nhấn vào thông báo
  const handleNotificationPress = (notification: Notification) => {
    if (!notification.is_read) {
      // Đánh dấu thông báo là đã đọc
      dispatch(markNotificationAsRead(notification._id));
    }
    if (notification.type === 'order') {
      navigation.navigate(ScreenName.Main.OrderDetail, {
        screen: 'notification',
        orders: null,
      });
    } else if (notification.type === 'promotion') {
      navigation.navigate(ScreenName.Main.Voucher);
    }
  };
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'order':
        return '🧾';
      case 'promotion':
        return '🎁';
      case 'system':
        return '🔔';
      default:
        return 'ℹ️';
    }
  };
  const renderItem = ({item}: {item: Notification}) => (
    <TouchableOpacity
      onPress={() => handleNotificationPress(item)}
      style={[
        styles.item,
        !item.is_read && styles.unread,
        {
          backgroundColor: !item.is_read ? theme.sky_blue : theme.gray,
        },
      ]}>
      <Text style={[styles.title, {color: theme.text}]}>
        {`${getTypeIcon(item.type)} ${item.title}`}
      </Text>
      <Text style={{color: theme.text}}>{item.content}</Text>
      <Text style={[styles.time, {color: theme.text}]}>
        {moment(item.createdAt).format('DD-MM-YY')}
      </Text>
      {!item.is_read && <View style={styles.dot} />}
    </TouchableOpacity>
  );

  return (
    <ContainerView style={{backgroundColor: theme.background, flex: 1}}>
      <Header
        label={getTranslation('thong_bao')}
        paddingTop={top}
        onPressLeft={() => navigation.goBack()}
      />
      <FlatList
        data={notifications}
        keyExtractor={item => item._id}
        renderItem={renderItem}
        contentContainerStyle={{
          paddingBottom: 30,
          paddingTop: 10,
          paddingHorizontal: metrics.space,
        }}
      />
    </ContainerView>
  );
}

const styles = StyleSheet.create({
  item: {
    padding: 10,
    marginBottom: 8,
    borderRadius: 8,
    shadowColor: colors.black,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
  },
  unread: {
    backgroundColor: colors.sky_blue,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  time: {
    fontSize: 12,
    marginTop: 4,
  },
  dot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.red,
  },
});
