import {createSlice} from '@reduxjs/toolkit';
import {
  fetchAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
} from '../../actions/address';

interface AddressState {
  listAddress: any[];
  loading: boolean;
  error: string | null;
}

const initialState: AddressState = {
  listAddress: [],
  loading: false,
  error: null,
};

const addressSlice = createSlice({
  name: 'address',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchAddresses.pending, state => {
        state.loading = true;
      })
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.loading = false;
        state.listAddress = action.payload;
      })
      .addCase(fetchAddresses.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      .addCase(addAddress.fulfilled, (state, action) => {
        state.listAddress.unshift(action.payload); // Thêm đầu danh sách
      })
      .addCase(updateAddress.fulfilled, (state, action) => {
        const index = state.listAddress.findIndex(
          item => item._id === action.payload._id,
        );
        if (index !== -1) {
          state.listAddress[index] = action.payload;
        }
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.listAddress = state.listAddress.filter(
          item => item._id !== action.payload.id,
        );
      });
  },
});

export default addressSlice.reducer;
