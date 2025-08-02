import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {fetchVouchers} from '../../actions/voucher';
import {Voucher} from '../../../services/voucher';

interface VoucherState {
  vouchers: Voucher[];
  total: number;
  page: number;
  limit: number;
  loading: boolean;
  error: string | null;
  refreshing: boolean;
}

const initialState: VoucherState = {
  vouchers: [],
  total: 0,
  page: 1,
  limit: 20,
  loading: false,
  error: null,
  refreshing: false,
};

const voucherSlice = createSlice({
  name: 'voucher',
  initialState,
  reducers: {
    clearVouchers: state => {
      state.vouchers = [];
      state.total = 0;
      state.page = 1;
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchVouchers.pending, (state, action) => {
        const incomingPage = action.meta.arg.page ?? 1;
        if (incomingPage === 1) {
          state.loading = true;
          state.refreshing = true;
          state.error = null;
        } else {
          // load more
          state.loading = true;
        }
      })
      .addCase(fetchVouchers.fulfilled, (state, action: PayloadAction<any>) => {
        const {vouchers, total, page, limit} = action.payload;
        if (page === 1) {
          state.vouchers = vouchers;
        } else {
          // append, tránh trùng nếu cần
          state.vouchers = [...state.vouchers, ...vouchers];
        }
        state.total = total;
        state.page = page;
        state.limit = limit;
        state.loading = false;
        state.refreshing = false;
        state.error = null;
      })
      .addCase(fetchVouchers.rejected, (state, action: any) => {
        state.loading = false;
        state.refreshing = false;
        state.error =
          typeof action.payload === 'string'
            ? action.payload
            : action.error?.message || 'Lỗi khi lấy voucher';
      });
  },
});

export const {clearVouchers} = voucherSlice.actions;
export default voucherSlice.reducer;
