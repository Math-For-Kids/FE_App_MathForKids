import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Api from "../api/api";

// Lấy tất cả thông báo theo pupilId
export const notificationsByPupilId = createAsyncThunk(
  "pupilnotifications/fetchByPupilId",
  async (pupilId, { rejectWithValue }) => {
    try {
      const res = await Api.get(
        `/pupilnotification/getWithin30Days/${pupilId}`,
        // {
        //   headers: {
        //     "Cache-Control": "no-cache",
        //   },
        // }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Lấy thông báo theo id
export const notificationById = createAsyncThunk(
  "pupilnotifications/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await Api.get(`/pupilnotification/${id}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Cập nhật thông báo
export const updatePupilNotification = createAsyncThunk(
  "pupilnotifications/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await Api.put(`/pupilnotification/${id}`, data);
      return { id, ...data }; // Trả về để cập nhật state.list nếu cần
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const notificationSlice = createSlice({
  name: "pupilnotifications",
  initialState: {
    list: [],
    current: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentNotification: (state) => {
      state.current = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch by pupilId
      .addCase(notificationsByPupilId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(notificationsByPupilId.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(notificationsByPupilId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch by ID
      .addCase(notificationById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(notificationById.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload;
      })
      .addCase(notificationById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update notification
      .addCase(updatePupilNotification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePupilNotification.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.list.findIndex((n) => n.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = {
            ...state.list[index],
            ...action.payload,
          };
        }
      })
      .addCase(updatePupilNotification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
