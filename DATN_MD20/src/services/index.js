import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// Tạo một instance
const axiosInstance = axios.create({
  baseURL: 'http://192.168.0.103:3000', // hoặc localhost nếu dùng trong cùng thiết bị
  timeout: 30000,
});

// ✅ Thêm interceptor để tự động gắn token vào header Authorization
axiosInstance.interceptors.request.use(
  async config => {
    const token = await getToken(); // Hàm lấy token từ AsyncStorage (React Native) hoặc localStorage (Web)

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  error => Promise.reject(error),
);

// 👉 Hàm lấy token từ AsyncStorage (React Native)
const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    return token;
  } catch (err) {
    console.log('Lỗi lấy token:', err);
    return null;
  }
};

export {axiosInstance};
