import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  TextInput,
} from 'react-native';
import React, { useState } from 'react';
import { useRoute } from '@react-navigation/native';
import { colors } from '../../themes/colors';
import metrics from '../../constants/metrics';
import navigation from '../../navigation/navigation';
import { useAppTheme } from '../../themes/ThemeContext';

const normalizeText = (text: string) =>
  text.normalize('NFD').replace(/\u0300-\u036f/g, '').toLowerCase();

const SearchResultScreen = () => {
  const theme = useAppTheme();
  const route = useRoute();
  const { keyword, results } = route.params as {
    keyword: string;
    results: any[];
  };

  const [activeFilter, setActiveFilter] = useState('Liên quan');
  const [priceSortDirection, setPriceSortDirection] = useState<'asc' | 'desc'>('asc');

  let sortedResults = [...results];

  if (activeFilter === 'Liên quan') {
    const normalizedKeyword = normalizeText(keyword);
    const keywordWords = normalizedKeyword.split(' ').filter(Boolean);
    const exactMatches: any[] = [];
    const partialNameMatches: any[] = [];
    const categoryOrDescMatches: any[] = [];
    const others: any[] = [];

    for (const item of results) {
      const name = normalizeText(item.name || '');
      const category = normalizeText(item.category || '');
      const desc = normalizeText(item.description || '');

      if (name.includes(normalizedKeyword)) {
        exactMatches.push(item);
      } else if (keywordWords.some(word => name.includes(word))) {
        partialNameMatches.push(item);
      } else if (
        keywordWords.some(word => category.includes(word) || desc.includes(word))
      ) {
        categoryOrDescMatches.push(item);
      } else {
        others.push(item);
      }
    }
    sortedResults = [...exactMatches, ...partialNameMatches, ...categoryOrDescMatches, ...others];
  } else if (activeFilter === 'Giá') {
    sortedResults.sort((a, b) => {
      const pa = a.price || 0, pb = b.price || 0;
      return priceSortDirection === 'asc' ? pa - pb : pb - pa;
    });
  } else if (activeFilter === 'Mới nhất') {
    sortedResults.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } else if (activeFilter === 'Bán chạy') {
    sortedResults.sort((a, b) => (b.sold || 0) - (a.sold || 0));
  }

  const renderItem = ({ item }: { item: any }) => {
    const imageUri = item.variants?.[0]?.image || '';
    const originalPrice = item.originalPrice || 0;
    const price = item.price || 0;
    const discount = originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

    return (
      <TouchableOpacity
        style={[styles.card, { backgroundColor: theme.card }]}
        onPress={() => navigation.navigate('ProductDetail', { product: item })}>
        <Image source={{ uri: imageUri }} style={styles.productImage} />
        {discount > 0 && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>{discount}%</Text>
          </View>
        )}
        <Text numberOfLines={2} style={[styles.productName, { color: theme.text }]}>{item.name}</Text>
        <View style={styles.priceContainer}>
          {originalPrice > price && (
            <Text style={[styles.originalPrice, { color: theme.text }]}> {originalPrice.toLocaleString('vi-VN')}đ</Text>
          )}
          <Text style={[styles.currentPrice, { color: theme.primary }]}> {price.toLocaleString('vi-VN')}đ</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const filters = ['Liên quan', 'Mới nhất', 'Bán chạy', 'Giá'];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.searchBarContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={[styles.backIcon, { color: theme.text }]}>←</Text>
        </TouchableOpacity>
        <View style={styles.searchInputWrapper}>
          <TextInput
            style={[styles.searchInput, { color: theme.text }]}
            placeholder="Nhập sản phẩm cần tìm..."
            placeholderTextColor={theme.text}
            defaultValue={keyword}
          />
        </View>
        <TouchableOpacity style={styles.filterIcon}>
          <Text style={{ color: theme.text }}>⏚ Lọc</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 48, marginBottom: 12 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterBar}>
          {filters.map(filter => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterButton,
                activeFilter === filter && { backgroundColor: theme.primary, borderColor: theme.primary },
              ]}
              onPress={() => {
                if (filter === 'Giá') {
                  if (activeFilter === 'Giá') {
                    setPriceSortDirection(d => (d === 'asc' ? 'desc' : 'asc'));
                  } else {
                    setPriceSortDirection('asc');
                    setActiveFilter('Giá');
                  }
                } else {
                  setActiveFilter(filter);
                }
              }}>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: activeFilter === filter ? '600' : '500',
                  color: activeFilter === filter ? theme.card : theme.text,
                }}>
                {filter === 'Giá' && activeFilter === 'Giá'
                  ? `Giá (${priceSortDirection === 'asc' ? '↑' : '↓'})`
                  : filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <Text style={[styles.title, { color: theme.text }]}>Kết quả cho "{keyword}"</Text>

      <FlatList
        data={sortedResults}
        keyExtractor={item => item._id}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.flatListContent}
      />
    </View>
  );
};

export default SearchResultScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: metrics.space * 2,
    marginBottom: 12,
  },
  backButton: { paddingRight: 10 },
  backIcon: { fontSize: 24 },
  searchInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    height: 40,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  filterIcon: {
    paddingLeft: 10,
    paddingHorizontal: 10,
  },
  filterBar: {
    flexGrow: 1,
    paddingHorizontal: metrics.space * 2,
    gap: 8,
    alignItems: 'center',
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    minWidth: 100,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: colors.gray1,
    borderWidth: 1,
    borderColor: colors.gray3,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    paddingHorizontal: metrics.space * 2,
  },
  flatListContent: {
    gap: 12,
    paddingBottom: 20,
    paddingHorizontal: metrics.space * 2,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    borderRadius: 8,
    padding: 8,
    borderWidth: 0.5,
    borderColor: colors.gray3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  productImage: {
    width: '100%',
    height: 120,
    borderRadius: 6,
    marginBottom: 6,
  },
  discountBadge: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: colors.red,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderTopLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  discountText: {
    color: colors.while,
    fontSize: 10,
    fontWeight: 'bold',
  },
  productName: {
    fontSize: 13,
    marginBottom: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 4,
  },
  originalPrice: {
    fontSize: 12,
    textDecorationLine: 'line-through',
    marginRight: 5,
  },
  currentPrice: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});
