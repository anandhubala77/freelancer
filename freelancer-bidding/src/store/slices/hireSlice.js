// src/store/slices/hireSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { base_url } from "../../services/base_url";


axios.defaults.baseURL = base_url;
// Get token from sessionStorage
const getToken = () => {
  const user = sessionStorage.getItem("user");
  if (!user) return null;
  const parsed = JSON.parse(user);
  return parsed.token;
};

// 1. Fetch all job seekers
export const fetchJobSeekers = createAsyncThunk(
  "hire/fetchJobSeekers",
  async (_, { rejectWithValue }) => {
    try {
      const token = getToken();
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const res = await axios.get(`${base_url}/users/jobseekers`, config);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch job seekers"
      );
    }
  }
);

// 2. Send hire request
export const sendHireRequest = createAsyncThunk(
  "hire/sendHireRequest",
  async ({ jobId, receiverId, message }, { rejectWithValue }) => {
    try {
      const token = getToken();
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const payload = {
        jobId,
        receiverId,
        message,
      };
      const res = await axios.post(`${base_url}/hire/request`, payload, config);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to send hire request"
      );
    }
  }
);

// Slice
const hireSlice = createSlice({
  name: "hire",
  initialState: {
    jobSeekers: [],
    hireStatus: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchJobSeekers
      .addCase(fetchJobSeekers.pending, (state) => {
        state.hireStatus = "loading";
        state.error = null;
      })
      .addCase(fetchJobSeekers.fulfilled, (state, action) => {
        state.hireStatus = "succeeded";
        state.jobSeekers = action.payload;
      })
      .addCase(fetchJobSeekers.rejected, (state, action) => {
        state.hireStatus = "failed";
        state.error = action.payload;
      })

      // sendHireRequest
      .addCase(sendHireRequest.pending, (state) => {
        state.hireStatus = "loading";
        state.error = null;
      })
      .addCase(sendHireRequest.fulfilled, (state) => {
        state.hireStatus = "succeeded";
      })
      .addCase(sendHireRequest.rejected, (state, action) => {
        state.hireStatus = "failed";
        state.error = action.payload;
      });
  },
});
export const getJobSeekerById = createAsyncThunk(
  "hire/getJobSeekerById",
  async (id, { rejectWithValue }) => {
    try {
      const token = sessionStorage.getItem("user")
        ? JSON.parse(sessionStorage.getItem("user")).token
        : null;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const res = await axios.get(`${base_url}/users/${id}`, config);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch job seeker by ID"
      );
    }
  }
);

export default hireSlice.reducer;
