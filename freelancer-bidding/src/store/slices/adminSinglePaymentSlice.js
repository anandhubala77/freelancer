// store/slices/adminSinglePaymentSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { base_url } from "../../services/base_url";

axios.defaults.baseURL = base_url;

// Thunk to fetch payment by ID
export const fetchPaymentById = createAsyncThunk(
  "adminSinglePayment/fetchById",
  async (paymentId, thunkAPI) => {
    try {
      const res = await axios.get(`/admin/payment/${paymentId}`);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || "Failed to fetch payment details");
    }
  }
);

const adminSinglePaymentSlice = createSlice({
  name: "adminSinglePayment",
  initialState: {
    loading: false,
    payment: null,
    error: null,
  },
  reducers: {
    clearSinglePayment: (state) => {
      state.payment = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPaymentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPaymentById.fulfilled, (state, action) => {
        state.loading = false;
        state.payment = action.payload;
      })
      .addCase(fetchPaymentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Unable to load payment";
      });
  },
});

export const { clearSinglePayment } = adminSinglePaymentSlice.actions;
export default adminSinglePaymentSlice.reducer;
