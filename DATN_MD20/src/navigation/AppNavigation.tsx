import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';
import RootStack from './RootStack';
import {isReadyRef, navigationRef} from './navigation';

const AppNavigation = () => {
  const routeNameRef = React.useRef<any>(null);

  return (
    <SafeAreaProvider>
      <NavigationContainer
        ref={navigationRef}
        onReady={() => {
          isReadyRef.current = true;
          routeNameRef.current = navigationRef.current.getCurrentRoute().name;
        }}>
        <RootStack />
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default AppNavigation;

const styles = StyleSheet.create({});
