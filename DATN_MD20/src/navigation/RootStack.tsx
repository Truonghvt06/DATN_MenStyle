import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {
  CardStyleInterpolators,
  createStackNavigator,
  TransitionSpecs,
} from '@react-navigation/stack';
import ScreenName from './ScreenName';
import AuthStack from './AuthStack';
import MainStack from './MainStack';
import {colors} from '../themes/colors';

const Stack = createStackNavigator();

const RootStack = () => {
  return (
    <Stack.Navigator
      screenOptions={({route}: any) => {
        if (route.params?.transition === 'vertical') {
          return {
            headerShown: false,
            ...TransitionEvent,
            cardStyle: {backgroundColor: colors.while},
          };
        }
        return {
          headerShown: false,
          transitionSpec: {
            open: TransitionSpecs.FadeInFromBottomAndroidSpec,
            close: TransitionSpecs.FadeOutToBottomAndroidSpec,
          },
          cardStyleInterpolator:
            CardStyleInterpolators.forFadeFromBottomAndroid,
          cardStyle: {backgroundColor: colors.while},
        };
      }}
      initialRouteName={ScreenName.Auth.AuthStack}>
      <Stack.Screen name={ScreenName.Main.MainStack} component={MainStack} />
      <Stack.Screen name={ScreenName.Auth.AuthStack} component={AuthStack} />
    </Stack.Navigator>
  );
};

export default RootStack;

const styles = StyleSheet.create({});
