import {StatusBar, StyleSheet} from 'react-native';
import React from 'react';
import {Provider} from 'react-redux';
import AppNavigation from './src/navigation/AppNavigation';
import {PersistGate} from 'redux-persist/integration/react';
import {persistor, store} from './src/redux/store';
import Toast from 'react-native-toast-message';
import {ThemeProvider} from './src/themes/ThemeContext'; // Thêm dòng này

const App = () => {
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
