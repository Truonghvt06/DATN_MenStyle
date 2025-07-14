import {combineReducers} from 'redux';
import auth from './auth';
import application from './application';

import theme from '../slice/ThemeSlice';

import product from './product';
import favorite from './favorite';
import banner from './banner';
import address from './address';


export default combineReducers({
  auth,
  application,

  theme,

  product,
  favorite,
  banner,
  address,

});
