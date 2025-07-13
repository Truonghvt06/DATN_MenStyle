import React, {useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Animated,
  Image,
} from 'react-native';
import {useAppDispatch} from '../../redux/store';
import {loadUserFromStorage} from '../../redux/actions/auth';
import navigation from '../../navigation/navigation';
import ScreenName from '../../navigation/ScreenName';
import {ImgSRC} from '../../constants/icons';
import {colors} from '../../themes/colors';

const WelcomeScreen = () => {
  const dispatch = useAppDispatch();

  // Tạo animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current; // bắt đầu từ dưới 20px

  useEffect(() => {
    // Animation đồng thời fade + slide
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

    // setTimeout(() => {
    //   navigation.navigate(ScreenName.Main.BottonTab);
    // }, 3000);
    // Logic kiểm tra đăng nhập
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
    <View style={styles.container}>
      <Animated.Image
        source={ImgSRC.img_logo}
        style={[
          styles.img,
          {
            opacity: fadeAnim,
            transform: [{translateY: slideAnim}],
          },
        ]}
      />
      {/* <Animated.Text
        style={[
          styles.title,
          {
            opacity: fadeAnim,
            transform: [{translateY: slideAnim}],
          },
        ]}>
        Welcome to MenStyle
      </Animated.Text>
      <ActivityIndicator
        size="large"
        color={colors.black}
        style={styles.loading}
      /> */}
    </View>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.while,
    alignItems: 'center',
    justifyContent: 'center',
  },
  img: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  title: {
    color: colors.black,
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 12,
  },
  loading: {
    marginTop: 30,
  },
});
