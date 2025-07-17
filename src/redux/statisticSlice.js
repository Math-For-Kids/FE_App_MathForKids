import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Api from "../api/api";

// Thunk 1: Lấy thống kê điểm theo kỹ năng
export const getUserPointStatsComparison = createAsyncThunk(
  "statistic/getUserPointStatsComparison",
  async ({ pupilId, grade, ranges }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams({ grade });
      if (ranges?.length) params.append("ranges", ranges.join(","));
      const res = await Api.get(
        `/test/getUserPointStatsComparison/${pupilId}?${params.toString()}`
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Thunk 2: Lấy thống kê đúng/sai theo kỹ năng
export const getAnswerStats = createAsyncThunk(
  "statistic/getAnswerStats",
  async ({ pupilId, grade, ranges }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams({ grade });
      if (ranges?.length) params.append("ranges", ranges.join(","));
      const res = await Api.get(
        `/test/getAnswerStats/${pupilId}?${params.toString()}`
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const statisticSlice = createSlice({
  name: "statistic",
  initialState: {
    pointStats: null,
    answerStats: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearStatistic: (state) => {
      state.pointStats = null;
      state.answerStats = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserPointStatsComparison.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserPointStatsComparison.fulfilled, (state, action) => {
        state.loading = false;
        state.pointStats = action.payload;
      })
      .addCase(getUserPointStatsComparison.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getAnswerStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAnswerStats.fulfilled, (state, action) => {
        state.loading = false;
        state.answerStats = action.payload;
      })
      .addCase(getAnswerStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearStatistic } = statisticSlice.actions;
export default statisticSlice.reducer;
