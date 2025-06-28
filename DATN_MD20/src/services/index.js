import axios from 'axios';

const axiosInstance = axios.create({
  // baseURL: 'http://192.168.0.103:3000', // Địa chỉ của server backend

  baseURL: 'http://192.168.1.6:3000', // Địa chỉ của server backend

  timeout: 30000, // Thời gian chờ tối đa cho mỗi yêu cầu
});

export {axiosInstance};
