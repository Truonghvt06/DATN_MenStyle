import {createSlice} from '@reduxjs/toolkit';
import {
  fetchPendingReviewItems,
  createReview,
  fetchMyReviews,
  fetchReviewsByProduct,
} from '../../actions/review';

interface ReviewState {
  pending: any[];
  myReviews: any[];
  loading: boolean;
  error: string | null;
}

const initialState: ReviewState = {
  pending: [],
  myReviews: [],
  loading: false,
  error: null,
};

const reviewSlice = createSlice({
  name: 'review',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      // Pending reviews
      .addCase(fetchPendingReviewItems.pending, state => {
        state.loading = true;
      })
      .addCase(fetchPendingReviewItems.fulfilled, (state, action) => {
        state.loading = false;
        state.pending = action.payload;
      })
      .addCase(fetchPendingReviewItems.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      // My reviews
      .addCase(fetchMyReviews.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(fetchMyReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.myReviews = action.payload;
      })
      .addCase(fetchMyReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Reviews by product
      .addCase(fetchReviewsByProduct.pending, state => {
        state.loading = true;
      })
      .addCase(fetchReviewsByProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.myReviews = action.payload;
      })
      .addCase(fetchReviewsByProduct.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      // Create review
      .addCase(createReview.fulfilled, (state, action) => {
        const newReview = action.payload; // backend trả về review mới

        // 1. Xóa item khỏi pending (theo order_id + product_id + variant)
        state.pending = state.pending.filter(
          item =>
            !(
              item.order_id === newReview.order_id &&
              item.product_id === newReview.product_id &&
              item.product_variant_id === newReview.product_variant_id
            ),
        );

        // 2. Thêm vào myReviews (nếu muốn hiển thị ngay)
        state.myReviews.unshift(newReview);
      });
  },
});

export default reviewSlice.reducer;
