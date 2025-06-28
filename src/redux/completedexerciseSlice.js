import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Api from "../api/api";

// Thunk: Tạo completed_exercise
export const createCompletedExercise = createAsyncThunk(
  "completed_exercise/createCompletedExercise",
  async ({ pupilId, lessonId, point }, { rejectWithValue }) => {
    try {
      console.log("Sending createCompletedExercise with payload:", { pupilId, lessonId, point });
      const res = await Api.post("/completedexercise", { pupilId, lessonId, point });
      console.log("Completed exercise API response:", res.data);
      return res.data;
    } catch (err) {
      console.error("Error in createCompletedExercise:", err);
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const completedExerciseSlice = createSlice({
  name: "completed_exercise",
  initialState: {
    completedExercise: null, // Changed to null to match single-object expectation
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createCompletedExercise.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCompletedExercise.fulfilled, (state, action) => {
        state.loading = false;
        state.completedExercise = action.payload;
      })
      .addCase(createCompletedExercise.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = completedExerciseSlice.actions;
export default completedExerciseSlice.reducer;