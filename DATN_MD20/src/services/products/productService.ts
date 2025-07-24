import { axiosInstance } from '..';

const productService = {
  getCategory: async () => {
    try {
      const res = await axiosInstance.get('/products/categories');
      return res.data;
    } catch (error) {
      throw error;
    }
  },

  getProducts: async () => {
    try {
      const res = await axiosInstance.get(`/products/sp`);
      return res.data;
    } catch (error) {
      throw error;
    }
  },

  getAllProducts: async (page = 1, limit = 10) => {
    try {
      const res = await axiosInstance.get(
        `/products/product-all?page=${page}&limit=${limit}`,
      );
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
      console.log('[API] Product Detail response:', res.data.product);
      return res.data;
    } catch (error) {
      throw error;
    }
  },

  searchProducts: async (name: string) => {
  try {
    const res = await axiosInstance.get(
      `/products/search?name=${encodeURIComponent(name)}`
    );
    console.log('[📦 API] searchProducts response:', res.data); // res.data là array
    return res.data;
  } catch (error) {
    throw error;
  }
},

};

export default productService;
