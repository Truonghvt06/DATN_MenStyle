import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import Header from '../../components/dataDisplay/Header';
import navigation from '../../navigation/navigation';
import ScreenName from '../../navigation/ScreenName';
import { notifications as demoNotifications } from '../../constants/data';
import { useAppTheme } from '../../themes/ThemeContext';

type NotificationItem = {
  id: string;
  title: string;
  content: string;
  time: string;
  read: boolean;
};

export default function NotificationScreen() {
  const [notifications, setNotifications] = useState(demoNotifications);
  const theme = useAppTheme();

  const renderItem = ({ item }: { item: NotificationItem }) => (
    <View
      style={[
        styles.item,
        { backgroundColor: item.read ? theme.background : '#eaf4ff' },
      ]}
    >
      <Text style={[styles.title]}>{item.title}</Text>
      <Text>{item.content}</Text>
      <Text style={[styles.time, ]}>{item.time}</Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Header
        label="Thông báo"
        labelStyle={{ color: theme.text }}
        onPressLeft={() => navigation.resetToHome(ScreenName.Main.BottonTab)}
      />
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 30 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  item: {
    padding: 16,
    backgroundColor: '#f9f9f9',
    marginBottom: 10,
    borderRadius: 6,
    elevation: 1,
  },
  unread: { backgroundColor: '#eaf4ff' },
  title: { fontWeight: 'bold', fontSize: 16 },
  time: { fontSize: 12, color: '#888', marginTop: 4 },
});
