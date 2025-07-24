import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import productService from '../../services/products/productService';
import { useAppTheme } from '../../themes/ThemeContext';

const filters = ['Liên quan', 'Mới nhất', 'Bán chạy', 'Giá'];

const priceRanges = [
  { label: 'Dưới 100k', min: 0, max: 100000 },
  { label: '100k - 300k', min: 100000, max: 300000 },
  { label: '300k - 500k', min: 300000, max: 500000 },
  { label: 'Trên 500k', min: 500000, max: Infinity },
];

const categories = [
  'Áo thun',
  'Áo khoác',
  'Áo sơ mi',
  'Áo polo',
  'Áo thể thao',
  'Áo hoodie',
];

const ProductCard = ({ item, onPress }: { item: any; onPress: () => void }) => {
  const imageUri = item.variants?.[0]?.image || '';
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={{ uri: imageUri }} style={styles.productImage} />
      <Text numberOfLines={2} style={styles.productName}>{item.name}</Text>
      <Text style={styles.price}>{item.price?.toLocaleString('vi-VN')}₫</Text>
    </TouchableOpacity>
  );
};

// ... (giữ nguyên tất cả import, biến filters, priceRanges, categories và component ProductCard)

const SearchSplitScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const theme = useAppTheme();

  const { keyword } = route.params;
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('Liên quan');
  const [sortByPriceAsc, setSortByPriceAsc] = useState<boolean | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleFilterPress = (filter: string) => {
    if (filter === 'Giá') {
      if (activeFilter === 'Giá') {
        setSortByPriceAsc(prev => (prev === null ? true : !prev));
      } else {
        setSortByPriceAsc(true);
      }
    } else {
      setSortByPriceAsc(null);
    }
    setActiveFilter(filter);
  };

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await productService.getProducts();
        const all = Array.isArray(res?.data) ? res.data : [];

        const normalizeText = (text: string) =>
          text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

        const normKeyword = normalizeText(keyword);

        const exactMatches = all.filter(
          (product: any) =>
            product?.name && normalizeText(product.name).includes(normKeyword)
        );

        const others = all.filter(
          (product: any) =>
            product?.name && !normalizeText(product.name).includes(normKeyword)
        );

        const merged = [...exactMatches, ...others];
        setAllProducts(merged);
      } catch (err) {
        console.log('Fetch all error', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [keyword]);

  const applyFilters = (data: any[]) => {
    let filtered = [...data];

    if (selectedPriceRange) {
      const range = priceRanges.find(p => p.label === selectedPriceRange);
      if (range) {
        filtered = filtered.filter(p =>
          p.price >= range.min && p.price < range.max
        );
      }
    }

    if (selectedCategory) {
      filtered = filtered.filter(p =>
        p.name?.toLowerCase()?.includes(selectedCategory.toLowerCase())
      );
    }

    // 🧠 Sắp xếp theo bộ lọc
    if (activeFilter === 'Giá' && sortByPriceAsc !== null) {
      filtered.sort((a, b) =>
        sortByPriceAsc ? a.price - b.price : b.price - a.price
      );
    } else if (activeFilter === 'Mới nhất') {
      filtered.sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else if (activeFilter === 'Bán chạy') {
      filtered.sort((a, b) => (b.sold || 0) - (a.sold || 0));
    }

    return filtered;
  };

  const handleSelectProduct = (product: any) => {
    navigation.navigate('ProductDetail', { id: product._id });
  };

  const renderProductList = (data: any[]) => (
    <FlatList
      data={applyFilters(data)}
      numColumns={2}
      columnWrapperStyle={{ justifyContent: 'space-between' }}
      keyExtractor={item => item._id}
      renderItem={({ item }) => (
        <ProductCard item={item} onPress={() => handleSelectProduct(item)} />
      )}
      contentContainerStyle={{ paddingBottom: 40 }}
    />
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.text} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 🔍 Search Header */}
      <View style={styles.searchRow}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.searchInput}
          value={keyword}
          placeholder="Tìm kiếm sản phẩm..."
          placeholderTextColor="#999"
        />
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Text style={styles.filterIcon}>⇅ Lọc</Text>
        </TouchableOpacity>
      </View>

      {/* 🔘 Filter Buttons */}
      <View style={styles.filterRow}>
        {filters.map(f => (
          <TouchableOpacity
            key={f}
            style={[
              styles.filterButton,
              activeFilter === f && styles.activeFilterButton,
            ]}
            onPress={() => handleFilterPress(f)}
          >
            <Text
              style={[
                styles.filterTextBtn,
                activeFilter === f && styles.activeFilterText,
              ]}
            >
              {f}
              {f === 'Giá' && activeFilter === 'Giá' && (
                sortByPriceAsc ? ' ↑' : ' ↓'
              )}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 📦 Unified Product List */}
      {renderProductList(allProducts)}

      {/* 🧾 Filter Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <ScrollView style={{ maxHeight: 400 }}>
              <Text style={styles.modalTitle}>Khoảng Giá</Text>
              <View style={styles.modalSection}>
                {priceRanges.map(p => (
                  <TouchableOpacity
                    key={p.label}
                    style={[
                      styles.optionBtn,
                      selectedPriceRange === p.label && styles.optionBtnActive,
                    ]}
                    onPress={() =>
                      setSelectedPriceRange(
                        selectedPriceRange === p.label ? null : p.label
                      )
                    }
                  >
                    <Text
                      style={[
                        styles.optionText,
                        selectedPriceRange === p.label && styles.optionTextActive,
                      ]}
                    >
                      {p.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.modalTitle}>Loại Sản Phẩm</Text>
              <View style={styles.modalSection}>
                {categories.map(c => (
                  <TouchableOpacity
                    key={c}
                    style={[
                      styles.optionBtn,
                      selectedCategory === c && styles.optionBtnActive,
                    ]}
                    onPress={() =>
                      setSelectedCategory(selectedCategory === c ? null : c)
                    }
                  >
                    <Text
                      style={[
                        styles.optionText,
                        selectedCategory === c && styles.optionTextActive,
                      ]}
                    >
                      {c}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <Pressable
                style={styles.resetBtn}
                onPress={() => {
                  setSelectedCategory(null);
                  setSelectedPriceRange(null);
                }}
              >
                <Text style={{ color: '#FF3B30' }}>Thiết lập lại</Text>
              </Pressable>
              <Pressable
                style={styles.applyBtn}
                onPress={() => setModalVisible(false)}
              >
                <Text style={{ color: '#fff', fontWeight: '600' }}>Áp dụng</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default SearchSplitScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 16,
    backgroundColor: '#fff',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 10,
  },
  backBtn: {
    padding: 6,
    backgroundColor: '#ccc',
    borderRadius: 20,
  },
  backText: {
    fontSize: 16,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 22,
    paddingHorizontal: 14,
    height: 36,
    fontSize: 14,
    backgroundColor: '#f9f9f9',
  },
  filterIcon: {
    color: '#007AFF',
    fontSize: 14,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  activeFilterButton: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  filterTextBtn: {
    fontSize: 13,
    color: '#333',
  },
  activeFilterText: {
    color: '#fff',
    fontWeight: '600',
  },
  card: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 8,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#eee',
  },
  productImage: {
    width: '100%',
    height: 130,
    borderRadius: 8,
    marginBottom: 6,
  },
  productName: {
    fontSize: 13,
    color: '#333',
    marginBottom: 4,
  },
  price: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000066',
    justifyContent: 'flex-start',
  },
  modalContainer: {
    marginTop: 60,
    backgroundColor: '#fff',
    padding: 16,
    maxHeight: '80%',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  modalSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  optionBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  optionBtnActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  optionText: {
    fontSize: 13,
    color: '#333',
  },
  optionTextActive: {
    color: '#fff',
    fontWeight: '500',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    gap: 10,
  },
  resetBtn: {
    flex: 1,
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderColor: '#FF3B30',
    borderWidth: 1,
    alignItems: 'center',
  },
  applyBtn: {
    flex: 1,
    padding: 12,
    backgroundColor: '#FF3B30',
    borderRadius: 8,
    alignItems: 'center',
  },
});
