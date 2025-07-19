import {createAsyncThunk} from '@reduxjs/toolkit';
import notificationService from '../../../services/notificaton';

export const fetchNotifications = createAsyncThunk(
  'notification/fetchNotifications',
  async (_, thunkAPI) => {
    try {
      const notifications = await notificationService.getNotifications();
      return notifications; // Trả về mảng thông báo
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);

export const markNotificationAsRead = createAsyncThunk(
  'notification/markAsRead',
  async (notificationId: string, thunkAPI) => {
    try {
      const updatedNotification = await notificationService.markAsRead(
        notificationId,
      );
      return updatedNotification; // Trả về thông báo đã được đánh dấu là đã đọc
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);
