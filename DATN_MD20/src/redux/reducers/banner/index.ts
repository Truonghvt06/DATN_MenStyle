import {createSlice} from '@reduxjs/toolkit';
import {fetchBanner} from '../../actions/banner';

interface Banner {
  title: string;
  image: string;
}
interface BannerState {
  listBanner: Banner[];
  loading: boolean;
  error: string | null;
}

const initialState: BannerState = {
  listBanner: [],
  loading: false,
  error: null,
};

const bannerSlice = createSlice({
  name: 'banner',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchBanner.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBanner.fulfilled, (state, action) => {
        state.listBanner = action.payload;
        state.loading = false;
      })
      .addCase(fetchBanner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string | null;
      });
  },
});

export default bannerSlice.reducer;
