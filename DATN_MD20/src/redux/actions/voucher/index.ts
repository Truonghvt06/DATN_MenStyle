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

export const fetchAvailableVouchers = createAsyncThunk(
  'voucher/fetchAvailableVouchers',
  async (_, {rejectWithValue}) => {
    try {
      const data = await voucherService.getAvailableVouchers();
      // Giả sử backend trả về { success, total, vouchers }
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error?.message || 'Lỗi khi lấy danh sách voucher khả dụng',
      );
    }
  },
);

export const useVoucherAction = createAsyncThunk(
  'voucher/useVoucher',
  async (
    {voucherId, orderId}: {voucherId: string; orderId: string},
    {rejectWithValue},
  ) => {
    try {
      const data = await voucherService.useVoucher(voucherId, orderId);
      return data; // { success, message, voucher }
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Lỗi khi sử dụng voucher');
    }
  },
);
