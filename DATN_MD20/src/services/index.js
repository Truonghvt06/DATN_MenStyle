import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://192.168.1.16:3000', // Địa chỉ của server backend
  timeout: 30000, // Thời gian chờ tối đa cho mỗi yêu cầu
});

export {axiosInstance};
