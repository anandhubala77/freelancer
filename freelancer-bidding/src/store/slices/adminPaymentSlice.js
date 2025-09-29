import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { base_url } from "../../services/base_url";

axios.defaults.baseURL = base_url;

// ✅ Thunk: Fetch all payments for admin
export const fetchAdminPayments = createAsyncThunk(
  "adminPayments/fetchAll",
  async ({ page = 1, limit = 10 } = {}, thunkAPI) => {
    try {
      const res = await axios.get(`/payment/admin/all-payments?page=${page}&limit=${limit}`);
      return res.data; // { items, total, currentPage, totalPages }
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || "Error fetching payments");
    }
  }
);

// ✅ Thunk: Delete a payment by ID
export const deletePayment = createAsyncThunk(
  "adminPayments/deletePayment",
  async (paymentId, thunkAPI) => {
    try {
      await axios.delete(`/payment/${paymentId}`);
      return paymentId; // return the ID so we can filter it out in reducer
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || "Delete failed");
    }
  }
);

const adminPaymentSlice = createSlice({
  name: "adminPayments",
  initialState: {
    loading: false,
    payments: [],
    error: null,
    total: 0,
    currentPage: 1,
    totalPages: 1,
    limit: 10,
  },
  reducers: {
    clearAdminPaymentState: (state) => {
      state.loading = false;
      state.payments = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 🔵 Fetch All Payments
      .addCase(fetchAdminPayments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminPayments.fulfilled, (state, action) => {
        state.loading = false;
        state.payments = action.payload.items || [];
        state.total = action.payload.total || 0;
        state.currentPage = action.payload.currentPage || 1;
        state.totalPages = action.payload.totalPages || 1;
      })
      .addCase(fetchAdminPayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔴 Delete Payment
      .addCase(deletePayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePayment.fulfilled, (state, action) => {
        state.loading = false;
        const deletedId = action.payload;
        state.payments = state.payments.filter((p) => p._id !== deletedId);
      })
      .addCase(deletePayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// ✅ Export actions and reducer
export const { clearAdminPaymentState } = adminPaymentSlice.actions;

export default adminPaymentSlice.reducer;
export const selectAdminPayments = (state) => state.adminPayments.payments;
export const selectAdminPaymentsPagination = (state) => ({
  total: state.adminPayments.total,
  currentPage: state.adminPayments.currentPage,
  totalPages: state.adminPayments.totalPages,
  limit: state.adminPayments.limit,
});
