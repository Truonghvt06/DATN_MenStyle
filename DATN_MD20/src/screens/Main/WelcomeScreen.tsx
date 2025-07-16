import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useAppDispatch } from '../../redux/store';
import { loadUserFromStorage } from '../../redux/actions/auth';
import navigation from '../../navigation/navigation';
import ScreenName from '../../navigation/ScreenName';
import { ImgSRC } from '../../constants/icons';
import { useAppTheme } from '../../themes/ThemeContext';

const WelcomeScreen = () => {
  const dispatch = useAppDispatch();
  const theme = useAppTheme();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    const init = async () => {
      const resultAction = await dispatch(loadUserFromStorage());
      if (loadUserFromStorage.fulfilled.match(resultAction)) {
        setTimeout(() => {
          navigation.navigate(ScreenName.Main.BottonTab);
        }, 2000);
      } else {
        setTimeout(() => {
          navigation.navigate(ScreenName.Main.BottonTab);
        }, 3000);
      }
    };

    init();
  }, [dispatch, fadeAnim, slideAnim]);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Animated.Image
        source={ImgSRC.img_logo}
        style={[
          styles.img,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      />
      <ActivityIndicator
        size="large"
        color={theme.primary}
        style={styles.loading}
      />
    </View>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  img: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  loading: {
    marginTop: 30,
  },
});
