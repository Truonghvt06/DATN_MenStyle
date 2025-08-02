import {axiosInstance} from '../index';

interface AddToCartPayload {
  productId: string;
  variantIndex: number;
  quantity?: number;
}

const cartService = {
  // Lấy giỏ hàng của user
  getCart: async (userId: string) => {
    const res = await axiosInstance.get(`/accounts/api/cart/${userId}`);
    console.log('=== BACKEND API DEBUG ===');
    console.log('User ID:', userId);
    console.log('API Response:', JSON.stringify(res.data, null, 2));
    return res.data;
  },
  // Thêm sản phẩm vào giỏ hàng (theo biến thể)
  // addToCart: async (userId: string, productId: string, variantIndex: number) => {
  //   const res = await axiosInstance.post(`/accounts/${userId}/cart/add-variant`, {
  //     productId,
  //     variantIndex,
  //   });
  //   return res.data;
  // },
  addToCart: async (
    userId: string,
    productId: string,
    variantIndex: number,
    quantity: number = 1,
  ) => {
    try {
      const payload: AddToCartPayload = {
        productId,
        variantIndex,
        quantity,
      };
      const res = await axiosInstance.post(
        `/accounts/${userId}/cart/add-variant`,
        payload,
      );
      return res.data;
    } catch (err: any) {
      const message =
        err?.response?.data?.message || 'Lỗi khi thêm vào giỏ hàng';
      throw new Error(message);
    }
  },

  // Cập nhật số lượng sản phẩm trong giỏ hàng
  updateCart: async (userId: string, action: string) => {
    // action: 'increase-0' hoặc 'decrease-0' (0 là index trong mảng cart)
    const res = await axiosInstance.post(
      `/accounts/${userId}/cart/update-all`,
      {
        action,
      },
    );
    return res.data;
  },
  // Xóa sản phẩm khỏi giỏ hàng
  removeFromCart: async (userId: string, index: number) => {
    const res = await axiosInstance.post(
      `/accounts/${userId}/cart/remove-item`,
      {
        index,
      },
    );
    return res.data;
  },
};

export default cartService;
