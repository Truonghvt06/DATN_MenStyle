import {Image, StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
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
import {dataProduct} from '../constants/data';
import useLanguage from '../hooks/useLanguage';
import {useAppDispatch, useAppSelector} from '../redux/store';
import {useAppTheme} from '../themes/ThemeContext';
import {fetchCart} from '../redux/actions/cart';

const Tab = createBottomTabNavigator();
const BottomTab = () => {
  const theme = useAppTheme();
  const {getTranslation} = useLanguage();
  const {token, user} = useAppSelector(state => state.auth);

  const dispatch = useAppDispatch();
  const {items} = useAppSelector(state => state.cart);

  useEffect(() => {
    dispatch(fetchCart(user?._id));
  }, []);

  // const {} = useAppSelector(state => state.cart);

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarShowLabel: false, // Không hiển thị label mặc định
        tabBarStyle: [styles.container, {backgroundColor: theme.background}],
        tabBarIcon: ({focused}) => {
          let iconName;
          let label;

          switch (route.name) {
            case ScreenName.Main.Home:
              iconName = IconBottomTab.icon_home;
              label = getTranslation('trang_chu');
              break;

            case ScreenName.Main.Search:
              iconName = IconBottomTab.icon_search;
              label = getTranslation('tim_kiem');
              break;
            case ScreenName.Main.Favorite:
              iconName = IconBottomTab.icon_category;
              label = getTranslation('ua_thich');
              break;
            case ScreenName.Main.Cart:
              iconName = IconBottomTab.icon_cart;
              label = getTranslation('gio_hang');
              break;
            case ScreenName.Main.Profile:
              iconName = IconBottomTab.icon_user;
              label = getTranslation('tai_khoan');
              break;
          }

          return (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 25,
              }}>
              <Image
                source={iconName}
                style={{
                  width: 30,
                  height: 30,
                  tintColor: focused ? theme.primary : 'gray',
                }}
              />
              {focused && (
                <Text style={[styles.text, {color: theme.primary}]}>
                  {label}
                </Text>
              )}
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
            <View
              style={{
                flex: 1,
                paddingTop: focused ? 5 : 13,
                alignItems: 'center',
              }}>
              <Block>
                {token ? (
                  <View style={styles.cart}>
                    <TextSizeCustom
                      color="white"
                      size={11}
                      style={{textAlign: 'center'}}>
                      {items.length}
                    </TextSizeCustom>
                  </View>
                ) : null}
                <Image
                  source={IconBottomTab.icon_cart}
                  style={{
                    tintColor: focused ? theme.primary : colors.gray,
                    width: 30,
                    height: 30,
                  }}
                />
              </Block>
              {focused && (
                <Text style={[styles.text, {color: theme.primary}]}>
                  {getTranslation('gio_hang')}
                </Text>
              )}
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
    height: 85,
    // backgroundColor: 'white',
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
    justifyContent: 'center',
    height: 18,
    width: 20,
    borderRadius: 30,
    position: 'absolute',
    right: -9,
    top: -5,
    // marginTop: 4,
  },
});
