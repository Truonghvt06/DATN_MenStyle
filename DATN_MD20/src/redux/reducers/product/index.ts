// redux/slices/productSlice.js
import {createSlice} from '@reduxjs/toolkit';
import {
  fetchAllProducts,
  fetchProductsByCategory,
  fetchProductsByCategorySort,
  fetchBestSellerProducts,
  fetchNewestProducts,
  fetchProductDetail,
  fetchProducts,
  fetchCategory,
} from '../../actions/product';
import {ProductState} from './type';

const initialState: ProductState = {
  products: [], //list sản phẩm
  productCate: [], //list sản phẩn theo thể loại
  categories: [], //list thể loại
  total: 0,
  page: 1,
  limit: 10,
  detail: null, // sản phẩm hiện chi tiết
  relatedProducts: [], // sản phẩm gợi ý ở detail
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
    clearProCate: state => {
      state.productCate = [];
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchCategory.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategory.fulfilled, (state, action) => {
        state.categories = action.payload;
        state.loading = false;
      })
      .addCase(fetchCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message as string | null;
      })
      .addCase(fetchProducts.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.data;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string | null;
      })
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

      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.productCate = action.payload;
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

export const {clearProductDetail, clearProCate} = productSlice.actions;
export default productSlice.reducer;
