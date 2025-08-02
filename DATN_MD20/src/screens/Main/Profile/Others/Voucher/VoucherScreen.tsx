import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import React, {useMemo, useState, useEffect, useCallback} from 'react';
import ContainerView from '../../../../../components/layout/ContainerView';
import Header from '../../../../../components/dataDisplay/Header';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import useLanguage from '../../../../../hooks/useLanguage';
import {useAppTheme} from '../../../../../themes/ThemeContext';
import VoucherItem from './VoucherItem';
import {TextSmall} from '../../../../../components/dataEntry/TextBase';
import {ToastAndroid, Platform, Alert} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import Toast from 'react-native-toast-message';
import configToast from '../../../../../components/utils/configToast';
import {useAppDispatch, useAppSelector} from '../../../../../redux/store'; // tuỳ vào cấu trúc bạn có hook typed
import {fetchVouchers} from '../../../../../redux/actions/voucher';
import {clearVouchers} from '../../../../../redux/reducers/voucher';
import {colors} from '../../../../../themes/colors';

const VoucherScreen = () => {
  const {top} = useSafeAreaInsets();
  const theme = useAppTheme();
  const {getTranslation} = useLanguage();
  const dispatch = useAppDispatch();
  const {vouchers, loading, page, limit, total, error} = useAppSelector(
    state => state.voucher,
  );

  const [selectedTab, setSelectedTab] = useState(getTranslation('tat_ca'));

  const tabs = [getTranslation('tat_ca'), 'Voucher Shop', 'Vận chuyển'];

  // map tab -> scope param
  const scopeParam = useMemo<undefined | 'order' | 'shipping'>(() => {
    switch (selectedTab) {
      case 'Voucher Shop':
        return 'order';
      case 'Vận chuyển':
        return 'shipping';
      case 'Tất cả':
      case 'Tất cả': // fallback
      default:
        return undefined;
    }
  }, [selectedTab]);

  const loadVouchers = useCallback(
    (opts: {page?: number; replace?: boolean} = {}) => {
      const p = opts.page ?? 1;
      if (opts.replace) {
        dispatch(clearVouchers());
      }
      dispatch(
        fetchVouchers({
          scope: scopeParam,
          page: p,
          limit: 10,
        }),
      );
    },
    [dispatch, scopeParam],
  );

  // initial + when tab changes
  useEffect(() => {
    loadVouchers({page: 1, replace: true});
  }, [scopeParam, loadVouchers]);

  const handleCopy = (code: string) => {
    if (code) {
      Clipboard.setString(code);
      Toast.show({
        type: 'notification',
        position: 'top',
        text1: 'Thành công',
        text2: 'Sao chép mã thành công',
        visibilityTime: 1000,
        autoHide: true,
        swipeable: true,
      });
    }
  };

  const renderTab = (tab: string) => (
    <View
      key={tab}
      style={{
        width: '33.9%',
        flexDirection: 'row',
        justifyContent: 'center',
      }}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => setSelectedTab(tab)}
        style={[
          styles.itemtab,
          {
            backgroundColor: theme.background,
            borderBottomColor:
              selectedTab === tab ? theme.primary : 'transparent',
          },
        ]}>
        <TextSmall
          style={{
            color: selectedTab === tab ? theme.primary : theme.text,
          }}>
          {tab}
        </TextSmall>
      </TouchableOpacity>
    </View>
  );

  const onEndReached = () => {
    if (!loading && vouchers.length < total) {
      loadVouchers({page: page + 1});
    }
  };

  const onRefresh = () => {
    loadVouchers({page: 1, replace: true});
  };

  const renderFooter = () => {
    if (loading && page > 1) {
      return (
        <View style={{paddingVertical: 12, alignItems: 'center'}}>
          <ActivityIndicator />
        </View>
      );
    }
    return null;
  };

  return (
    <ContainerView>
      <Header label={getTranslation('ma_giam_gia')} paddingTop={top} />
      <View style={[styles.tab, {borderColor: theme.border_color}]}>
        {tabs.map(renderTab)}
      </View>

      <FlatList
        data={vouchers}
        keyExtractor={item => item._id}
        renderItem={({item}) => (
          <VoucherItem
            image={item.image}
            title={item.title}
            description={item.description}
            voucher_scope={item.voucher_scope}
            discount_type={item.discount_type}
            max_discount_value={item.max_discount_value}
            discount_value={item.discount_value}
            min_order_amount={item.min_order_amount}
            date_from={item.date_from}
            date_to={item.date_to}
            code={item.code || ''}
            onPress={() => {
              handleCopy(item.code || '');
            }}
          />
        )}
        contentContainerStyle={{
          paddingHorizontal: 8,
          paddingTop: 15,
          paddingBottom: 16,
        }}
        showsVerticalScrollIndicator={false}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.4}
        ListFooterComponent={renderFooter}
        refreshControl={
          <RefreshControl
            refreshing={loading && page === 1}
            onRefresh={onRefresh}
          />
        }
        ListEmptyComponent={
          !loading ? (
            <View style={{padding: 20, alignItems: 'center'}}>
              <Text>Không có Voucher</Text>
            </View>
          ) : null
        }
      />
    </ContainerView>
  );
};

export default VoucherScreen;

const styles = StyleSheet.create({
  tab: {
    width: '100%',
    flexDirection: 'row',
    borderBottomWidth: 0.2,
    marginTop: 15,
  },
  itemtab: {
    width: '100%',
    paddingBottom: 8,
    borderBottomWidth: 2,
    alignItems: 'center',
  },
});
