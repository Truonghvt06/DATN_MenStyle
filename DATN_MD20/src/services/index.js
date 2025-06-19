import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000', // Địa chỉ của server backend
  timeout: 10000, // Thời gian chờ tối đa cho mỗi yêu cầu
});

export {axiosInstance};
