import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import cartService from '../../services/cart';
import {
  addToCart,
  fetchCart,
  removeFromCart,
  updateCart,
} from '../actions/cart';

interface CartState {
  items: any[];
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCart: state => {
      state.items = [];
      state.error = null;
      state.loading = false;
    },
  },
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
  // extraReducers: builder => {
  //   builder
  //     // fetchCart
  //     .addCase(fetchCart.pending, state => {
  //       state.loading = true;
  //       state.error = null;
  //     })
  //     .addCase(fetchCart.fulfilled, (state, action) => {
  //       state.loading = false;
  //       state.items = action.payload?.cart || [];
  //     })
  //     .addCase(fetchCart.rejected, (state, action) => {
  //       state.loading = false;
  //       state.error = action.payload as string;
  //     })

  //     // addToCart
  //     .addCase(addToCart.pending, state => {
  //       state.error = null;
  //     })
  //     .addCase(addToCart.fulfilled, (state, action) => {
  //       // nếu backend trả về cart mới thì cập nhật luôn, nếu không thì giữ nguyên và frontend nên gọi fetchCart
  //       if (action.payload?.cart) {
  //         state.items = action.payload.cart;
  //       }
  //     })
  //     .addCase(addToCart.rejected, (state, action) => {
  //       state.error = action.payload as string;
  //     })

  //     // updateCart
  //     .addCase(updateCart.fulfilled, (state, action) => {
  //       if (action.payload?.cart) {
  //         state.items = action.payload.cart;
  //       }
  //     })
  //     .addCase(updateCart.rejected, (state, action) => {
  //       state.error = action.payload as string;
  //     })

  //     // removeFromCart
  //     .addCase(removeFromCart.fulfilled, (state, action) => {
  //       if (action.payload?.cart) {
  //         state.items = action.payload.cart;
  //       }
  //     })
  //     .addCase(removeFromCart.rejected, (state, action) => {
  //       state.error = action.payload as string;
  //     });
  // },
});

export const {clearCart} = cartSlice.actions;
export default cartSlice.reducer;
