import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Api from "../api/api";

// Lấy thông tin người dùng theo ID
export const profileById = createAsyncThunk(
  "profile/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await Api.get(`/user/${id}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

//Cập nhật thông tin người dùng
export const updateProfile = createAsyncThunk(
  "profile/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await Api.put(`/user/${id}`, data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// UPLOAD AVATAR (multipart/form-data)
export const uploadAvatar = createAsyncThunk(
  "profile/uploadAvatar",
  async ({ id, uri }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      const fileName = uri.split("/").pop();
      const fileType = fileName.split(".").pop();

      formData.append("avatar", {
        uri,
        name: fileName,
        type: `image/${fileType}`,
      });

      const res = await Api.post(`/user/${id}/avatar`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return res.data.avatar; 
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || "Upload failed"
      );
    }
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState: {
    info: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearProfile: (state) => {
      state.info = null;
      state.error = null;
    },
    setAvatar: (state, action) => {
      if (state.info) {
        state.info.avatar = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Lấy profile
      .addCase(profileById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(profileById.fulfilled, (state, action) => {
        state.loading = false;
        state.info = action.payload;
      })
      .addCase(profileById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Cập nhật profile
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        if (state.info) {
          Object.assign(state.info, action.payload);
        }
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Upload avatar
      .addCase(uploadAvatar.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadAvatar.fulfilled, (state, action) => {
        state.loading = false;
        if (state.info) {
          state.info.avatar = action.payload;
        }
      })
      .addCase(uploadAvatar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearProfile, setAvatar } = profileSlice.actions;
export default profileSlice.reducer;
