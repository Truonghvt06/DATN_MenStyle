import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';

const screenWidth = Dimensions.get('window').width;
const itemWidth = (screenWidth - 30) / 2;
const sliderHeight = 180;

export default function Home() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const sliderImages = [
    'https://intphcm.com/data/upload/banner-thoi-trang-nam.jpg',
    'https://intphcm.com/data/upload/banner-thoi-trang-nam-dep.jpg',
    'https://intphcm.com/data/upload/dung-luong-banner-thoi-trang.jpg',
  ];

  const scrollRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % sliderImages.length;
      scrollRef.current?.scrollTo({ x: nextIndex * screenWidth, animated: true });
      setCurrentIndex(nextIndex);
    }, 3000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  useEffect(() => {
    fetch('http://10.0.2.2:3000/products/')
      .then(response => response.json())
      .then(data => {
        setProducts(data);
        setFilteredProducts(data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const filterByType = (type) => {
    setSelectedType(type);
    if (type === null) {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(p => p.type?.toLowerCase() === type.toLowerCase());
      setFilteredProducts(filtered);
    }
  };

  const renderItem = ({ item }) => {
    const firstVariant = item.variants?.[0] || null;

    return (
      <View style={[styles.product, { width: itemWidth }]}>
        {firstVariant?.image ? (
          <Image source={{ uri: firstVariant.image }} style={styles.image} />
        ) : (
          <Text>Ảnh không có</Text>
        )}
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}>
          {item.price != null
            ? Number(item.price).toLocaleString('vi-VN') + ' VNĐ'
            : 'Chưa có giá'}
        </Text>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Slider */}
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        ref={scrollRef}
        style={styles.slider}>
        {sliderImages.map((img, index) => (
          <Image key={index} source={{ uri: img }} style={styles.sliderImage} />
        ))}
      </ScrollView>

      {/* Bộ lọc (dạng ngang có thể cuộn) */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.button, selectedType === null && styles.activeButton]}
          onPress={() => filterByType(null)}>
          <Text style={styles.buttonText}>Tất cả</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, selectedType === 'áo thun' && styles.activeButton]}
          onPress={() => filterByType('áo thun')}>
          <Text style={styles.buttonText}>Áo thun</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, selectedType === 'áo khoác' && styles.activeButton]}
          onPress={() => filterByType('áo khoác')}>
          <Text style={styles.buttonText}>Áo khoác</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, selectedType === 'thể thao' && styles.activeButton]}
          onPress={() => filterByType('thể thao')}>
          <Text style={styles.buttonText}>Thể thao</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, selectedType === 'polo' && styles.activeButton]}
          onPress={() => filterByType('polo')}>
          <Text style={styles.buttonText}>Polo</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, selectedType === 'sơ mi' && styles.activeButton]}
          onPress={() => filterByType('sơ mi')}>
          <Text style={styles.buttonText}>Sơ mi</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, selectedType === 'dài tay' && styles.activeButton]}
          onPress={() => filterByType('dài tay')}>
          <Text style={styles.buttonText}>Dài tay</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Danh sách sản phẩm */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={styles.row}
        scrollEnabled={false}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  slider: {
    width: screenWidth,
    height: sliderHeight,
    marginBottom: 10,
  },
  sliderImage: {
    width: screenWidth,
    height: sliderHeight,
    resizeMode: 'cover',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    marginBottom: 10,
    gap: 10,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#ccc',
    borderRadius: 20,
    marginRight: 10,
  },
  activeButton: {
    backgroundColor: '#007bff',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  product: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 10,
  },
  image: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  price: {
    fontSize: 14,
    color: '#888',
  },
});
