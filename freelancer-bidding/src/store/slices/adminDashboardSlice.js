// adminDashboardSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { base_url } from "../../services/base_url";

export const fetchDashboardMetrics = createAsyncThunk(
  "admin/fetchDashboardMetrics",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${base_url}/admin/dashboard-metrics`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const adminDashboardSlice = createSlice({
  name: "adminDashboard",
  initialState: {
    metrics: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardMetrics.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDashboardMetrics.fulfilled, (state, action) => {
        state.loading = false;
        state.metrics = action.payload;
      })
      .addCase(fetchDashboardMetrics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default adminDashboardSlice.reducer;
