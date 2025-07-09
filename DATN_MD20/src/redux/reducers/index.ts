import {combineReducers} from 'redux';
import auth from './auth';
import application from './application';
import product from './product';

export default combineReducers({
  auth,
  application,
  product,
});
