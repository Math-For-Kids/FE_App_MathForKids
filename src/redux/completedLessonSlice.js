import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Api from "../api/api"; // file Api config axios của bạn

// Thunk: Gọi API complete and unlock next
export const completeAndUnlockNextLesson = createAsyncThunk(
  "completedLesson/completeAndUnlockNextLesson",
  async ({ pupilId, lessonId }, { rejectWithValue }) => {
    try {
      const res = await Api.patch(
        `/completedlesson/completeAndUnlockNext/${pupilId}/lesson/${lessonId}`
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const completedLessonSlice = createSlice({
  name: "completedLesson",
  initialState: {
    loading: false,
    message: null,
    error: null,
  },
  reducers: {
    resetCompletedLessonState: (state) => {
      state.loading = false;
      state.message = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(completeAndUnlockNextLesson.pending, (state) => {
        state.loading = true;
        state.message = null;
        state.error = null;
      })
      .addCase(completeAndUnlockNextLesson.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(completeAndUnlockNextLesson.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetCompletedLessonState } = completedLessonSlice.actions;

export default completedLessonSlice.reducer;
