import {axiosInstance} from '..';

export interface LoginState {
  email: string;
  password: string;
}

export interface ChangePassState {
  oldPassword: string;
  newPassword: string;
}

export interface RegisterState {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface ProfileState {
  name?: string;
  phone?: string;
  gender?: string;
  date_of_birth?: string;
  email?: string;
}

// Đăng nhập
const login = async ({email, password}: LoginState) => {
  try {
    const response = await axiosInstance.post('/accounts/login', {
      email,
      password,
    });
    return response.data; // {token, user}
  } catch (error: any) {
    console.log('Lỗi login:', error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

// Đăng ký
const register = async ({name, email, phone, password}: RegisterState) => {
  try {
    const response = await axiosInstance.post('/accounts/register', {
      name,
      email,
      phone,
      password,
    });
    return response.data;
  } catch (error: any) {
    console.log('Lỗi register:', error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

// Lấy profile từ token
const getProfile = async () => {
  try {
    const response = await axiosInstance.get('/accounts/profile');
    return response.data;
  } catch (error: any) {
    console.log('Lỗi lấy profile:', error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

// Gửi OTP đến email
const forgotPassword = async (email: string) => {
  try {
    const response = await axiosInstance.post('/accounts/forgot-password', {
      email,
    });
    return response.data;
  } catch (error: any) {
    console.log('Lỗi gửi OTP:', error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

//  Xác minh OTP
const verifyOTP = async (email: string, otp: string) => {
  try {
    const response = await axiosInstance.post('/accounts/verify-otp', {
      email,
      otp,
    });
    return response.data;
  } catch (error: any) {
    console.log('Lỗi xác minh OTP:', error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

// Đổi mật khẩu
const resetPassword = async (email: string, newPassword: string) => {
  try {
    const response = await axiosInstance.post('/accounts/reset-password', {
      email,
      newPassword,
    });
    return response.data;
  } catch (error: any) {
    console.log('Lỗi đổi mật khẩu:', error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

// Cập nhật thông tin hồ sơ
const updateProfile = async (data: ProfileState) => {
  try {
    const response = await axiosInstance.put('/accounts/update-profile', data);
    return response.data;
  } catch (error: any) {
    console.log('Lỗi cập nhật hồ sơ:', error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

// Cập nhật ảnh đại diện
const updateAvatar = async (formData: FormData) => {
  try {
    const response = await axiosInstance.put(
      '/accounts/update-avatar',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    return response.data;
  } catch (error: any) {
    console.log('Lỗi cập nhật avatar:', error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

// update fcm token
const updateFcmToken = async (fcmToken: string) => {
  try {
    const response = await axiosInstance.put('/accounts/update-fcm-token', {
      fcmToken,
    });
    return response.data;
  } catch (error: any) {
    console.error(
      'Lỗi cập nhật FCM token:',
      error?.response?.data || error.message,
    );
    throw error?.response?.data || error;
  }
};

// Đoi mat khau
// const changePassword = async (data: ChangePassState) => {
//   try {
//     const response = await axiosInstance.put('/accounts/change-password', data);
//     return response.data;
//   } catch (error: any) {
//     const message = error?.response?.data?.message || 'Đổi mật khẩu thất bại';
//     throw new Error(message);
//   }
// };
const verifyOldPassword = async (oldPassword: string) => {
  try {
    const res = await axiosInstance.post('/accounts/verify-password', {
      oldPassword,
    });
    return res.data;
  } catch (error: any) {
    const message = error?.response?.data?.message || 'Mật khẩu cũ sai';
    throw new Error(message);
  }
};

const updatePassword = async (newPassword: string) => {
  try {
    const res = await axiosInstance.patch('/accounts/update-password', {
      newPassword,
    });
    return res.data;
  } catch (error: any) {
    const message =
      error?.response?.data?.message || 'Đổi mật khẩu mới thất bại';
    throw new Error(message);
  }
};

export default {
  login,
  register,
  getProfile,
  forgotPassword,
  verifyOTP,
  resetPassword,
  updateProfile,
  updateAvatar,
  updateFcmToken,
  verifyOldPassword,
  updatePassword,
};
