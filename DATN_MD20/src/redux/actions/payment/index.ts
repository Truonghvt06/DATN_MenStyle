import {createAsyncThunk} from '@reduxjs/toolkit';
import paymentMethodService from '../../../services/payment';

// Lấy danh sách
export const fetchPaymentMethods = createAsyncThunk(
  'paymentMethod/fetchAll',
  async (_, {rejectWithValue}) => {
    try {
      const res = await paymentMethodService.getAllPaymentMethods();
      return res;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  },
);
