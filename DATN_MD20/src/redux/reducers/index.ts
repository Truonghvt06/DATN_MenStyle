import {combineReducers} from 'redux';
import auth from './auth';
import application from './application';
import theme from '../slice/ThemeSlice';
import product from './product';
import favorite from './favorite';
import banner from './banner';
import address from './address';
import notification from './notification';
import cart from './cart';
import review from './review';

export default combineReducers({
  auth,
  application,
  theme,
  product,
  favorite,
  banner,
  address,
  notification,
  cart,
  review,
});
