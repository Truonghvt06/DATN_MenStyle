import {PayloadAction} from '@reduxjs/toolkit';
import {Login, setToken} from '../../../actions/auth';
import {put} from 'redux-saga/effects';
import navigation from '../../../../navigation/navigation';
import ScreenName from '../../../../navigation/ScreenName';

export default function* (actions: PayloadAction<Login>) {
  try {
    const body = actions.payload;
    if (body.tk == '0332002619') {
      yield put(setToken('1'));
    } else {
      yield put(setToken('2'));
    }
    navigation.reset(ScreenName.Main.MainStack);
  } catch (error) {
    console.log('saga login error: ', error);
  } finally {
    yield console.log('Thành công');
  }
}
