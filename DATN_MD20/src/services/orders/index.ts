import { axiosInstance } from '../index';

const orderService = {
  createOrder: async (orderData: any) => {
    const res = await axiosInstance.post('/accounts/api/orders', orderData);
    return res.data;
  },
};

export default orderService;
