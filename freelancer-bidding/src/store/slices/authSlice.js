import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { base_url } from "../../services/base_url";

axios.defaults.baseURL = base_url;

// ✅ Register Thunk
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await axios.post("/user/register", userData);

      const { jwt_Token, user_data } = res.data;
      const userToStore = { ...user_data, token: jwt_Token };

      sessionStorage.setItem("token", jwt_Token);
      sessionStorage.setItem("user", JSON.stringify(userToStore));

      return { token: jwt_Token, user: userToStore };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Registration failed"
      );
    }
  }
);

// ✅ Login Thunk
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await axios.post("/user/login", credentials);
      const { jwt_Token, user_data } = res.data;
      const userToStore = user_data ? { ...user_data, token: jwt_Token } : null;

      sessionStorage.setItem("token", jwt_Token);
      sessionStorage.setItem("user", JSON.stringify(userToStore));

      return { token: jwt_Token, user: userToStore };
    } catch (error) {
      console.error("Login error:", error);
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

// ✅ Update Password Thunk
export const updatePassword = createAsyncThunk(
  "auth/updatePassword",
  async ({ oldPassword, newPassword }, { rejectWithValue }) => {
    try {
      const user = JSON.parse(sessionStorage.getItem("user"));
      const token = user?.token;

      if (!token) {
        return rejectWithValue("No authentication token found. Please log in.");
      }

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const res = await axios.put(
        "/user/update-password",
        { oldPassword, newPassword },
        config
      );

      return res.data.message;
    } catch (error) {
      console.error("Password update error:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to update password."
      );
    }
  }
);

// ✅ Update Profile Thunk (includes profileimg URL)
export const updateUserProfile = createAsyncThunk(
  "auth/updateUserProfile",
  async (profileData, { rejectWithValue }) => {
    try {
      const user = JSON.parse(sessionStorage.getItem("user"));
      const token = user?.token;

      if (!token) {
        return rejectWithValue("No authentication token found. Please log in.");
      }

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.put("/user/profile", profileData, config);

      const updatedUserToStore = {
        ...data.user_data,
        token,
      };

      sessionStorage.setItem("user", JSON.stringify(updatedUserToStore));
      return updatedUserToStore;
    } catch (error) {
      console.error("Update profile error:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to update profile."
      );
    }
  }
);
export const uploadProfileImage = createAsyncThunk(
  "auth/uploadProfileImage",
  async ({ formData, token }, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.put("/admin/upload-profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      const updatedUser = {
        ...response.data.user_data,
        token,
      };

      // 🔄 Save to sessionStorage so it persists on refresh
      sessionStorage.setItem("user", JSON.stringify(updatedUser));

      return updatedUser;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Upload failed");
    }
  }
);



// ✅ Slice
const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: sessionStorage.getItem("token") || null,
    user: sessionStorage.getItem("user")
      ? JSON.parse(sessionStorage.getItem("user"))
      : null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.token = null;
      state.user = null;
      sessionStorage.clear();
    },
    initializeAuth: (state) => {
      const token = sessionStorage.getItem("token");
      const user = sessionStorage.getItem("user");

      if (token && user) {
        state.token = token;
        state.user = JSON.parse(user);
      } else if (user) {
        const parsedUser = JSON.parse(user);
        if (parsedUser.token) {
          state.token = parsedUser.token;
          state.user = parsedUser;
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Logi
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Profile
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Password
      .addCase(updatePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(uploadProfileImage.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadProfileImage.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload; // Update user with new profile image
      })
      .addCase(uploadProfileImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, initializeAuth } = authSlice.actions;
export default authSlice.reducer;

//3
