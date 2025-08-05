import {createAsyncThunk} from '@reduxjs/toolkit';
import favoriteService from '../../../services/favorite';

export const toggleFavorite = createAsyncThunk(
  'favorite/toggleFavorite',
  async (productId: string, {rejectWithValue}) => {
    try {
      const data = await favoriteService.toggleFavoriteAPI(productId);
      return {productId, isFavorite: data.isFavorite};
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const fetchFavorites = createAsyncThunk(
  'favorite/fetchFavorites',
  async (_, {rejectWithValue}) => {
    try {
      const favorites = await favoriteService.getFavoritesAPI();
      // console.log('FAVO:', favorites);

      //   return favorites.map((item: any) => item._id); // Trả về mảng ID
      return favorites; // Trả về mảng ID
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const deleteFavorite = createAsyncThunk(
  'favorite/deleteFavorite',
  async (productId: string, {rejectWithValue}) => {
    try {
      const data = await favoriteService.deleteFavoriteAPI(productId);
      return productId;
    } catch (err) {
      return rejectWithValue(err);
    }
  },
);

export const clearFavorites = createAsyncThunk(
  'favorite/clearFavorites',
  async (_, {rejectWithValue}) => {
    try {
      await favoriteService.clearFavoritesAPI();
      return;
    } catch (err) {
      return rejectWithValue(err);
    }
  },
);
