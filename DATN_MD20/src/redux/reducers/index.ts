import {combineReducers} from 'redux';
import auth from './auth';
import application from './application';

export default combineReducers({
  auth,
  application,
});
