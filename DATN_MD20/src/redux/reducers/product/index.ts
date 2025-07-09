// redux/slices/productSlice.js
import {createSlice} from '@reduxjs/toolkit';
import {
  fetchAllProducts,
  fetchProductsByCategory,
  fetchProductsByCategorySort,
  fetchBestSellerProducts,
  fetchNewestProducts,
  fetchProductDetail,
} from '../../actions/product';
import {ProductState} from './type';

const initialState: ProductState = {
  products: [],
  total: 0,
  page: 1,
  limit: 10,
  detail: null,
  relatedProducts: [],
  loading: false,
  error: null,
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearProductDetail: state => {
      state.detail = null;
      state.relatedProducts = [];
    },
  },
  extraReducers: builder => {
    builder
      // Get all
      .addCase(fetchAllProducts.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.data;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string | null;
      })

      // Similar blocks for each case below
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.data;
        // state.total = action.payload.total;
        // state.page = action.payload.page;
        // state.limit = action.payload.limit;
      })
      .addCase(fetchProductsByCategorySort.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.data;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
      })

      .addCase(fetchBestSellerProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })

      .addCase(fetchNewestProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })

      .addCase(fetchProductDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.detail = action.payload.product;
        state.relatedProducts = action.payload.relatedProducts;
      });
  },
});

export const {clearProductDetail} = productSlice.actions;
export default productSlice.reducer;
