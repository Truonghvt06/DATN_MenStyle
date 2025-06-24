import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createStackNavigator} from '@react-navigation/stack';

import ScreenName from './ScreenName';
import HomeScreen from '../screens/Main/HomeScreen';
import ProfileScreen from '../screens/Main/ProfileScreen';
import CartScreen from '../screens/Main/CartScreen';
import SearchScreen from '../screens/Main/SearchScreen';
import NotificationScreen from '../screens/Main/NotificationScreen';
import BottomTab from './BottomTab';
import FavoriteScreen from '../screens/Main/FavoriteScreen';
import SearchDetail from '../screens/Main/SearchDetail';
import ProductDetail from '../screens/Main/Product/ProductDetail';
import ChinhSach from '../screens/Main/ChinhSach';
import DieuKhoanVaDieuKien from '../screens/Main/DieuKhoanVaDieuKien';
import CategoryScreen from '../screens/Main/Categorys/CategoryScreen';
import AddressScreen from '../screens/Main/Profile/Address/AddressScreen';
import AddressDetailScreen from '../screens/Main/Profile/Address/AddressDetailScreen';
import AddAddress from '../screens/Main/Profile/Address/AddAddress';

const Stack = createStackNavigator();

const MainStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false, gestureEnabled: false}}
      initialRouteName={ScreenName.Main.BottonTab}>
      <Stack.Screen name={ScreenName.Main.BottonTab} component={BottomTab} />
      <Stack.Screen name={ScreenName.Main.Home} component={HomeScreen} />
      <Stack.Screen name={ScreenName.Main.Profile} component={ProfileScreen} />
      <Stack.Screen name={ScreenName.Main.Cart} component={CartScreen} />
      <Stack.Screen name={ScreenName.Main.Settings} component={HomeScreen} />
      <Stack.Screen name={ScreenName.Main.Search} component={SearchScreen} />
      <Stack.Screen name="DieuKhoan" component={DieuKhoanVaDieuKien} />
      <Stack.Screen name="ChinhSach" component={ChinhSach} />
        
      <Stack.Screen
        name={ScreenName.Main.Favorite}
        component={FavoriteScreen}
      />

      <Stack.Screen
        name={ScreenName.Main.Notifications}
        component={NotificationScreen}
      />
      <Stack.Screen
        name={ScreenName.Main.SearchDetail}
        component={SearchDetail}
      />
      <Stack.Screen
        name={ScreenName.Main.ProductDetail}
        component={ProductDetail}
      />
      <Stack.Screen
        name={ScreenName.Main.Category}
        component={CategoryScreen}
      />
      <Stack.Screen name={ScreenName.Main.Address} component={AddressScreen} />
      <Stack.Screen
        name={ScreenName.Main.AddressDetail}
        component={AddressDetailScreen}
      />
      <Stack.Screen name={ScreenName.Main.AddAddress} component={AddAddress} />
    </Stack.Navigator>
  );
};

export default MainStack;

const styles = StyleSheet.create({});
