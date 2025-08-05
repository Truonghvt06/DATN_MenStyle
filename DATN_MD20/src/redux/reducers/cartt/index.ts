import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {
  addCart,
  fetchCart,
  removeCart,
  updateCart,
} from '../../actions/cart/cartAction';

// export interface CartItem {
//   productId: string;
//   variantIndex: number;
//   variant_id?: string;
//   quantity: number;
// }

interface CartState {
  listCart: any[];
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  listCart: [],
  loading: false,
  error: null,
};

const cartSlicee = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // nếu cần các action sync thêm có thể mở rộng ở đây
    clearCartError(state) {
      state.error = null;
    },
    resetCartState(state) {
      state.listCart = [];
      state.error = null;
    },
  },
  extraReducers: builder => {
    // fetchCart
    builder
      .addCase(fetchCart.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.loading = false;
        state.listCart = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // addCart
    builder
      .addCase(addCart.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCart.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.loading = false;
        state.listCart = action.payload;
      })
      .addCase(addCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // updateCart
    builder

      .addCase(updateCart.fulfilled, (state, action: PayloadAction<any[]>) => {
        // state.loading = false;
        // state.listCart = action.payload;
      })
      .addCase(updateCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // removeCart
    builder

      .addCase(removeCart.fulfilled, (state, action: PayloadAction<any[]>) => {
        // state.loading = false;
        // state.listCart = action.payload;
      })
      .addCase(removeCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {clearCartError, resetCartState} = cartSlicee.actions;

export default cartSlicee.reducer;
