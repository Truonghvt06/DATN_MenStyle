import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';
import RootStack from './RootStack';
import {isReadyRef, navigationRef} from './navigation';
import Toast from 'react-native-toast-message';
import configToast from '../components/utils/configToast';
import {tryProcessPendingNotiNav} from '../utils/common/firebase/fcmHelper';
// import {flushStoredNotificationIfAny} from '../utils/common/firebase/fcmHelper';

const AppNavigation = () => {
  const routeNameRef = React.useRef<any>(null);

  return (
    <SafeAreaProvider>
      <NavigationContainer
        ref={navigationRef}
        onReady={async () => {
          isReadyRef.current = true;
          routeNameRef.current = navigationRef.current.getCurrentRoute().name;
          await tryProcessPendingNotiNav(); // xử lý điều hướng nếu app mở từ thông báo
          // tryProcessPendingNav();
        }}>
        <RootStack />
      </NavigationContainer>
      {/* <Toast /> */}
      <Toast config={configToast} />
    </SafeAreaProvider>
  );
};

export default AppNavigation;

const styles = StyleSheet.create({});
