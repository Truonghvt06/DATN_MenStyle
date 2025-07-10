import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {store} from '../redux/store';
import {logout} from '../redux/reducers/auth';

export const axiosInstance = axios.create({
  // baseURL: 'http://192.168.1.17:3000', // hoặc domain chính thức
  baseURL: 'https://datn-menstyle-4jp1.onrender.com',
  timeout: 30000,
});

// Gắn token vào request
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

//  Nếu token hết hạn sẽ logout
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Token hết hạn  dispatch logout
      store.dispatch(logout());
    }
    return Promise.reject(error);
  },
);
