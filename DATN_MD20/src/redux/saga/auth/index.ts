import {all, takeLatest} from 'redux-saga/effects';
import types from '../../types';
import login from './login';

export default [
  function* fetchWatcher() {
    yield all([takeLatest(types.auth.login, login)]);
  },
];
