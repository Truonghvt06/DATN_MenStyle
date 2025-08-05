import {axiosInstance} from '..';

export interface CartItemPayload {
  productId: string;
  variantIndex: number;
  quantity?: number;
}

export interface RemoveItem {
  productId: string;
  variantIndex: number;
}

const cartServicee = {
  getCart: async () => {
    try {
      const res = await axiosInstance.get('/cart');
      return res.data.cart; // giả sử API trả { cart: [...] }
    } catch (err: any) {
      // Normalize error
      const message =
        err.response?.data?.message || err.message || 'Lỗi khi lấy giỏ hàng';
      throw new Error(message);
    }
  },

  addToCart: async ({
    productId,
    variantIndex,
    quantity = 1,
  }: CartItemPayload) => {
    try {
      const res = await axiosInstance.post('/cart/add', {
        productId,
        variantIndex,
        quantity,
      });
      return res.data.cart;
    } catch (err: any) {
      const message =
        err.response?.data?.message || err.message || 'Lỗi khi thêm vào giỏ';
      throw new Error(message);
    }
  },

  updateCartItem: async ({
    productId,
    variantIndex,
    quantity,
  }: CartItemPayload) => {
    try {
      const res = await axiosInstance.patch('/cart/item', {
        productId,
        variantIndex,
        quantity,
      });
      return res.data.cart;
    } catch (err: any) {
      const message =
        err.response?.data?.message || err.message || 'Lỗi khi cập nhật giỏ';
      throw new Error(message);
    }
  },

  removeCartItems: async (items: RemoveItem[]) => {
    try {
      const res = await axiosInstance.delete('/cart/remove', {
        data: {items},
      });
      return res.data.cart;
    } catch (err: any) {
      const message =
        err.response?.data?.message || err.message || 'Lỗi khi xóa khỏi giỏ';
      throw new Error(message);
    }
  },
};

export default cartServicee;
