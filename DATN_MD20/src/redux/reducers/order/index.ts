import {createSlice} from '@reduxjs/toolkit';
import {OrderState} from '../../../services/orders';
import {
  createOrder,
  getOrders,
  getOrderDetail,
  putCancelOrder,
} from '../../actions/order';

const initialState: OrderState = {
  loading: false,
  order: null,
  error: null,
  orders: [],
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    resetOrder: state => {
      state.loading = false;
      state.order = null;
      state.orders = [];
      state.error = null;
    },
    clearOrderDetail: state => {
      state.order = null;
    },
  },
  extraReducers: builder => {
    builder
      // Create Order
      .addCase(createOrder.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
        state.error = null;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Get Orders
      .addCase(getOrders.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Get Order Detail
      .addCase(getOrderDetail.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrderDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
      })
      .addCase(getOrderDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      //cancelOrrder
      .addCase(putCancelOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
      });
  },
});

export const {resetOrder, clearOrderDetail} = orderSlice.actions;
export default orderSlice.reducer;
