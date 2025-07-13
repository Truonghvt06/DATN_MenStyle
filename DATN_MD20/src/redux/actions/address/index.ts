import {createAsyncThunk} from '@reduxjs/toolkit';
import addressService from '../../../services/address';
import {AddressType} from '../../../services/address/type';

export const fetchAddresses = createAsyncThunk(
  'address/fetchAll',
  async (_, {rejectWithValue}) => {
    try {
      return await addressService.getAddresses();
    } catch (err) {
      return rejectWithValue(err);
    }
  },
);

export const addAddress = createAsyncThunk(
  'address/add',
  async (data: AddressType, {rejectWithValue}) => {
    try {
      return await addressService.addAddress(data);
    } catch (err) {
      return rejectWithValue(err);
    }
  },
);

export const updateAddress = createAsyncThunk(
  'address/update',
  async ({id, data}: {id: string; data: AddressType}, {rejectWithValue}) => {
    try {
      return await addressService.updateAddress(id, data);
    } catch (err) {
      return rejectWithValue(err);
    }
  },
);

export const deleteAddress = createAsyncThunk(
  'address/delete',
  async (id: string, {rejectWithValue}) => {
    try {
      return await addressService.deleteAddress(id);
    } catch (err) {
      return rejectWithValue(err);
    }
  },
);
