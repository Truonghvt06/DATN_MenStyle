import {axiosInstance} from '../index';

export interface OrderItem {
  product_id: string;
  product_variant_id: string;
  price: number;
  quantity: number;
}

export interface CreateOrderPayload {
  user_id?: string; // nếu dùng token thì không cần
  total_amount: number;
  shipping_address_id: string;
  payment_method_id: string;
  items: OrderItem[];
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
      const response = await axiosInstance.get(`/order/my-orders/${orderId}`);
      return response.data.order;
    } catch (error: any) {
      console.error(
        'Lỗi khi lấy chi tiết đơn hàng:',
        error?.response?.data || error.message,
      );
      throw error?.response?.data || error;
    }
  },
};

export default orderService;
