import {StatusBar, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Provider} from 'react-redux';
import AppNavigation from './src/navigation/AppNavigation';

import {PersistGate} from 'redux-persist/integration/react';
import {persistor, store} from './src/redux/store';
import Toast from 'react-native-toast-message';

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <StatusBar
          backgroundColor={'transparent'}
          translucent
          barStyle="light-content"
        />

        <ThemeProvider>
          <AppNavigation />
        </ThemeProvider>
       

        <AppNavigation />
        <Toast />

      </PersistGate>
    </Provider>
  );
};

export default App;

const styles = StyleSheet.create({});
