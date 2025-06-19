// import {persistReducer, persistStore} from 'redux-persist';
// import {configureStore} from '@reduxjs/toolkit';
// import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import reducers from '../reducers';
// import rootSaga from '../saga';
// // import createSagaMiddleware from 'redux-saga';
// import createSagaMiddleware from 'redux-saga';

// const saga = createSagaMiddleware();

// const middlewares = [saga];

// export type RootState = ReturnType<typeof store.getState>;

// export type AppDispatch = typeof store.dispatch;

// const persistConfig = {
//   key: 'menstyle',
//   storage: AsyncStorage,
//   whitelist: ['autn'],
// };

// const persistedReducer = persistReducer(persistConfig, reducers);

// export const store = configureStore({
//   reducer: persistedReducer,

//   middleware: getDefaultMiddleware =>
//     getDefaultMiddleware({serializableCheck: false, thunk: false}).concat(
//       middlewares,
//     ),
// });

// export const persistor = persistStore(store);

// export const useAppDispatch = () => useDispatch<AppDispatch>();
// export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// saga.run(rootSaga);
