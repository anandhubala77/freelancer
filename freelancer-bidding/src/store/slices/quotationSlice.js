import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { base_url } from "../../services/base_url";

// Set the default base URL
axios.defaults.baseURL = base_url;


export const submitQuotation = createAsyncThunk(
  "quotation/submitQuotation",
  async ({ quoteData, token }, { rejectWithValue }) => {
    try {
      const res = await axios.post("/quotations", quoteData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data.message || "Submission failed");
    }
  }
);

// ✅ Fetch quotations for a specific job
export const fetchQuotations = createAsyncThunk(
  'quotation/fetchQuotations',
  async ({ jobId, token }, { rejectWithValue }) => {
    try {
      const res = await axios.get(`/quotations/job/${jobId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { error: 'Fetching failed' });
    }
  }
);

// ✅ Fetch quotations submitted by current job seeker
export const fetchMyQuotations = createAsyncThunk(
  'quotation/fetchMyQuotations',
  async (token, { rejectWithValue }) => {
    try {
      const res = await axios.get('/quotations/my', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { error: 'Failed to fetch your quotations' });
    }
  }
);

// ✅ Update quotation status
export const updateQuotationStatus = createAsyncThunk(
  'quotation/updateQuotationStatus',
  async ({ quotationId, status, token }, { rejectWithValue }) => {
    try {
      const res = await axios.patch(
        `/quotations/${quotationId}/status`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { error: 'Update failed' });
    }
  }
);


export const requestCorrection = createAsyncThunk(
  "quotations/requestCorrection",
  async ({ quotationId, message }, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const token = state.auth?.user?.token;

      const res = await axios.put(
        `/quotations/${quotationId}/request-correction`,
        { message },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return res.data.quotation;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.error || "Failed to request correction"
      );
    }
  }
);



// Slice
const quotationSlice = createSlice({
  name: 'quotation',
  initialState: {
    loading: false,
    error: null,
    quotations: [],
    myQuotations: [],
    successMessage: null,
  },
  reducers: {
    resetQuotationState: (state) => {
      state.loading = false;
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Submit quotation
      .addCase(submitQuotation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitQuotation.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
      })
      .addCase(submitQuotation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Submission failed';
      })

      // Fetch quotations by job
      .addCase(fetchQuotations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuotations.fulfilled, (state, action) => {
        state.loading = false;
        state.quotations = action.payload;
      })
      .addCase(fetchQuotations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Fetching failed';
      })

      // Fetch my quotations
      .addCase(fetchMyQuotations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyQuotations.fulfilled, (state, action) => {
        state.loading = false;
        state.myQuotations = action.payload;
      })
      .addCase(fetchMyQuotations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to fetch your quotations';
      })

      // Update quotation status
      .addCase(updateQuotationStatus.fulfilled, (state, action) => {
        state.successMessage = action.payload.message;
        const updated = action.payload.updated;
        state.quotations = state.quotations.map((q) =>
          q._id === updated._id ? updated : q
        );
      })
      .addCase(updateQuotationStatus.rejected, (state, action) => {
        state.error = action.payload?.error || 'Update failed';
      })
      .addCase(requestCorrection.fulfilled, (state, action) => {
        const updated = action.payload.quotation; 
        const index = state.quotations.findIndex(q => q._id === updated._id);
        if (index !== -1) {
          state.quotations[index] = updated;
        }
      })
      
      
  },
});

export const { resetQuotationState } = quotationSlice.actions;
export default quotationSlice.reducer;
