import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Api from "../api/api";

export const getRewardByDisabledStatus = createAsyncThunk(
  "reward/filterByDisabledStatus",
  async (_, { rejectWithValue }) => {
    try {
      const res = await Api.get(
        `/reward/filterByDisabledStatus?isDisabled=false`
      );
      console.log("reward:", res.data.data);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const getRewardById = createAsyncThunk(
  "reward/getRewardById",
  async (rewardId, { rejectWithValue }) => {
    try {
      const res = await Api.get(`/reward/${rewardId}`);
      console.log("Get Reward by ID API Response:", res.data.data);
      return res.data.data;
    } catch (err) {
      console.error("Error in getRewardById:", err);
      if (err.response?.status === 404) {
        console.log("Reward not found for rewardId:", rewardId);
        return rejectWithValue("Reward not found");
      }
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const rewardSlice = createSlice({
  name: "reward",
  initialState: {
    list: [], // Lưu danh sách phần thưởng
    selectedReward: null, // Lưu phần thưởng được lấy theo ID
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getRewardByDisabledStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
        console.log("getRewardByDisabledStatus: Pending");
      })
      .addCase(getRewardByDisabledStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload || [];
        console.log(
          "getRewardByDisabledStatus: Fulfilled with data:",
          action.payload
        );
      })
      .addCase(getRewardByDisabledStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.log(
          "getRewardByDisabledStatus: Rejected with error:",
          action.payload
        );
      })
      .addCase(getRewardById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRewardById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedReward = action.payload;
        state.error = null;
      })
      .addCase(getRewardById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default rewardSlice.reducer;
