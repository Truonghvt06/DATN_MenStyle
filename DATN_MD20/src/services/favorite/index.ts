import {axiosInstance} from '..';

const favoriteService = {
  toggleFavoriteAPI: async (productId: string) => {
    try {
      const res = await axiosInstance.post('/accounts/favorite/toggle', {
        productId,
      });
      return res.data;
    } catch (err: any) {
      throw err.response?.data || {message: 'Lỗi khi toggle yêu thích'};
    }
  },

  getFavoritesAPI: async () => {
    try {
      const res = await axiosInstance.get('/accounts/favorite');
      return res.data.favorites; // Trả về mảng product object (đã populate)
    } catch (err: any) {
      throw err.response?.data || {message: 'Lỗi khi lấy danh sách yêu thích'};
    }
  },
  deleteFavoriteAPI: async (productId: string) => {
    try {
      const res = await axiosInstance.delete(
        `/accounts/favorite/delete/${productId}`,
      );
      return res.data;
    } catch (err: any) {
      throw err.response?.data || {message: 'Lỗi khi xoá tất yêu thích'};
    }
  },

  clearFavoritesAPI: async () => {
    try {
      const res = await axiosInstance.delete('/accounts/favorite/delete-all');
      return res.data;
    } catch (err: any) {
      throw err.response?.data || {message: 'Lỗi khi xoá  yêu thích'};
    }
  },
};

export default favoriteService;
