// services/productService.js

import {axiosInstance} from '..';

const productService = {
  getProducts: async () => {
    try {
      const data = await axiosInstance.get('/products');
      return data;
    } catch (error) {
      throw error;
    }
  },
  getAllProducts: async (page = 1, limit = 10) => {
    try {
      const res = await axiosInstance.get(
        `/products/product-all?page=${page}&limit=${limit}`,
      );
      console.log('DATA: ', res.data);

      return res.data;
    } catch (error) {
      throw error;
    }
  },

  getProductsByCategory: async (type: string) => {
    try {
      const res = await axiosInstance.get(`/products/product-category/${type}`);
      return res.data;
    } catch (error) {
      throw error;
    }
  },

  getProductsByCategorySort: async (
    type: string,
    sort = 'new',
    page = 1,
    limit = 12,
  ) => {
    try {
      const res = await axiosInstance.get(
        `/products/product-category/${type}?sort=${sort}&page=${page}&limit=${limit}`,
      );
      return res.data;
    } catch (error) {
      throw error;
    }
  },

  getBestSellerProducts: async (limit = 10) => {
    try {
      const res = await axiosInstance.get(
        `/products/best-seller?limit=${limit}`,
      );
      return res.data;
    } catch (error) {
      throw error;
    }
  },

  getNewestProducts: async (limit = 10) => {
    try {
      const res = await axiosInstance.get(
        `/products/product-new?limit=${limit}`,
      );
      return res.data;
    } catch (error) {
      throw error;
    }
  },

  getProductDetail: async (id: string) => {
    try {
      const res = await axiosInstance.get(`/products/product-detail/${id}`);
      return res.data;
    } catch (error) {
      throw error;
    }
  },
};

export default productService;
