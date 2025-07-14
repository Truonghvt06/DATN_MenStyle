import {
  FlatList,
  Image,
  StyleSheet,
  View,
} from 'react-native';
import React from 'react';
import ContainerView from '../../components/layout/ContainerView';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import navigation from '../../navigation/navigation';
import InputBase from '../../components/dataEntry/Input/InputBase';
import metrics from '../../constants/metrics';
import {IconSRC} from '../../constants/icons';
import Block from '../../components/layout/Block';
import TouchIcon from '../../components/dataEntry/Button/TouchIcon';
import {TextMedium} from '../../components/dataEntry/TextBase';
import useLanguage from '../../hooks/useLanguage';
import {useAppTheme} from '../../themes/ThemeContext';

const search = [
  { id: 1, title: 'Áo thun nam' },
  { id: 2, title: 'Giày thể thao' },
  { id: 3, title: 'Quần jean nữ' },
];

const SearchDetail = () => {
  const {top} = useSafeAreaInsets();
  const {getTranslation} = useLanguage();
  const theme = useAppTheme();

  return (
    <ContainerView
      paddingTop={top}
      containerStyle={[styles.container, { backgroundColor: theme.background }]}
    >
      <Block row alignCT>
        <InputBase
          autoFocus
          radius={10}
          inputStyle={[styles.input, { color: theme.text }]}
          containerStyle={{ width: '85%' }}
          placeholder={getTranslation('nhap_sp_tim_kiem')}
          placeholderTextColor={theme.text}
          customLeft={
            <Image
              style={[styles.icon_search, { tintColor: theme.text }]}
              source={IconSRC.icon_search}
            />
          }
        />
        <TouchIcon
          size={30}
          containerStyle={styles.back}
          title={getTranslation('huy')}
          colorTitle={theme.text}
          onPress={() => navigation.goBack()}
        />
      </Block>

      <Block marB={10} />

      <FlatList
        data={search}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Block
            borderBottomWidth={0.5}
            borderColor={theme.text}
            padV={10}
          >
            <Block row justifyBW alignCT marR={7}>
              <TextMedium style={{ color: theme.text }}>{item.title}</TextMedium>
              <TouchIcon
                icon={IconSRC.icon_close}
                size={10}
                color={theme.text}
                onPress={() => {
                  // Handle delete item
                }}
              />
            </Block>
          </Block>
        )}
        ListFooterComponent={() =>
          search.length > 0 ? (
            <TouchIcon
              title={getTranslation('xoa_lich_su_tim_kiem')}
              colorTitle={theme.text}
              containerStyle={{
                marginVertical: 16,
                alignSelf: 'flex-end',
              }}
              onPress={() => {
                // Handle clear history
              }}
            />
          ) : null
        }
      />
    </ContainerView>
  );
};

export default SearchDetail;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: metrics.space * 2,
  },
  back: {
    flex: 1,
    alignItems: 'flex-end',
  },
  input: {
    height: 37,
    width: '90%',
    marginLeft: -3,
  },
  icon_search: {
    width: 20,
    height: 20,
    alignSelf: 'center',
    marginLeft: 7,
  },
});
