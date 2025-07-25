import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {store} from '../redux/store';
import {logout} from '../redux/reducers/auth';

export const axiosInstance = axios.create({
  baseURL: 'http://172.20.10.7:3000', // hoặc domain chính thức
  // baseURL: 'https://datn-menstyle-4jp1.onrender.com',
  timeout: 30000,
});

axiosInstance.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  response => response,
  error => {
    const originalRequest = error.config;

    const is401 = error?.response?.status === 401;
    const isChangePasswordAPI = originalRequest?.url?.includes(
      '/accounts/verify-password',
    );

    // Nếu là 401 và không phải từ change-password thì logout
    if (is401 && !isChangePasswordAPI) {
      store.dispatch(logout());
    }

    return Promise.reject(error);
  },
);
