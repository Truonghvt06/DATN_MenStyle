import {FlatList, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import ModalBottom from '../dataDisplay/Modal/ModalBottom';
import metrics from '../../constants/metrics';
import {colors} from '../../themes/colors';
import TouchIcon from '../dataEntry/Button/TouchIcon';
import Block from '../layout/Block';

interface Props {
  label?: string;
  visible: boolean;
  data: any;
  onClose: () => void;
  onSelect: (text: string) => void;
}
const SelectAddress = (props: Props) => {
  const {label, visible = false, data, onClose, onSelect} = props;
  return (
    <>
      <ModalBottom
        label={label}
        header
        visible={visible}
        animationType="fade"
        heightModal={metrics.diviceHeight * 0.65}
        onClose={onClose}
        children={
          <FlatList
            data={data}
            keyExtractor={item => item.code}
            renderItem={({item}) => (
              <TouchIcon
                title={item.name}
                onPress={() => {
                  onSelect(item);
                  onClose();
                }}
                containerStyle={styles.item}
                colorTitle={colors.black}
              />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: 50}}
          />
        }
      />
    </>
  );
};

export default SelectAddress;

const styles = StyleSheet.create({
  item: {
    paddingVertical: 15,
    marginHorizontal: 10,
    borderBottomWidth: 0.3,
    borderColor: colors.gray1,
  },
});
