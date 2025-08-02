import {createSlice} from '@reduxjs/toolkit';
import {
  fetchPendingReviewItems,
  createReview,
  fetchMyReviews,
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
      .addCase(fetchMyReviews.fulfilled, (state, action) => {
        state.myReviews = action.payload;
      })

      // Create review
      .addCase(createReview.fulfilled, (state, action) => {
        state.myReviews.unshift(action.payload); // Thêm review mới vào đầu
        state.pending = state.pending.filter(
          item =>
            !(
              item.product_id === action.payload.product_id &&
              item.product_variant_id === action.payload.product_variant_id &&
              item.order_id === action.payload.order_id
            ),
        );
      });
  },
});

export default reviewSlice.reducer;
