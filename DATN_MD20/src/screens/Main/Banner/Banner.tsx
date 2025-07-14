// BannerSlider.tsx
import React, {useRef, useEffect, useState} from 'react';
import {
  ScrollView,
  View,
  Image,
  Dimensions,
  StyleSheet,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import {dataBanner} from '../../../constants/data';
import metrics from '../../../constants/metrics';
import {useAppDispatch, useAppSelector} from '../../../redux/store';
import {fetchBanner} from '../../../redux/actions/banner';

const width = metrics.diviceScreenWidth - 16;

// Tạo dữ liệu giả: [last, ...realData, first]
// const extendedData = [
//   dataBanner[dataBanner.length - 1],
//   ...dataBanner,
//   dataBanner[0],
// ];

const BannerSlider = () => {
  const scrollRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const dispatch = useAppDispatch();
  const {listBanner} = useAppSelector(state => state.banner);

  // console.log('BANNER: ', listBanner);

  const extendedData =
    listBanner.length > 0
      ? [listBanner[listBanner.length - 1], ...listBanner, listBanner[0]]
      : [];

  useEffect(() => {
    dispatch(fetchBanner());
  }, []);
  // Khi mount: scroll đến ảnh đầu thật
  useEffect(() => {
    setTimeout(() => {
      scrollRef.current?.scrollTo({x: width, animated: false});
    }, 10);
  }, []);

  // Auto scroll
  useEffect(() => {
    const timer = setInterval(() => {
      scrollRef.current?.scrollTo({
        x: width * (currentIndex + 2),
        animated: true,
      });
    }, 3000);

    return () => clearInterval(timer);
  }, [currentIndex]);

  const onScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = e.nativeEvent.contentOffset.x;
    let index = Math.round(offsetX / width);

    if (index === 0) {
      // Kéo về cuối (clone ảnh cuối)
      scrollRef.current?.scrollTo({
        x: width * listBanner.length,
        animated: false,
      });
      setCurrentIndex(listBanner.length - 1);
    } else if (index === extendedData.length - 1) {
      // Kéo về đầu (clone ảnh đầu)
      scrollRef.current?.scrollTo({x: width, animated: false});
      setCurrentIndex(0);
    } else {
      setCurrentIndex(index - 1); // Trừ 1 vì dữ liệu được thêm ảnh giả ở đầu
    }
  };

  return (
    <View style={styles.container}>
      <View>
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          onMomentumScrollEnd={onScrollEnd}>
          {extendedData.map((item, index) => (
            <Image
              key={index}
              source={{uri: item.image}}
              style={styles.image}
              resizeMode="cover"
            />
          ))}
        </ScrollView>

        <View style={styles.dotContainer}>
          {listBanner.map((_, index) => (
            <View
              key={index}
              style={[styles.dot, index === currentIndex && styles.activeDot]}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 220,
  },
  image: {
    width: width,
    height: 200,
    borderRadius: 10,
  },
  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: -12,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 3,
  },
  activeDot: {
    width: 12,
    backgroundColor: '#000',
  },
});

export default BannerSlider;
