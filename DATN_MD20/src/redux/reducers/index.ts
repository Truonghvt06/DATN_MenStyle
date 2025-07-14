import {combineReducers} from 'redux';
import auth from './auth';
import application from './application';
import theme from '../slice/ThemeSlice';

export default combineReducers({
  auth,
  application,
  theme,
});
