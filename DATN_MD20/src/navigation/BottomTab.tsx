import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import ScreenName from './ScreenName';
import HomeScreen from '../screens/Main/HomeScreen';
import CartScreen from '../screens/Main/CartScreen';
import SearchScreen from '../screens/Main/SearchScreen';
import ProfileScreen from '../screens/Main/ProfileScreen';
import {IconBottomTab} from '../constants/icons';
import FavoriteScreen from '../screens/Main/FavoriteScreen';
import {colors} from '../themes/colors';
import Block from '../components/layout/Block';
import {TextSizeCustom, TextSmall} from '../components/dataEntry/TextBase';

const Tab = createBottomTabNavigator();
const BottomTab = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarShowLabel: false, // Không hiển thị label mặc định
        tabBarStyle: styles.container,
        tabBarIcon: ({focused}) => {
          let iconName;
          let label;

          switch (route.name) {
            case ScreenName.Main.Home:
              iconName = IconBottomTab.icon_home;
              label = 'Trang chủ';
              break;

            case ScreenName.Main.Search:
              iconName = IconBottomTab.icon_search;
              label = 'Tìm kiếm';
              break;
            case ScreenName.Main.Favorite:
              iconName = IconBottomTab.icon_category;
              label = 'Yêu thích';
              break;
            case ScreenName.Main.Cart:
              iconName = IconBottomTab.icon_cart;
              label = 'Giỏ hàng';
              break;
            case ScreenName.Main.Profile:
              iconName = IconBottomTab.icon_user;
              label = 'Profile';
              break;
          }

          return (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 20,
              }}>
              <Image
                source={iconName}
                style={{
                  width: 28,
                  height: 28,
                  tintColor: focused ? 'black' : 'gray',
                }}
              />
              {focused && <Text style={styles.text}>{label}</Text>}
            </View>
          );
        },
      })}>
      <Tab.Screen name={ScreenName.Main.Home} component={HomeScreen} />
      <Tab.Screen name={ScreenName.Main.Search} component={SearchScreen} />
      <Tab.Screen name={ScreenName.Main.Favorite} component={FavoriteScreen} />
      <Tab.Screen
        name={ScreenName.Main.Cart}
        component={CartScreen}
        options={{
          tabBarIcon: ({focused}: any) => (
            <View style={{marginTop: 20, alignItems: 'center'}}>
              <Block>
                <View style={styles.cart}>
                  <TextSizeCustom
                    color="white"
                    size={13}
                    style={{textAlign: 'center'}}>
                    2
                  </TextSizeCustom>
                </View>
                <Image
                  source={IconBottomTab.icon_cart}
                  style={{
                    tintColor: focused ? colors.black : colors.gray,
                    width: 28,
                    height: 28,
                  }}
                />
              </Block>
              {focused && <Text style={styles.text}>Giỏ hàng</Text>}
            </View>
          ),
        }}
      />
      <Tab.Screen name={ScreenName.Main.Profile} component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default BottomTab;

const styles = StyleSheet.create({
  container: {
    height: 80,
    backgroundColor: 'white',
    // backgroundColor: 'rgba(255, 255, 255, 0.8)', // Nền mờ (trong suốt)
  },
  text: {
    fontSize: 12,
    color: 'black',
    marginTop: 4,
    width: 100,
    textAlign: 'center',
    // fontWeight: 'bold',
  },
  cart: {
    zIndex: 12,
    backgroundColor: colors.red,
    height: 20,
    width: 22,
    borderRadius: 30,
    position: 'absolute',
    right: -9,
    top: -5,
    // marginTop: 4,
  },
});
