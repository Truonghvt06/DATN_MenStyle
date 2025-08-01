import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import cartService from '../../services/cart';

export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (userId: string, { rejectWithValue }) => {
    try {
      const data = await cartService.getCart(userId);
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Lỗi khi lấy giỏ hàng');
    }
  }
);

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (
    { userId, productId, variantIndex }: { userId: string; productId: string; variantIndex: number },
    { rejectWithValue }
  ) => {
    try {
      const data = await cartService.addToCart(userId, productId, variantIndex);
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Lỗi khi thêm vào giỏ hàng');
    }
  }
);

export const updateCart = createAsyncThunk(
  'cart/updateCart',
  async (
    { userId, action }: { userId: string; action: string },
    { rejectWithValue }
  ) => {
    try {
      const data = await cartService.updateCart(userId, action);
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Lỗi khi cập nhật giỏ hàng');
    }
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (
    { userId, index }: { userId: string; index: number },
    { rejectWithValue }
  ) => {
    try {
      const data = await cartService.removeFromCart(userId, index);
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Lỗi khi xóa sản phẩm khỏi giỏ hàng');
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    loading: false,
    error: null,
  } as any,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchCart.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.cart || [];
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        // Sau khi thêm, nên fetch lại cart
      })
      .addCase(updateCart.fulfilled, (state, action) => {
        // Sau khi cập nhật, nên fetch lại cart
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        // Sau khi xóa, nên fetch lại cart
      });
  },
});

export default cartSlice.reducer; 