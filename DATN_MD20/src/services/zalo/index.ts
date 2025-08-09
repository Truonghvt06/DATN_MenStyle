import {axiosInstance} from '..';

interface Create {
  amount: number;
  order_id: string;
  order_code: string;
  description?: string;
}

const zaloService = {
  createZaloPayOrder: async ({
    amount,
    order_id,
    order_code,
    description,
  }: Create) => {
    try {
      const res = await axiosInstance.post('/zalo/create', {
        amount,
        order_id,
        order_code,
        description: description || 'Thanh toán đơn hàng MenStyle',
      });
      return res.data;
    } catch (error) {
      throw error;
    }
  },
};

export default zaloService;
