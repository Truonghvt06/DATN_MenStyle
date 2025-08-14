import {createSlice} from '@reduxjs/toolkit';
import {
  fetchNotifications,
  markNotificationAsRead,
} from '../../actions/notification';

export interface Notification {
  _id: string;
  user_id: string;
  title: string;
  type: string;
  image: string;
  content: string;
  is_read: boolean;
  data: any;
  createdAt: string;
}

interface NotificationState {
  listNotifications: Notification[];
  loading: boolean;
  error: string | null;
}
const initialState: NotificationState = {
  listNotifications: [],
  loading: false,
  error: null,
};
const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    clearNotifications: state => {
      state.listNotifications = [];
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchNotifications.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.listNotifications = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch notifications';
      })
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        const notification = action.payload;
        const index = state.listNotifications.findIndex(
          notification => notification._id === notification._id,
        );
        if (index !== -1) {
          state.listNotifications[index] = notification;
        }
      });
  },
});
export const {clearNotifications} = notificationSlice.actions;
export default notificationSlice.reducer;
