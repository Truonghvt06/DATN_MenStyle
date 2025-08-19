// import {axiosInstance} from '..'; // điều chỉnh đường dẫn nếu cần

import {axiosInstance} from '..';

export interface GetActiveVouchersParams {
  scope?: 'order' | 'shipping';
  is_public?: boolean;
  page?: number;
  limit?: number;
}
export interface Voucher {
  _id: string;
  title: string;
  code: string;
  image?: string;
  description?: string;
  voucher_scope: 'order' | 'shipping';
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  max_discount_value?: number | null;
  min_order_amount: number;
  quantity: number;
  used_count: number;
  usage_limit_per_user: number;
  applicable_products: string[];
  applicable_category: string[];
  applicable_users: string[];
  is_public: boolean;
  date_from: string;
  date_to: string;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
  // có thể mở rộng: user_used_count nếu map thêm từ frontend
}

export const voucherService = {
  getActiveVouchersAPI: async (params: GetActiveVouchersParams = {}) => {
    try {
      // chuyển boolean thành string nếu cần tùy backend nhận query string
      const query: Record<string, any> = {
        page: params.page ?? 1,
        limit: params.limit ?? 20,
      };
      if (params.scope) query.scope = params.scope;
      if (typeof params.is_public !== 'undefined')
        query.is_public = String(params.is_public);

      const res = await axiosInstance.get('/voucher', {
        params: query,
      });
      return res.data; // giả sử dạng: { success: true, data: { vouchers: [...], total, page, limit } }
    } catch (err: any) {
      throw err.response?.data || {message: 'Lỗi khi lấy voucher'};
    }
  },

  getAvailableVouchers: async () => {
    try {
      const res = await axiosInstance.get('/voucher/available-voucher');
      return res.data;
    } catch (error: any) {
      console.error('voucherService.getAvailableVouchers error:', error);
      throw error?.response?.data || {message: 'Lỗi khi lấy danh sách voucher'};
    }
  },
  useVoucher: async (voucherId: string, orderId: string) => {
    try {
      const res = await axiosInstance.post(`/voucher/update/${voucherId}`, {
        orderId, // gửi orderId trong body
      });
      return res.data; // { success, message, voucher }
    } catch (error: any) {
      console.error('voucherService.useVoucher error:', error);
      throw error?.response?.data || {message: 'Lỗi khi sử dụng voucher'};
    }
  },
};
