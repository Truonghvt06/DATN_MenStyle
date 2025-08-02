import {createAsyncThunk} from '@reduxjs/toolkit';
import cartService from '../../../services/cart';

export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (userId: string, {rejectWithValue}) => {
    try {
      const data = await cartService.getCart(userId);
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Lỗi khi lấy giỏ hàng');
    }
  },
);

// export const addToCart = createAsyncThunk(
//   'cart/addToCart',
//   async (
//     {
//       userId,
//       productId,
//       variantIndex,
//     }: {userId: string; productId: string; variantIndex: number},
//     {rejectWithValue},
//   ) => {
//     try {
//       const data = await cartService.addToCart(userId, productId, variantIndex);
//       return data;
//     } catch (err: any) {
//       return rejectWithValue(err.message || 'Lỗi khi thêm vào giỏ hàng');
//     }
//   },
// );
export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (
    {
      userId,
      productId,
      variantIndex,
      quantity = 1,
    }: {
      userId: string;
      productId: string;
      variantIndex: number;
      quantity?: number;
    },
    thunkAPI,
  ) => {
    try {
      const data = await cartService.addToCart(
        userId,
        productId,
        variantIndex,
        quantity,
      );
      // Sau khi thêm, có thể fetch lại cart hoặc trả về cart mới
      return data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.message || 'Lỗi khi thêm vào giỏ hàng',
      );
    }
  },
);

export const updateCart = createAsyncThunk(
  'cart/updateCart',
  async (
    {userId, action}: {userId: string; action: string},
    {rejectWithValue},
  ) => {
    try {
      const data = await cartService.updateCart(userId, action);
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Lỗi khi cập nhật giỏ hàng');
    }
  },
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (
    {userId, index}: {userId: string; index: number},
    {rejectWithValue},
  ) => {
    try {
      const data = await cartService.removeFromCart(userId, index);
      return data;
    } catch (err: any) {
      return rejectWithValue(
        err.message || 'Lỗi khi xóa sản phẩm khỏi giỏ hàng',
      );
    }
  },
);
