import {createAction, createAsyncThunk} from '@reduxjs/toolkit';
import types from '../../types';
import auth, {
  LoginState,
  ProfileState,
  RegisterState,
} from '../../../services/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Login {
  tk: string;
  mk: string;
}

export const login = createAction<Login>(types.auth.login);
export const setToken = createAction<string>(types.auth.setToken);
export const onLogout = createAction(types.auth.logout);

// Đăng nhập
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({email, password}: LoginState, thunkAPI) => {
    try {
      const data = await auth.login({email, password});
      return data; // { token, user }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || 'Lỗi đăng nhập');
    }
  },
);

//  Đăng ký
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async ({name, email, phone, password}: RegisterState, thunkAPI) => {
    try {
      const data = await auth.register({
        name,
        email,
        phone,
        password,
      });
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || 'Lỗi đăng ký');
    }
  },
);

//  Lấy profile từ token (khi app khởi động lại)
export const fetchProfile = createAsyncThunk(
  'auth/fetchProfile',
  async (_, thunkAPI) => {
    try {
      const data = await auth.getProfile();
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || 'Không thể lấy profile');
    }
  },
);

// Auto app
export const loadUserFromStorage = createAsyncThunk(
  'auth/loadUserFromStorage',
  async (_, thunkAPI) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) return thunkAPI.rejectWithValue('Không có token');

      const response = await auth.getProfile(); // Gửi token tự động qua axios interceptor
      return {token, user: response};
    } catch (error) {
      return thunkAPI.rejectWithValue('Token không hợp lệ hoặc hết hạn');
    }
  },
);

// Gửi email để nhận mã OTP
export const sendForgotOTP = createAsyncThunk(
  'auth/sendForgotOTP',
  async (email: string, thunkAPI) => {
    try {
      const response = await auth.forgotPassword(email);
      return response; // { message: 'OTP sent' }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || 'Lỗi gửi OTP');
    }
  },
);

// Xác minh mã OTP
export const verifyOTP = createAsyncThunk(
  'auth/verifyOTP',
  async (data: {email: string; otp: string}, thunkAPI) => {
    try {
      const response = await auth.verifyOTP(data.email, data.otp);
      return response; // { success: true }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || 'OTP không hợp lệ');
    }
  },
);

// Đặt lại mật khẩu mới
export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (data: {email: string; newPassword: string}, thunkAPI) => {
    try {
      const response = await auth.resetPassword(data.email, data.newPassword);
      return response; // { message: 'Password reset successfully' }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || 'Lỗi đổi mật khẩu');
    }
  },
);

// Cập nhật thông tin người dùng
export const updateUserProfile = createAsyncThunk(
  'auth/updateUserProfile',
  async (data: ProfileState, thunkAPI) => {
    try {
      const res = await auth.updateProfile(data);
      return res.user; // res.user
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || 'Lỗi cập nhật hồ sơ');
    }
  },
);

// Cập nhật avatar
export const updateUserAvatar = createAsyncThunk(
  'auth/updateUserAvatar',
  async (formData: FormData, thunkAPI) => {
    try {
      const res = await auth.updateAvatar(formData);
      console.log('AAAAA', res);
      return res.user; // res.user
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || 'Lỗi cập nhật avatar');
    }
  },
);
