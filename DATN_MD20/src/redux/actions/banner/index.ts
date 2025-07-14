import {createAsyncThunk} from '@reduxjs/toolkit';
import bannerService from '../../../services/banner';

export const fetchBanner = createAsyncThunk(
  'banner/fetchBanner',
  async (_, thunkAPI) => {
    try {
      const res = bannerService.getBanner();
      //   console.log('BANNER: ', res);

      return res;
    } catch (error) {
      thunkAPI.rejectWithValue(error);
    }
  },
);
