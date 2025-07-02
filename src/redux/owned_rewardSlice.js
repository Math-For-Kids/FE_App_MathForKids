import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Api from "../api/api";

// Thunk: Tạo hoặc cập nhật owned_reward
export const createOrUpdate = createAsyncThunk(
  "owned_reward/createOrUpdate",
  async ({ pupilId, rewardId, quantity }, { rejectWithValue }) => {
    try {
      const res = await Api.post(`/ownereward/create/${pupilId}/${rewardId}`, {
        quantity,
      });
      console.log("Create/Update API Full Response:", res.data);
      // Không trả về res.data.data vì API không cung cấp dữ liệu bản ghi
      return { success: true, message: res.data.message };
    } catch (err) {
      console.error("Error in createOrUpdate:", err);
      if (err.response?.status === 404) {
        console.log("Endpoint or resource not found:", { pupilId, rewardId });
        return rejectWithValue(
          "Resource not found for creating or updating reward"
        );
      }
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Thunk: Lấy danh sách owned_reward theo pupilId
export const getByPupilId = createAsyncThunk(
  "owned_reward/getByPupilId",
  async (pupilId, { rejectWithValue }) => {
    try {
      const res = await Api.get(`/ownereward/getByPupilId/${pupilId}`);
      console.log("📦 API response getByPupilId:", res.data);
      return res.data && Array.isArray(res.data) ? res.data : [];
    } catch (err) {
      console.error("Error in getByPupilId:", err);
      if (err.response?.status === 404) {
        console.log("No owned_reward found for pupilId:", pupilId);
        return [];
      }
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const ownedRewardSlice = createSlice({
  name: "owned_reward",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createOrUpdate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrUpdate.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        // Không cập nhật state.list vì API không trả về dữ liệu bản ghi
        console.log("createOrUpdate succeeded:", action.payload.message);
      })
      .addCase(createOrUpdate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create or update reward";
      })
      .addCase(getByPupilId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getByPupilId.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.list = action.payload.filter(
          (item) =>
            item &&
            typeof item === "object" &&
            item.id &&
            item.rewardId &&
            item.quantity != null
        );
      })
      .addCase(getByPupilId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch owned rewards";
      });
  },
});

export default ownedRewardSlice.reducer;
