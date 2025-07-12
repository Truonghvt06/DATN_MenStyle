import {combineReducers} from 'redux';
import auth from './auth';
import application from './application';
import product from './product';
import favorite from './favorite';
import banner from './banner';

export default combineReducers({
  auth,
  application,
  product,
  favorite,
  banner,
});
