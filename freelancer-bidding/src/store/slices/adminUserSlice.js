// store/slices/adminUserSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { base_url } from "../../services/base_url";

export const fetchAllUsers = createAsyncThunk(
  "admin/fetchAllUsers",
  async (
    { page = 1, limit = 10, q = "", sortBy = "createdAt", sortOrder = "desc" } = {},
    { rejectWithValue }
  ) => {
    try {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", String(limit));
      if (q) params.set("q", q);
      if (sortBy) params.set("sortBy", sortBy);
      if (sortOrder) params.set("sortOrder", sortOrder);
      const res = await axios.get(`${base_url}/admin/users?${params.toString()}`);
      return res.data; // { items, total, currentPage, totalPages }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const deleteUser = createAsyncThunk(
  "admin/deleteUser",
  async (userId, { rejectWithValue }) => {
    try {
      await axios.delete(`${base_url}/admin/users/${userId}`);
      return userId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const adminUserSlice = createSlice({
  name: "adminUsers",
  initialState: {
    users: [],
    status: "idle",
    error: null,
    total: 0,
    currentPage: 1,
    totalPages: 1,
    limit: 10,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllUsers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.users = action.payload.items || [];
        state.total = action.payload.total || 0;
        state.currentPage = action.payload.currentPage || 1;
        state.totalPages = action.payload.totalPages || 1;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((u) => u._id !== action.payload);
      });
  },
});

export const selectAllUsers = (state) => state.adminUsers.users;
export const selectAdminUsersPagination = (state) => ({
  total: state.adminUsers.total,
  currentPage: state.adminUsers.currentPage,
  totalPages: state.adminUsers.totalPages,
  limit: state.adminUsers.limit,
});
export default adminUserSlice.reducer;
