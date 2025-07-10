import {
  FlatList,
  Image,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../themes/colors';
import navigation from '../../navigation/navigation';
import { IconSRC } from '../../constants/icons';
import InputBase from '../../components/dataEntry/Input/InputBase';
import TouchIcon from '../../components/dataEntry/Button/TouchIcon';
import metrics from '../../constants/metrics';
import { products } from '../../services/products/products';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HISTORY_KEY = 'search_history';

// ✅ Hàm loại bỏ dấu tiếng Việt
const normalize = (str: string) =>
  str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

const SearchDetail = () => {
  const { top } = useSafeAreaInsets();
  const [keyword, setKeyword] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [defaultSuggestions, setDefaultSuggestions] = useState<any[]>([]);
  const [showAllResults, setShowAllResults] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  useEffect(() => {
    loadHistory();
    loadDefaultSuggestions();
  }, []);

  const loadHistory = async () => {
    try {
      const history = await AsyncStorage.getItem(HISTORY_KEY);
      if (history) setSearchHistory(JSON.parse(history));
    } catch (err) {
      console.log('Load history error', err);
    }
  };

  const loadDefaultSuggestions = async () => {
    try {
      const res = await products.getRecommended?.() || await products.searchByName('');
      setDefaultSuggestions(res.data);
    } catch (err) {
      console.log('Default product error', err);
    }
  };

  const saveHistory = async (history: string[]) => {
    try {
      await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    } catch (err) {
      console.log('Save history error', err);
    }
  };

  const addToSearchHistory = (text: string) => {
    const updated = [text, ...searchHistory.filter(item => item !== text)];
    const limited = updated.slice(0, 10);
    setSearchHistory(limited);
    saveHistory(limited);
  };

  const handleChangeKeyword = async (text: string) => {
    setKeyword(text);
    if (!text.trim()) {
      setSuggestions([]);
      setShowAllResults(false);
      return;
    }

    try {
      const res = await products.getProducts();
      const allProducts = res.data;

      const filtered = allProducts.filter((item: any) =>
        normalize(item.name).includes(normalize(text))
      );
      const rest = allProducts.filter((item: any) =>
        !normalize(item.name).includes(normalize(text))
      );
      const finalList = [...filtered, ...rest];

      setSuggestions(finalList);
    } catch (err) {
      console.log('Search error', err);
    }
  };

  const handleSelectSuggestion = (item: any) => {
    addToSearchHistory(item.name);
    navigation.navigate('ProductDetail', { product: item });
  };

  const handleSubmitSearch = async () => {
    if (!keyword.trim()) return;

    try {
      const res = await products.getProducts();
      const allProducts = res.data;

      const filtered = allProducts.filter((item: any) =>
        normalize(item.name).includes(normalize(keyword))
      );
      const rest = allProducts.filter((item: any) =>
        !normalize(item.name).includes(normalize(keyword))
      );
      const results = [...filtered, ...rest];

      addToSearchHistory(keyword);
      navigation.navigate('SearchResultScreen', {
        keyword,
        results,
      });
    } catch (err) {
      console.log('Search error', err);
    }
  };

  const renderProductCard = ({ item }: { item: any }) => {
    const imageUri =
      item.variants?.[0]?.image ||
      'https://n7media.coolmate.me/uploads/June2025/ao-polo-premium-aircool-1214-be_23.jpg?aio=w-1069';

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => handleSelectSuggestion(item)}
      >
        <Image
          source={{ uri: imageUri }}
          style={styles.productImage}
          resizeMode="cover"
        />
        <Text numberOfLines={2} style={styles.productName}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  const productList =
    suggestions.length > 0 ? suggestions : defaultSuggestions;

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={[styles.container, { paddingTop: top }]}>
        {/* 🔍 Thanh tìm kiếm */}
        <View style={styles.header}>
          <InputBase
            autoFocus
            radius={10}
            value={keyword}
            onChangeText={handleChangeKeyword}
            onSubmitEditing={handleSubmitSearch}
            inputStyle={styles.input}
            containerStyle={{ flex: 1 }}
            placeholder="Nhập sản phẩm cần tìm..."
            customLeft={
              <Image style={styles.icon_search} source={IconSRC.icon_search} />
            }
          />
          <TouchIcon
            size={30}
            title="Huỷ"
            onPress={() => navigation.goBack()}
          />
        </View>

        {/* 🧭 Gợi ý chữ hoặc lịch sử tìm kiếm */}
        <View style={styles.topPane}>
          <ScrollView keyboardShouldPersistTaps="handled">
            {keyword.trim() === ''
              ? searchHistory.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.suggestionItem}
                    onPress={() => {
                      setKeyword(item);
                      handleChangeKeyword(item);
                    }}
                  >
                    <Text style={styles.suggestionText}>{item}</Text>
                  </TouchableOpacity>
                ))
              : suggestions.slice(0, 6).map(item => (
                  <TouchableOpacity
                    key={item._id}
                    style={styles.suggestionItem}
                    onPress={() => handleSelectSuggestion(item)}
                  >
                    <Text style={styles.suggestionText}>{item.name}</Text>
                  </TouchableOpacity>
                ))}
          </ScrollView>
        </View>

        {/* 🖼️ Gợi ý sản phẩm luôn hiển thị */}
        <View style={styles.bottomPane}>
          <FlatList
            data={
              showAllResults ? productList : productList.slice(0, 6)
            }
            keyExtractor={item => item._id}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: 'space-between' }}
            contentContainerStyle={{ paddingBottom: 20, gap: 12 }}
            renderItem={renderProductCard}
            showsVerticalScrollIndicator={false}
          />

          {/* Xem thêm */}
          {!showAllResults && productList.length > 6 && (
            <TouchableOpacity
              style={styles.seeMoreBtn}
              onPress={() => setShowAllResults(true)}
            >
              <Text style={styles.seeMoreText}>Xem thêm</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default SearchDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: metrics.space * 2,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 10,
  },
  input: {
    height: 37,
    width: '100%',
    marginLeft: -3,
  },
  icon_search: {
    width: 20,
    height: 20,
    tintColor: colors.black,
    marginLeft: 7,
    alignSelf: 'center',
  },
  topPane: {
    flex: 0.4,
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 10,
    marginBottom: 8,
  },
  bottomPane: {
    flex: 0.6,
  },
  suggestionItem: {
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.gray3,
  },
  suggestionText: {
    fontSize: 14,
    color: colors.black,
  },
  card: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8,
    borderWidth: 0.5,
    borderColor: colors.gray3,
  },
  productImage: {
    width: '100%',
    height: 120,
    borderRadius: 6,
    marginBottom: 6,
  },
  productName: {
    fontSize: 13,
    color: colors.black,
  },
  seeMoreBtn: {
    alignSelf: 'center',
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: colors.gray2,
    borderRadius: 6,
  },
  seeMoreText: {
    fontSize: 14,
    color: colors.black,
    fontWeight: '600',
  },
});
