import {FlatList, Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import ContainerView from '../../components/layout/ContainerView';
import Header from '../../components/dataDisplay/Header';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import ScreenName from '../../navigation/ScreenName';
import navigation from '../../navigation/navigation';
import InputBase from '../../components/dataEntry/Input/InputBase';
import metrics from '../../constants/metrics';
import {IconSRC} from '../../constants/icons';
import {colors} from '../../themes/colors';
import Block from '../../components/layout/Block';
import TouchIcon from '../../components/dataEntry/Button/TouchIcon';
import {TextMedium, TextSmall} from '../../components/dataEntry/TextBase';
import {useAppTheme} from '../../themes/ThemeContext';

const search = [
  {
    id: 1,
    title: 'Áo thun nam',
  },
  {
    id: 2,
    title: 'Giày thể thao',
  },
  {
    id: 3,
    title: 'Quần jean nữ',
  },
];
const SearchDetail = () => {
  const {top} = useSafeAreaInsets();
  const theme = useAppTheme();

  return (
    <ContainerView
      paddingTop={top}
      style={[styles.container, {backgroundColor: theme.background}]}>
      <Block row alignCT>
        <InputBase
          autoFocus
          radius={10}
          style={[styles.input, {color: theme.text}]}
          containerStyle={{width: '90%'}}
          placeholder="Nhập sản phẩm tìm kiếm..."
          placeholderTextColor={theme.text}
          customLeft={
            <Image
              style={[styles.icon_search, {tintColor: theme.text}]}
              source={IconSRC.icon_search}
            />
          }
        />
        <TouchIcon
          size={30}
          containerStyle={styles.back}
          title="Huỷ"
          colorTitle={theme.text}
          onPress={() => navigation.goBack()}
        />
      </Block>
      <Block marB={10} />
      <FlatList
        data={search}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => {
          return (
            <Block
              borderBottomWidth={0.5}
              borderColor={colors.gray3}
              padV={10}>
              <Block row justifyBW alignCT marR={7}>
                <TextMedium style={{color: theme.text}}>{item.title}</TextMedium>
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
          );
        }}
        ListFooterComponent={() =>
          search.length > 0 ? (
            <TouchIcon
              title="Xoá tất cả lịch sử"
              colorTitle={theme.text}
              containerStyle={{marginVertical: 16, alignSelf: 'flex-end'}}
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
