import {persistReducer, persistStore} from 'redux-persist';
import {configureStore} from '@reduxjs/toolkit';
import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import reducers from '../reducers';

// ✅ Cấu hình redux-persist
const persistConfig = {
  key: 'men_style',
  storage: AsyncStorage,
  whitelist: ['autn', 'application', 'theme'],
};

// ✅ Kết hợp persist reducer
const persistedReducer = persistReducer(persistConfig, reducers);

// ✅ Tạo Redux store
const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// ✅ Persistor để dùng với PersistGate
const persistor = persistStore(store);

// ✅ Export sau khi store được tạo
export {store, persistor};

// ✅ Type & custom hooks
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
