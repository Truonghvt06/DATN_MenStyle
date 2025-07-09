// redux/actions/productActions.js
import {createAsyncThunk} from '@reduxjs/toolkit';
import productService from '../../../services/products';

export const fetchAllProducts = createAsyncThunk(
  'products/fetchAll',
  async ({page = 1, limit = 10}: {page?: number; limit?: number}, thunkAPI) => {
    try {
      const res = await productService.getAllProducts(page, limit);

      return res;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Lỗi');
    }
  },
);

export const fetchProductsByCategory = createAsyncThunk(
  'products/fetchByCategory',
  async (type: string, thunkAPI) => {
    try {
      return await productService.getProductsByCategory(type);
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Lỗi');
    }
  },
);

export const fetchProductsByCategorySort = createAsyncThunk(
  'products/fetchByCategorySort',
  async (
    {
      type,
      sort,
      page,
      limit,
    }: {type: string; sort: string; page: number; limit: number},
    thunkAPI,
  ) => {
    try {
      return await productService.getProductsByCategorySort(
        type,
        sort,
        page,
        limit,
      );
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Lỗi');
    }
  },
);

export const fetchBestSellerProducts = createAsyncThunk(
  'products/fetchBestSeller',
  async (limit: number, thunkAPI) => {
    try {
      return await productService.getBestSellerProducts(limit);
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Lỗi');
    }
  },
);

export const fetchNewestProducts = createAsyncThunk(
  'products/fetchNewest',
  async (limit: number, thunkAPI) => {
    try {
      return await productService.getNewestProducts(limit);
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Lỗi');
    }
  },
);

export const fetchProductDetail = createAsyncThunk(
  'products/fetchDetail',
  async (id: string, thunkAPI) => {
    try {
      return await productService.getProductDetail(id);
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Lỗi');
    }
  },
);
