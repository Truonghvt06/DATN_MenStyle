import {createSlice} from '@reduxjs/toolkit';
import {
  clearFavorites,
  deleteFavorite,
  fetchFavorites,
  toggleFavorite,
} from '../../actions/favorite';
import {Product} from '../product/type';

interface FavoriteState {
  listFavorite: Product[];
  listFavoriteIds: string[];

  loading: boolean;
  error: string | null;
}

const initialState: FavoriteState = {
  listFavorite: [],
  listFavoriteIds: [],
  loading: false,
  error: null,
};

const favoriteSlice = createSlice({
  name: 'favorite',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchFavorites.pending, state => {
        state.loading = true;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.listFavorite = action.payload;
        state.listFavoriteIds = action.payload.map((item: Product) => item._id);
        state.loading = false;
      })
      .addCase(fetchFavorites.rejected, (state, action: any) => {
        state.error = action.payload.message;
        state.loading = false;
      })

      .addCase(toggleFavorite.fulfilled, (state, action) => {
        const {productId, isFavorite} = action.payload;
        if (isFavorite) {
          state.listFavoriteIds.push(productId);
        } else {
          state.listFavorite = state.listFavorite.filter(
            p => p._id !== productId,
          );
          state.listFavoriteIds = state.listFavoriteIds.filter(
            id => id !== productId,
          );
        }
      })
      .addCase(deleteFavorite.fulfilled, (state, action) => {
        const id = action.payload;
        state.listFavorite = state.listFavorite.filter(p => p._id !== id);
        state.listFavoriteIds = state.listFavoriteIds.filter(i => i !== id);
      })
      .addCase(clearFavorites.fulfilled, state => {
        state.listFavorite = [];
        state.listFavoriteIds = [];
      });
  },
});

export default favoriteSlice.reducer;
