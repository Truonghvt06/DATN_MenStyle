import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ScreenName from './ScreenName';
import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import ForgotPassScreen from '../screens/Auth/forgot/PhoneScreen';
import OTPScreen from '../screens/Auth/forgot/OTPScreen';
import NewPassScreen from '../screens/Auth/forgot/NewPassScreen';

const Stack = createNativeStackNavigator();
const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false, gestureEnabled: false}}>
      <Stack.Screen name={ScreenName.Auth.Login} component={LoginScreen} />
      <Stack.Screen
        name={ScreenName.Auth.Register}
        component={RegisterScreen}
      />
      <Stack.Screen
        name={ScreenName.Auth.ForgotPassword}
        component={ForgotPassScreen}
      />
      <Stack.Screen name={ScreenName.Auth.NewPass} component={NewPassScreen} />
      <Stack.Screen name={ScreenName.Auth.OTPScreen} component={OTPScreen} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({});

export default AuthStack;
