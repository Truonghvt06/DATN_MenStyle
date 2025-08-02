import {createAsyncThunk} from '@reduxjs/toolkit';
import {
  voucherService,
  GetActiveVouchersParams,
} from '../../../services/voucher';

export const fetchVouchers = createAsyncThunk(
  'voucher/fetchVouchers',
  async (params: GetActiveVouchersParams, {rejectWithValue}) => {
    try {
      const data = await voucherService.getActiveVouchersAPI(params);
      // chuẩn hoá tùy response backend
      return {
        vouchers: data.data?.vouchers ?? [],
        total: data.data?.total ?? 0,
        page: data.data?.page ?? params.page ?? 1,
        limit: data.data?.limit ?? params.limit ?? 20,
      };
    } catch (error: any) {
      return rejectWithValue(error);
    }
  },
);
