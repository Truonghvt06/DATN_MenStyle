import React, {useState} from 'react';
import {View, Text, FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import Header from '../../components/dataDisplay/Header';
import navigation from '../../navigation/navigation';
import ScreenName from '../../navigation/ScreenName';
import {notifications as demoNotifications} from '../../constants/data';
import ContainerView from '../../components/layout/ContainerView';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import metrics from '../../constants/metrics';
import {colors} from '../../themes/colors';
type NotificationItem = {
  id: string;
  title: string;
  content: string;
  time: string;
  read: boolean;
};

export default function NotificationScreen() {
  const {top} = useSafeAreaInsets();
  const [notifications, setNotifications] = useState(demoNotifications);

  const renderItem = ({item}: {item: NotificationItem}) => (
    <TouchableOpacity style={[styles.item, !item.read && styles.unread]}>
      <Text style={styles.title}>{item.title}</Text>
      <Text>{item.content}</Text>
      <Text style={styles.time}>{item.time}</Text>
      {!item.read && <View style={styles.dot} />}
    </TouchableOpacity>
  );

  return (
    <ContainerView>
      <Header
        label="Thông báo"
        paddingTop={top - 10}
        onPressLeft={() => navigation.goBack()}
      />
      <FlatList
        data={notifications}
        keyExtractor={item => item.id}
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
  container: {flex: 1, padding: 16, backgroundColor: '#fff'},
  item: {
    padding: 10,
    backgroundColor: '#f9f9f9',
    marginBottom: 8,
    borderRadius: 8,
    shadowColor: colors.black,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
  },
  unread: {backgroundColor: colors.sky_blue},
  title: {fontWeight: 'bold', fontSize: 16},
  time: {fontSize: 12, color: '#888', marginTop: 4},
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
