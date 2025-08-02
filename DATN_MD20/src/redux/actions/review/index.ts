import {createAsyncThunk} from '@reduxjs/toolkit';
import reviewService from '../../../services/review';
import {ReviewCreateType} from '../../../services/review/type';

export const fetchPendingReviewItems = createAsyncThunk(
  'review/pending',
  async (_, {rejectWithValue}) => {
    try {
      return await reviewService.getPendingReviewItems();
    } catch (err) {
      return rejectWithValue(err);
    }
  },
);

export const createReview = createAsyncThunk(
  'review/create',
  async (data: ReviewCreateType, {rejectWithValue}) => {
    try {
      return await reviewService.createReview(data);
    } catch (err) {
      return rejectWithValue(err);
    }
  },
);

export const fetchMyReviews = createAsyncThunk(
  'review/getReview',
  async (_, {rejectWithValue}) => {
    try {
      return await reviewService.getMyReviews();
    } catch (err) {
      return rejectWithValue(err);
    }
  },
);
