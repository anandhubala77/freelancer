import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { base_url } from "../../services/base_url";

axios.defaults.baseURL = base_url;

// Thunk to fetch applications by hiring person
export const fetchApplicationsByHiringPerson = createAsyncThunk(
  "applications/fetchByHiringPerson",
  async (_, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const token = state.auth?.user?.token;

      const res = await axios.get(`/hire`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const updateApplicationStatus = createAsyncThunk(
  "applications/updateStatus",
  async ({ id, status }, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth?.user?.token;
      const response = await axios.patch(
        `/hire/${id}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
export const fetchApplicationsByJobSeeker = createAsyncThunk(
  "applications/fetchByJobSeeker",
  async (_, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const token = state.auth?.user?.token;
      const userId = state.auth?.user?._id;

      const res = await axios.get(`/jobseeker/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);
export const withdrawApplication = createAsyncThunk(
  "applications/withdraw",
  async ({ id, token }, { rejectWithValue }) => {
    try {
      const res = await axios.patch(
        `/jobseeker/${id}/withdraw`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data.application;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);
// --- NEW: reportJobSeeker ---
export const reportJobSeeker = createAsyncThunk(
  "applications/reportJobSeeker",
  async ({ userId, reason, token }, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `/users/${userId}/report`,
        { reason },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to report user"
      );
    }
  }
);

export const submitCompletedWork = createAsyncThunk(
  "hireRequest/submitCompletedWork",
  async ({ quotationId, link, message, token }, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `/work/${quotationId}/submit-work`,
        { link, message },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Error submitting work"
      );
    }
  }
);





const applicationSlice = createSlice({
  name: "application",
  initialState: {
    applications: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchApplicationsByHiringPerson.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchApplicationsByHiringPerson.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.applications = action.payload;
      })
      .addCase(fetchApplicationsByHiringPerson.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })
      .addCase(updateApplicationStatus.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.applications.findIndex(
          (app) => app._id === updated._id
        );
        if (index !== -1) {
          state.applications[index] = updated;
        }
      })
      .addCase(updateApplicationStatus.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      })

      .addCase(fetchApplicationsByJobSeeker.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchApplicationsByJobSeeker.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.applications = action.payload;
      })
      .addCase(fetchApplicationsByJobSeeker.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })
      .addCase(withdrawApplication.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.applications.findIndex(
          (app) => app._id === updated._id
        );
        if (index !== -1) {
          state.applications[index] = updated;
        }
      });
  },
});

// ✅ Moved outside the slice
export default applicationSlice.reducer;

export const selectAllApplications = (state) =>
  state.application?.applications ?? [];

export const selectApplicationsStatus = (state) =>
  state.application?.status ?? "idle";

export const selectApplicationsError = (state) =>
  state.application?.error ?? null;
