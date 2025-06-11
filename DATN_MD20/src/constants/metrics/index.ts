import {Dimensions} from 'react-native';

const metrics = {
  space: 8,
  diviceWidth: Dimensions.get('window').width,
  diviceHeight: Dimensions.get('window').height,
  diviceScreenWidth: Dimensions.get('screen').width,
  diviceScreenHeight: Dimensions.get('screen').height,
};

export default metrics;
