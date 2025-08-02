import {axiosInstance} from '..';
import {ReviewCreateType} from './type';

const reviewService = {
  getPendingReviewItems: async () => {
    try {
      const res = await axiosInstance.get('/review/reviewable');
      console.log('ABC', res.data.pending);

      return res.data.pending;
    } catch (err: any) {
      throw (
        err.response?.data || {message: 'Lỗi khi lấy danh sách chờ đánh giá'}
      );
    }
  },

  createReview: async (data: ReviewCreateType) => {
    try {
      const res = await axiosInstance.post('/review/add-review', data);
      return res.data.review;
    } catch (err: any) {
      throw err.response?.data || {message: 'Lỗi khi tạo đánh giá'};
    }
  },

  getMyReviews: async () => {
    try {
      const res = await axiosInstance.get('/review');
      console.log('ABC', res.data.reviews);

      return res.data.reviews;
    } catch (err: any) {
      throw err.response?.data || {message: 'Lỗi khi lấy đánh giá của bạn'};
    }
  },
};

export default reviewService;
