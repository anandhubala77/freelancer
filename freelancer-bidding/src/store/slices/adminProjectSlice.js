// src/store/slices/adminProjectSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { base_url } from '../../services/base_url';

// Fetch all projects (paginated)
export const fetchAllProjects = createAsyncThunk(
  'admin/fetchAllProjects',
  async (
    { page = 1, limit = 10, q = '', sortBy = 'createdAt', sortOrder = 'desc' } = {},
    { rejectWithValue }
  ) => {
    try {
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('limit', String(limit));
      if (q) params.set('q', q);
      if (sortBy) params.set('sortBy', sortBy);
      if (sortOrder) params.set('sortOrder', sortOrder);
      const res = await axios.get(`${base_url}/admin/projects?${params.toString()}`);
      return res.data; // { items, total, currentPage, totalPages }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Delete a project
export const adminDeleteProject = createAsyncThunk(
  'admin/deleteProject',
  async (projectId, { rejectWithValue }) => {
    try {
      console.log("Deleting project:", projectId); // ✅
      const res = await axios.delete(`${base_url}/admin/projects/${projectId}`);
      return projectId;
    } catch (err) {
      console.error("DELETE Error", err); // ✅
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);


const adminProjectsSlice = createSlice({
  name: 'adminProjects',
  initialState: {
    projects: [],
    status: 'idle',
    error: null,
    total: 0,
    currentPage: 1,
    totalPages: 1,
    limit: 10,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProjects.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAllProjects.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.projects = action.payload.items || [];
        state.total = action.payload.total || 0;
        state.currentPage = action.payload.currentPage || 1;
        state.totalPages = action.payload.totalPages || 1;
      })
      .addCase(fetchAllProjects.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(adminDeleteProject.fulfilled, (state, action) => {
        state.projects = state.projects.filter(p => p._id !== action.payload);
      });
  }
});

export const selectAdminProjects = (state) => state.adminProjects.projects || [];
export const getAdminProjectsStatus = (state) => state.adminProjects.status;
export const getAdminProjectsError = (state) => state.adminProjects.error;
export const selectAdminProjectsPagination = (state) => ({
  total: state.adminProjects.total,
  currentPage: state.adminProjects.currentPage,
  totalPages: state.adminProjects.totalPages,
  limit: state.adminProjects.limit,
});

export default adminProjectsSlice.reducer;
