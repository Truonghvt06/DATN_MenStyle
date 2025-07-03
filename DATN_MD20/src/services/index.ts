import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {store} from '../redux/store';
import {logout} from '../redux/reducers/auth';

export const axiosInstance = axios.create({
  baseURL: 'http://192.168.1.7:3000', // hoặc domain chính thức
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
