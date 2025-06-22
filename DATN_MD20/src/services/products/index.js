import {axiosInstance} from '..';

const getProducts = async () => {
  try {
    const data = await axiosInstance.get('/products');
    return data;
  } catch (error) {
    throw error;
  }
};

export default {getProducts};
