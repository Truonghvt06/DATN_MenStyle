import {axiosInstance} from '..';

const paymentMethodService = {
  getAllPaymentMethods: async () => {
    try {
      const res = await axiosInstance.get('/payment-method');
      // console.log('PAYMENT: ', res.data);

      return res.data;
    } catch (error: any) {
      throw error?.response?.data || {message: 'Lỗi khi lấy phương thức'};
    }
  },
};

export default paymentMethodService;
