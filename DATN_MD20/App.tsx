import {Platform, StatusBar, StyleSheet} from 'react-native';
import React, {useEffect} from 'react';
import {Provider} from 'react-redux';
import AppNavigation from './src/navigation/AppNavigation';
import {PersistGate} from 'redux-persist/integration/react';
import {persistor, store, useAppSelector} from './src/redux/store';
import Toast from 'react-native-toast-message';
import {ThemeProvider} from './src/themes/ThemeContext'; // Thêm dòng này
import {requestUserPermission} from './src/utils/common/firebase/firebaseNotification';
import {setupNotificationListeners} from './src/utils/common/firebase/fcmHelper';
import {PermissionsAndroid} from 'react-native';

const App = () => {
  if (Platform.OS === 'android') {
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
  }
  useEffect(() => {
    setupNotificationListeners();
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider>
          <StatusBar
            backgroundColor={'transparent'}
            translucent
            barStyle="light-content"
          />
          <AppNavigation />
          <Toast />
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;

const styles = StyleSheet.create({});
