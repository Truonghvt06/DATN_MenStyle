import React from 'react';
import {StyleSheet} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NavigationContainer, DefaultTheme, DarkTheme} from '@react-navigation/native';
import RootStack from './RootStack';
import {isReadyRef, navigationRef} from './navigation';
import {useAppTheme} from '../themes/ThemeContext';

const AppNavigation = () => {
  const routeNameRef = React.useRef<any>(null);
  const theme = useAppTheme();

  // Tạo theme phù hợp cho NavigationContainer
  const navTheme = {
    ...(theme.mode === 'dark' ? DarkTheme : DefaultTheme),
    colors: {
      ...(theme.mode === 'dark' ? DarkTheme.colors : DefaultTheme.colors),
      background: theme.background,
      text: theme.text,
      card: theme.card,
      border: theme.border,
      primary: theme.primary,
    },
  };

  return (
    <SafeAreaProvider>
      <NavigationContainer
        ref={navigationRef}
        theme={navTheme} // ✅ Thêm theme cho NavigationContainer
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
