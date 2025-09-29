// features/payment/paymentSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { base_url } from "../../services/base_url";

axios.defaults.baseURL = base_url;

// Create Razorpay Order
export const createPaymentOrder = createAsyncThunk(
  "payment/createOrder",
  async ({ amount, jobId, paidTo }, thunkAPI) => {
    try {
      const res = await axios.post("/payment/create-order", {
        amount,
        jobId,
        paidTo,
      });
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Mark Payment Success
export const markPaymentSuccess = createAsyncThunk(
  "payment/markSuccess",
  async (paymentDetails, thunkAPI) => {
    try {
      const res = await axios.post("/payment/mark-success", paymentDetails);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Get Received Payments
export const getReceivedPayments = createAsyncThunk(
  "payment/getReceivedPayments",
  async (freelancerId, thunkAPI) => {
    try {
      const res = await axios.get(`/payment/received/${freelancerId}`);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data || "Failed to fetch");
    }
  }
);

// Get Sent Payments
export const getSentPayments = createAsyncThunk(
  "payment/getSentPayments",
  async (hiringPersonId, thunkAPI) => {
    try {
      const res = await axios.get(`/payment/sent/${hiringPersonId}`);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data || "Failed to fetch");
    }
  }
);

// Redundant but okay to keep for reuse
export const fetchSentPayments = createAsyncThunk(
  "payment/fetchSentPayments",
  async (userId, thunkAPI) => {
    try {
      const res = await axios.get(`/payment/sent/${userId}`);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || "Error");
    }
  }
);


export const deletePayment = createAsyncThunk(
  "payment/deletePayment",
  async (paymentId, thunkAPI) => {
    try {
      await axios.delete(`/payment/${paymentId}`);
      return paymentId;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || "Delete failed");
    }
  }
);

const paymentSlice = createSlice({
  name: "payment",
  initialState: {
    loading: false,
    orderDetails: null,
    successMessage: null,
    error: null,
    receivedPayments: [],
    sentPayments: [],
  },
  reducers: {
    clearPaymentState: (state) => {
      state.loading = false;
      state.orderDetails = null;
      state.successMessage = null;
      state.error = null;
      state.receivedPayments = [];
      state.sentPayments = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // 🔵 Get Received Payments
      .addCase(getReceivedPayments.pending, (state) => {
        state.loading = true;
      })
      .addCase(getReceivedPayments.fulfilled, (state, action) => {
        state.loading = false;
        state.receivedPayments = action.payload;
      })
      .addCase(getReceivedPayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔵 Get Sent Payments
      .addCase(getSentPayments.pending, (state) => {
        state.loading = true;
      })
      .addCase(getSentPayments.fulfilled, (state, action) => {
        state.loading = false;
        state.sentPayments = action.payload;
      })
      .addCase(getSentPayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔵 Fetch Sent Payments
      .addCase(fetchSentPayments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSentPayments.fulfilled, (state, action) => {
        state.loading = false;
        state.sentPayments = action.payload;
      })
      .addCase(fetchSentPayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🟥 Delete Payment
      .addCase(deletePayment.pending, (state) => {
        state.loading = true;
      })
      .addCase(deletePayment.fulfilled, (state, action) => {
        state.loading = false;
        const deletedId = action.payload;

        // Remove from sentPayments if it exists there
        state.sentPayments = state.sentPayments.filter(
          (p) => p._id !== deletedId
        );

        // Remove from receivedPayments if it exists there
        state.receivedPayments = state.receivedPayments.filter(
          (p) => p._id !== deletedId
        );
      })
      .addCase(deletePayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearPaymentState } = paymentSlice.actions;
export default paymentSlice.reducer;
//1