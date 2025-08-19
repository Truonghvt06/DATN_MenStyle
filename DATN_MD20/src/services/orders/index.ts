import {axiosInstance} from '../index';

export interface OrderItem {
  product_id: string;
  product_variant_id: string;
  price: number;
  quantity: number;
}

export interface VoucherCode {
  code_order?: string;
  order_discount?: number;
  code_shipping?: string;
  shipping_discount?: number;
}

export interface CreateOrderPayload {
  user_id?: string; // nếu dùng token thì không cần
  total_amount: number;
  shipping_address_id: string;
  payment_method_id: string;
  items: OrderItem[];
  voucher_code?: VoucherCode; // thêm voucher_code
}

export interface OrderState {
  loading: boolean;
  order: any | null;
  orders?: any[]; // danh sách đơn hàng
  error: string | null;
}

const orderService = {
  createOrder: async (data: CreateOrderPayload) => {
    try {
      const response = await axiosInstance.post('/order/add-order', data);
      return response.data;
    } catch (error: any) {
      console.error(
        'Lỗi khi tạo đơn hàng:',
        error?.response?.data || error.message,
      );
      throw error?.response?.data || error;
    }
  },
  getOrders: async () => {
    try {
      const response = await axiosInstance.get('/order/my-orders');
      return response.data.orders;
    } catch (error: any) {
      console.error(
        'Lỗi khi lấy danh sách đơn hàng:',
        error?.response?.data || error.message,
      );
      throw error?.response?.data || error;
    }
  },

  getOrderDetail: async (orderId: string) => {
    try {
      const response = await axiosInstance.get(
        `/order/order-detail/${orderId}`,
      );
      return response.data.order;
    } catch (error: any) {
      console.error(
        'Lỗi khi lấy chi tiết đơn hàng:',
        error?.response?.data || error.message,
      );
      throw error?.response?.data || error;
    }
  },
  cancelOrder: async ({orderId, reason}: {orderId: string; reason: string}) => {
    try {
      const response = await axiosInstance.put(
        `/order/cancelOrder/${orderId}`,
        {reason},
      );
      return response.data.order;
    } catch (error: any) {
      console.error(
        'Lỗi khi huỷ đơn hàng:',
        error?.response?.data || error.message,
      );
      throw error?.response?.data || error;
    }
  },

  buyAgain: async (order_id: string) => {
    try {
      const response = await axiosInstance.post('/order/buyAgain', {order_id});
      return response.data;
    } catch (error: any) {
      console.error(
        'Lỗi khi mua lại đơn hàng:',
        error?.response?.data || error.message,
      );
      throw error?.response?.data || error;
    }
  },
};

export default orderService;
