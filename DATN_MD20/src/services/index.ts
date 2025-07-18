import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {store} from '../redux/store';
import {logout} from '../redux/reducers/auth';

export const axiosInstance = axios.create({
  baseURL: 'http://192.168.111.188:3000', // hoặc domain chính thức
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
    if (error.response?.status === 401) {
      store.dispatch(logout());
    }
    return Promise.reject(error);
  },
);
