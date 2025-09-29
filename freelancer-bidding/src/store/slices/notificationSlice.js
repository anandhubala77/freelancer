// store/slices/notificationSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import { base_url } from "../../services/base_url";

axios.defaults.baseURL = base_url;
// ✅ Utility to get token from sessionStorage
export const getToken = () => {
  const user = sessionStorage.getItem("user");
  if (user) {
    const parsed = JSON.parse(user);
    return parsed.token;
  }
  return null;
};

// ✅ GET notifications
export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async (_, { rejectWithValue }) => {
    try {
      const token = getToken(); // ✅ use token here
      const response = await axios.get("/notifications", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch notifications"
      );
    }
  }
);

// ✅ PUT seen status
export const markNotificationSeen = createAsyncThunk(
  "notifications/markSeen",
  async (id, { rejectWithValue }) => {
    try {
      const token = getToken(); // ✅ use token here
      await axios.put(
        `/notifications/${id}/seen`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return { id };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to mark as seen"
      );
    }
  }
);

// ✅ Slice
const notificationSlice = createSlice({
  name: "notifications",
  initialState: {
    notifications: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchNotifications
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // markNotificationSeen
      .addCase(markNotificationSeen.fulfilled, (state, action) => {
        state.notifications = state.notifications.map((notif) =>
          notif._id === action.payload.id ? { ...notif, seen: true } : notif
        );
      });
  },
});

export default notificationSlice.reducer;
