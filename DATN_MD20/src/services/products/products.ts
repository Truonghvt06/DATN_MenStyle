import { axiosInstance } from '../index';

const getProducts = () => {
  return axiosInstance.get('/products');
};

const searchByName = (name: string) => {
  const url = `/products/search?name=${encodeURIComponent(name)}`;
  return axiosInstance.get(url);
};

// ✅ Dùng getProducts làm sản phẩm gợi ý mặc định
const getRecommended = () => {
  return axiosInstance.get('/products');
};

export const products = {
  getProducts,
  searchByName,
  getRecommended, // ✅ Bổ sung vào export
};
