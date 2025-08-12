import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {
  fetchAvailableVouchers,
  fetchVouchers,
  useVoucherAction,
} from '../../actions/voucher';
import {Voucher} from '../../../services/voucher';

interface VoucherState {
  vouchers: Voucher[];
  total: number;
  page: number;
  limit: number;
  loading: boolean;
  error: string | null;
  refreshing: boolean;

  availableVouchers: Voucher[];
  availableTotal: number;
  usedVoucher?: Voucher | null;
}

const initialState: VoucherState = {
  vouchers: [],
  total: 0,
  page: 1,
  limit: 20,
  loading: false,
  error: null,
  refreshing: false,

  availableVouchers: [],
  availableTotal: 0,
  usedVoucher: null,
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
    clearAvailableVouchers: state => {
      state.availableVouchers = [];
      state.availableTotal = 0;
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
      })

      // fetchAvailableVouchers
      .addCase(fetchAvailableVouchers.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAvailableVouchers.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.availableVouchers = action.payload.vouchers || [];
          state.availableTotal = action.payload.total || 0;
          state.error = null;
        },
      )
      .addCase(fetchAvailableVouchers.rejected, (state, action: any) => {
        state.loading = false;
        state.error =
          typeof action.payload === 'string'
            ? action.payload
            : action.error?.message || 'Lỗi khi lấy voucher khả dụng';
      })

      //useVoucher
      .addCase(useVoucherAction.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        useVoucherAction.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.usedVoucher = action.payload?.voucher || null;
          state.error = null;
        },
      )
      .addCase(useVoucherAction.rejected, (state, action: any) => {
        state.loading = false;
        state.error =
          typeof action.payload === 'string'
            ? action.payload
            : action.error?.message || 'Lỗi khi áp dụng voucher';
      });
  },
});

export const {clearVouchers} = voucherSlice.actions;
export default voucherSlice.reducer;
