import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Api from "../api/api";

// Thunk: Lấy danh sách phần thưởng đang hoạt động (isDisabled == false)
export const getEnabledRewards = createAsyncThunk(
  "reward/getEnabledRewards",
  async (_, { rejectWithValue }) => {
    try {
      const res = await Api.get("/reward/getEnabledRewards");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Slice
const rewardSlice = createSlice({
  name: "reward",
  initialState: {
    rewards: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getEnabledRewards.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getEnabledRewards.fulfilled, (state, action) => {
        state.loading = false;
        state.rewards = action.payload || [];
      })
      .addCase(getEnabledRewards.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default rewardSlice.reducer;
