import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { base_url } from "../../services/base_url";

// Set base URL for Axios
axios.defaults.baseURL = base_url;

// Async thunk to fetch all jobs
export const fetchJobs = createAsyncThunk(
  "jobs/fetchJobs",
  async (arg, { rejectWithValue }) => {
    try {
      // Support both usages: fetchJobs(tokenString) OR fetchJobs({ token, page, limit })
      const isObj = typeof arg === "object" && arg !== null;
      const token = isObj ? arg.token : arg;
      const page = isObj && arg.page ? arg.page : 1;
      const limit = isObj && arg.limit ? arg.limit : 10;

      const response = await axios.get(`/projects?page=${page}&limit=${limit}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Return full pagination payload from backend
      return response.data; // { projects, totalProjects, currentPage, totalPages }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Create job slice
const jobSlice = createSlice({
  name: "jobs",
  initialState: {
    list: [],       // Job list array
    loading: false,
    error: null,
    currentPage: 1,
    totalPages: 1,
    totalProjects: 0,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload || {};
        state.list = payload.projects || [];
        state.currentPage = payload.currentPage || 1;
        state.totalPages = payload.totalPages || 1;
        state.totalProjects = payload.totalProjects || 0;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch jobs";
      });
  },
});

export default jobSlice.reducer;
export const selectJobsPagination = (state) => ({
  currentPage: state.jobs.currentPage,
  totalPages: state.jobs.totalPages,
  totalProjects: state.jobs.totalProjects,
});
