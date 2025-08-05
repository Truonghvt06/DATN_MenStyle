import {createAsyncThunk} from '@reduxjs/toolkit';
import cartServicee, {
  CartItemPayload,
  RemoveItem,
} from '../../../services/cart/cartService';

// Helper để normalize lỗi
const extractErrorMessage = (error: any, fallback: string) => {
  return error?.response?.data?.message || error?.message || fallback;
};

export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, {rejectWithValue}) => {
    try {
      const cart = await cartServicee.getCart();
      return cart; // trả về toàn bộ giỏ
    } catch (error: any) {
      const message = extractErrorMessage(error, 'Lỗi khi lấy giỏ hàng');
      return rejectWithValue(message);
    }
  },
);

export const addCart = createAsyncThunk(
  'cart/addCart',
  async (
    {productId, variantIndex, quantity = 1}: CartItemPayload,
    {rejectWithValue},
  ) => {
    try {
      const cart = await cartServicee.addToCart({
        productId,
        variantIndex,
        quantity,
      });
      return cart;
    } catch (error: any) {
      const message = extractErrorMessage(error, 'Lỗi khi thêm vào giỏ');
      return rejectWithValue(message);
    }
  },
);

export const updateCart = createAsyncThunk(
  'cart/updateCart',
  async (
    {productId, variantIndex, quantity = 1}: CartItemPayload,
    {rejectWithValue},
  ) => {
    try {
      const cart = await cartServicee.updateCartItem({
        productId,
        variantIndex,
        quantity,
      });
      return cart;
    } catch (error: any) {
      const message = extractErrorMessage(error, 'Lỗi khi cập nhật giỏ');
      return rejectWithValue(message);
    }
  },
);

export const removeCart = createAsyncThunk(
  'cart/removeCart',
  async (items: RemoveItem[], {rejectWithValue}) => {
    try {
      const cart = await cartServicee.removeCartItems(items);
      return cart;
    } catch (error: any) {
      const message = extractErrorMessage(error, 'Lỗi khi xóa khỏi giỏ');
      return rejectWithValue(message);
    }
  },
);
