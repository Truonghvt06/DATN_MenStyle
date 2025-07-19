import {axiosInstance} from '..';

const notificationService = {
  getNotifications: async () => {
    try {
      const res = await axiosInstance.get('/notification');
      return res.data.notifications; // Trả về mảng thông báo
    } catch (err: any) {
      throw err.response?.data || {message: 'Lỗi khi lấy danh sách thông báo'};
    }
  },
  markAsRead: async (notificationId: string) => {
    try {
      const res = await axiosInstance.patch(
        `/notification/update-isread/${notificationId}`,
      );
      return res.data; // Trả về thông báo đã được đánh dấu là đã đọc
    } catch (err: any) {
      throw (
        err.response?.data || {message: 'Lỗi khi đánh dấu thông báo là đã đọc'}
      );
    }
  },
};

export default notificationService;
