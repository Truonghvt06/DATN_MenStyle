import React, {useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Header from '../../components/dataDisplay/Header';
import navigation from '../../navigation/navigation';
import {notifications as demoNotifications} from '../../constants/data';
import ContainerView from '../../components/layout/ContainerView';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import metrics from '../../constants/metrics';
import useLanguage from '../../hooks/useLanguage';
import {useAppTheme} from '../../themes/ThemeContext';

type NotificationItem = {
  id: string;
  title: string;
  content: string;
  time: string;
  read: boolean;
};

export default function NotificationScreen() {
  const {top} = useSafeAreaInsets();
  const {getTranslation} = useLanguage();
  const theme = useAppTheme();

  const [notifications, setNotifications] = useState(demoNotifications);

  const renderItem = ({item}: {item: NotificationItem}) => {
    const background = item.read
      ? theme.card || theme.background
      : theme.buttonSelected || '#d0eaff';

    return (
      <TouchableOpacity
        style={[
          styles.item,
          {
            backgroundColor: background,
            shadowColor: theme.text,
          },
        ]}>
        <Text style={[styles.title, {color: theme.text}]}>{item.title}</Text>
        <Text style={{color: theme.text}}>{item.content}</Text>
        <Text style={[styles.time, {color: theme.text}]}>{item.time}</Text>
        {!item.read && (
          <View
            style={[
              styles.dot,
              {
                backgroundColor: theme.text,
              },
            ]}
          />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <ContainerView
      containerStyle={{
        backgroundColor: theme.background,
        paddingTop: top,
      }}>
      <Header
        label={getTranslation('thong_bao')}
        paddingTop={top}
        backgroundColor={theme.background}
        textColor={theme.text}
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
  item: {
    padding: 10,
    marginBottom: 8,
    borderRadius: 8,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
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
  },
});
