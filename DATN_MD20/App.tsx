import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Provider} from 'react-redux';
import AppNavigation from './src/navigation/AppNavigation';
const App = () => {
  return (
    // <Provider>
    <AppNavigation />
    // </Provider>
  );
};

export default App;

const styles = StyleSheet.create({});
