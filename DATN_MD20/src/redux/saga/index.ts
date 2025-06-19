import {all, fork} from 'redux-saga/effects';
import auth from './auth';

const forkWatcher = (watcher: any) => fork(watcher);

const rootSaga = function* () {
  yield all([...auth.map(forkWatcher)]);
};

export default rootSaga;
