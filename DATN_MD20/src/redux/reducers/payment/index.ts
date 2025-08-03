import {createSlice} from '@reduxjs/toolkit';
import {fetchPaymentMethods} from '../../actions/payment';

interface PaymentMethod {
  _id: string;
  code: string;
  name: string;
  description?: string;
  image?: string;
}

interface PaymentMethodState {
  listPaymentMethod: PaymentMethod[];
  loading: boolean;
  error: any;
}

const initialState: PaymentMethodState = {
  listPaymentMethod: [],
  loading: false,
  error: null,
};

const paymentMethodSlice = createSlice({
  name: 'paymentMethod',
  initialState,
  reducers: {},
  extraReducers: builder => {
    // Get all
    builder
      .addCase(fetchPaymentMethods.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPaymentMethods.fulfilled, (state, action) => {
        state.loading = false;
        state.listPaymentMethod = action.payload;
      })
      .addCase(fetchPaymentMethods.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default paymentMethodSlice.reducer;
