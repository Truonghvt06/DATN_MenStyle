import {createAsyncThunk} from '@reduxjs/toolkit';
import orderService, {CreateOrderPayload} from '../../../services/orders';

export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (data: CreateOrderPayload, {rejectWithValue}) => {
    try {
      const response = await orderService.createOrder(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Tạo đơn hàng thất bại');
    }
  },
);

export const getOrders = createAsyncThunk(
  'order/getOrders',
  async (_, {rejectWithValue}) => {
    try {
      const orders = await orderService.getOrders();
      return orders;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Lỗi khi lấy danh sách đơn hàng');
    }
  },
);

export const getOrderDetail = createAsyncThunk(
  'order/getOrderDetail',
  async (orderId: string, {rejectWithValue}) => {
    try {
      const order = await orderService.getOrderDetail(orderId);
      return order;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Lỗi khi lấy chi tiết đơn hàng');
    }
  },
);

export const putCancelOrder = createAsyncThunk(
  'order/cancelOrder',
  async (
    {orderId, reason}: {orderId: string; reason: string},
    {rejectWithValue},
  ) => {
    try {
      const order = await orderService.cancelOrder({orderId, reason});
      return order;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || 'Lỗi khi huỷ đơn hàng',
      );
    }
  },
);

//MUA LAI
export const buyAgain = createAsyncThunk(
  'order/buyAgain',
  async (orderId: string, {rejectWithValue}) => {
    try {
      const response = await orderService.buyAgain(orderId);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || 'Lỗi khi mua lại đơn hàng',
      );
    }
  },
);
